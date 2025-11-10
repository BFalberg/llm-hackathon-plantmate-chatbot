import ReactMarkdown from "react-markdown";
export default function ChatBubble({
  role,
  label,
  content,
  contentType,
  imageUrl,
}) {
  if (role === "output") {
    role = "assistant";
  }
  if (role === "prompt") {
    role = "user";
  }

  return (
    <div className={`chat-bubble ${role}`}>
      {label && <span className="chat-label">Herman</span>}
      {contentType === "image" ? (
        <div className="chat-message">
          <img className="chat-image" src={imageUrl} alt="" />
        </div>
      ) : (
        <div className="chat-message">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
