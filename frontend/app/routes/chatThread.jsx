import { useEffect, useRef } from "react";
import { useLoaderData, useNavigation } from "react-router";
import { apiFetch } from "../lib/apiFetch";
import ChatMessages from "../components/chatMessages";
import ChatInput from "../components/chatInput";
import testData from "../../../backend/api-examples/thread-with-content.json";

export async function clientLoader({ params, request }) {
  const messagesResponse = await apiFetch(`/chat/threads/${params.threadId}`);

  if (messagesResponse.status === 404) {
    throw new Response("Thread not found", { status: 404 });
  }

  if (!messagesResponse.ok) {
    throw new Response("Failed to load messages", {
      status: messagesResponse.status,
    });
  }

  const messages = await messagesResponse.json();
  return messages.messages;

  // Test data with image output
  //   const testMessages = testData;
  //   return testMessages.messages;
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const content = formData.get("message");

  if (!content || content.trim() === "") {
    return { error: "Message cannot be empty." };
  }

  const message = {
    prompt_message: content,
  };

  try {
    const response = await apiFetch(`/chat/threads/${params.threadId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (response.status === 404) {
      const error = await response.json();
      return { error: error.error || "Invalid message data" };
    }

    if (!response.ok) {
      return { error: "Failed to send message." };
    }

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export default function ChatThread() {
  const chatBottomRef = useRef(null);
  const messages = useLoaderData();

  const navigation = useNavigation();
  let displayMessages = [...messages];

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
        text_content: "Thinking...",
        content_type: "text",
      },
    };

    displayMessages.push(optimisticUserMessage, optimisticAssistantMessage);
  }

  useEffect(() => {
    if (chatBottomRef.current) {
      setTimeout(() => {
        chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [displayMessages]);

  return (
    <>
      <div className="chat-area">
        <ChatMessages messages={displayMessages} />
        <div ref={chatBottomRef}></div>
      </div>
      <div className="chat-footer">
        <ChatInput />
      </div>
    </>
  );
}
