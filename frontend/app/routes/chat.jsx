import { useNavigation, useLocation, useSubmit } from "react-router";
import ChatMessages from "../components/chatMessages";
import { useEffect, useRef } from "react";
import ChatInput from "../components/chatInput";

export default function Chat() {
  const chatBottomRef = useRef(null);
  const navigation = useNavigation();
  const location = useLocation();
  const submit = useSubmit();
  let displayMessages = [];

  // Add optimistic UI for new thread creation
  if (navigation.formData?.has("message")) {
    const optimisticUserMessage = {
      type: "prompt",
      prompt: {
        prompt_id: "optimistic-user",
        message: navigation.formData.get("message"),
      },
    };

    const optimisticAssistantMessage = {
      type: "loading",
      output: {
        output_id: "optimistic-assistant",
        text_content: "thinking...",
        content_type: "text",
      },
    };

    displayMessages.push(optimisticUserMessage, optimisticAssistantMessage);
  }

  useEffect(() => {
    // Check for message in location state
    if (location.state?.message) {
      const formData = new FormData();
      formData.append("message", location.state.message);
      submit(formData, {
        method: "post",
        action: "/chat/new",
      });
    }
  }, [location.state, submit]);

  useEffect(() => {
    if (chatBottomRef.current && displayMessages.length > 0) {
      setTimeout(() => {
        chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [displayMessages]);

  return (
    <>
      <div className="chat-area">
        <ChatMessages messages={displayMessages} />
      </div>
      <div className="chat-footer">
        <ChatInput action={"/chat/new"} />
      </div>
    </>
  );
}
