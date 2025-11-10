import { Link } from "react-router";
import { useLoaderData, Form, Await } from "react-router";
import { Suspense } from "react";
import { apiFetch } from "../lib/apiFetch";
import bison from "../assets/bison.svg";
import { Delete } from "../components/Icons";

export async function clientLoader({ request }) {
  // Create a promise for the threads data
  const threadsPromise = apiFetch("/chat/threads").then(async (response) => {
    if (!response.ok) {
      throw new Response("Failed to load threads", {
        status: response.status,
      });
    }
    return response.json();
  });

  // Return an object with the promise - no defer function needed
  return {
    threads: threadsPromise,
  };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  if (intent === "delete") {
    const threadId = formData.get("threadId");
    try {
      const response = await apiFetch(`/chat/threads/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return { error: `Failed to delete thread: ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default function Threads() {
  const { threads } = useLoaderData();

  return (
    <div className="page-threads">
      <div className="threads-header">
        <h1>Threads History</h1>
        <img src={bison} alt="bison" className="bison-icon" />
      </div>
      <div className="threads-list">
        <Suspense
          fallback={
            <div className="thread-item loading">
              <a href="#">Getting your threads...</a>
            </div>
          }
        >
          <Await resolve={threads}>
            {(resolvedThreads) =>
              resolvedThreads.map((thread) => (
                <div className="thread-item" key={thread.thread_id}>
                  <Link
                    to={`/chat/${thread.thread_id}`}
                    className=""
                    viewTransition
                  >
                    {thread.title}
                  </Link>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input
                      type="hidden"
                      name="threadId"
                      value={thread.thread_id}
                    />
                    <button
                      className="delete-thread-btn"
                      aria-label={`Delete thread: ${thread.title}`}
                      title="Delete this conversation"
                      type="submit"
                    >
                      <Delete />
                    </button>
                  </Form>
                </div>
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
