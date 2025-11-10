import { Form } from "react-router";
import { useRef } from "react";
import { useSubmit } from "react-router";

export default function ChatInput({ action }) {
  const submit = useSubmit();
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    submit(e.target);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <Form
      method="POST"
      action={action}
      className="chat-input-form"
      onSubmit={handleSubmit}
    >
      <input
        name="message"
        type="text"
        placeholder="Type your message..."
        ref={inputRef}
        required
      />
    </Form>
  );
}
