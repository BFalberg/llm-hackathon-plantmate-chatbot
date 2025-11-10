import { redirect, useNavigation } from "react-router";
import { apiFetch } from "../lib/apiFetch";

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const content = formData.get("message");

  if (!content || content.trim() === "") {
    return { error: "Message cannot be empty." };
  }

  const title = content.trim();

  try {
    const response = await apiFetch(`/chat/threads/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text_content: content }),
    });

    if (response.status === 404) {
      const error = await response.json();
      return { error: error.error || "Invalid thread data" };
    }

    if (!response.ok) {
      return { error: "Failed to create thread." };
    }

    const data = await response.json();

    return redirect(`/chat/${data.thread_id}`);
  } catch (error) {
    return { error: error.message };
  }
}
