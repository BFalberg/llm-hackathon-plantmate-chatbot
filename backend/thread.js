import sql from "./db.js";

export async function queryThreadInfo(threadId) {
  const rows = await sql`
      SELECT
      user_id,

      thread.thread_id,
      thread.created_at AS thread_created_at,
      title as thread_title,

      prompt.prompt_id,
      prompt.created_at AS prompt_created_at,
      message AS prompt_message,

      output.output_id,
      output.created_at AS output_created_at,
      output.ordering AS output_ordering,
      output.content_type AS output_content_type,
      output.text_content AS output_text_content,
      output.image_url AS output_image_url
      FROM thread 
      LEFT OUTER JOIN prompt ON prompt.thread_id = thread.thread_id
      LEFT OUTER JOIN output ON output.prompt_id = prompt.prompt_id

      WHERE thread.thread_id=${threadId}
      ORDER BY prompt_created_at ASC, output_created_at ASC, output_ordering ASC
    `;
  return rows;
}

export function aggregateThreadInfo(rows) {
  const response = {};

  response.messages = [];

  for (const row of rows) {
    response.title = row.thread_title;

    const prompt_id = row.prompt_id;
    const prompt_exists = response.messages.some(
      (message) =>
        message.type == "prompt" && message.prompt.prompt_id == prompt_id,
    );

    if (!prompt_exists) {
      const message = {
        type: "prompt",
        prompt: {
          prompt_id: row.prompt_id,
          created_at: row.prompt_created_at,
          message: row.prompt_message,
        },
      };
      response.messages.push(message);
    }

    if (row.output_id !== null) {
      const output = {
        type: "output",
        output: {
          output_id: row.output_id,
          created_at: row.output_created_at,
          ordering: row.output_ordering,
          content_type: row.output_content_type,
          text_content: row.output_text_content,
          image_url: row.output_image_url,
        },
      };
      response.messages.push(output);
    }
  }

  return response;
}
