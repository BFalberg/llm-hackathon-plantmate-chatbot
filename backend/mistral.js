import { aggregateThreadInfo, queryThreadInfo } from "./thread.js";
import sql from "./db.js";

export async function buildMistralRequestBody(threadId) {
  const threadInfoRows = await queryThreadInfo(threadId);
  const threadInfoAggr = aggregateThreadInfo(threadInfoRows);

  const systemMessages = [
    {
      role: "system",
      content: `Your name is Herman and you are a cute bison.
Your role is to be a friendly, vegan-friendly meal prep assistant. It is important that you keep a professional tone and respect the user's boundaries and suggestions.

Your primary job is to suggest recipes based on the requests of the user, but you may of course also answer any other question.

If the user tries to change topic from the primary goal of food related discussion, you may gently nudge in the direction of food recipes and related topics.`,
    },
  ];

  const userMessages = threadInfoAggr.messages
    .map((msg) => {
      if (msg.type === "prompt") {
        return {
          role: "user",
          content: msg.prompt.message,
        };
      } else if (msg.type === "output") {
        if (msg.output.content_type === "text") {
          return {
            role: "system",
            content: msg.output.text_content,
          };
        }
      }
      return null;
    })
    .filter((msg) => msg !== null);

  return {
    model: "mistral-small-latest",
    // "Auto" and "image_generation" allows the LLM
    // to generate images when it "wants to"

    // TODO: Actually get the generated images!!! how 2???
    // The mistral API mentions that it can respond with different content types
    // but so far I can only get it to spit out text, even tho it also makes a tool call..
    tool_choice: "auto",
    parallel_tool_calls: false,
    tools: [
      {
        function: {
          name: "image_generation",
          parameters: {},
        },
      },
    ],
    messages: systemMessages.concat(userMessages),
  };
}

export async function saveMistralResponse(promptId, mistralResponse) {
  // NOTE: Assumes exactly 1 choice..
  const firstChoice = mistralResponse.choices[0];

  // TODO: This just assumes a text-only content response,
  // cus we cant get the AI to return multiple parts..
  const messageContent = firstChoice.message.content;
  const ordering = 0;

  await sql`
      INSERT INTO output (
        prompt_id,
        ordering,
        content_type,
        text_content
      ) VALUES (
        ${promptId},
        ${ordering},
        'text',
        ${messageContent}
      )
    `;
}
