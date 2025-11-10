import ChatBubble from "./chatBubble";

export default function ChatMessages({ messages }) {
  return (
    <>
      <ChatBubble
        role="assistant"
        content="Out of ideas for your next meal? DM me 😉"
      />
      {messages.map((msg) => {
        return (
          <ChatBubble
            key={
              msg.type === "output" || msg.type === "loading"
                ? msg.output.output_id
                : msg.prompt.prompt_id
            }
            role={msg.type}
            contentType={
              msg.type === "output" || msg.type === "loading"
                ? msg.output.content_type
                : msg.prompt.content_type
            }
            content={
              msg.type === "output" || msg.type === "loading"
                ? msg.output.text_content
                : msg.prompt.message
            }
            imageUrl={msg.output ? msg.output.image_url : null}
          />
        );
      })}
    </>
  );
}
