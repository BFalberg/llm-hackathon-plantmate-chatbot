// === Import dependencies ===
import express from "express";
import cors from "cors";
import sql from "./db.js";
import { aggregateThreadInfo, queryThreadInfo } from "./thread.js";
import { buildMistralRequestBody, saveMistralResponse } from "./mistral.js";
import { requireAuth, debugWithoutAuth } from "./auth.js";

// === Setup Express App ===
const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === API Endpoints ===
app.get("/chat/threads", requireAuth, async (req, res) => {
  try {
    const users = await sql`
        SELECT thread_id, created_at, user_id, title
        FROM thread
        ORDER BY created_at DESC;
    `;

    res.json(users);
  } catch (error) {
    console.error("Error fetching threads:", error);

    res.status(500).json({
      error: "Failed to fetch threads from database",
    });
  }
});

app.delete("/chat/threads/:id", requireAuth, async (req, res) => {
  try {
    const threadId = req.params.id;

    /// NOTE: threadId is naively assumed to be a valid UUID lol

    await sql`
        DELETE
        FROM thread
        WHERE thread_id=${threadId}
    `;

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting thread:", error);

    res.status(500).json({
      error: "Failed delete thread from database",
    });
  }
});

app.get("/chat/threads/:id", requireAuth, async (req, res) => {
  try {
    const threadId = req.params.id;
    const threadInfoRows = await queryThreadInfo(threadId);
    const threadInfoAggr = aggregateThreadInfo(threadInfoRows);

    res.json(threadInfoAggr);
  } catch (error) {
    console.error("Error fetching threads:", error);

    res.status(500).json({
      error: "Failed fetch thread from database",
    });
  }
});

app.post("/chat/threads/:id", requireAuth, async (req, res) => {
  const threadId = req.params.id;
  let promptId = null; //Filled out when creating prompt in the database

  try {
    const { prompt_message } = req.body;

    const trimmedContent = prompt_message.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({
        error: "The message cannot be empty",
      });
    }

    const threads = await sql`
      SELECT thread_id
      FROM thread
      WHERE thread_id = ${threadId}
    `;

    if (threads.length === 0) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    const result = await sql`
      INSERT INTO prompt (thread_id, message)
      VALUES (${threadId}, ${trimmedContent})
      RETURNING prompt_id
    `;
    promptId = result[0].prompt_id;
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({
      error: "Failed to create message",
    });
  }

  try {
    const body = await buildMistralRequestBody(threadId);

    const url = `${process.env.MISTRAL_API_URL}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
    });

    const mistralResponse = await response.json();

    await saveMistralResponse(promptId, mistralResponse);
  } catch (error) {
    console.error("Error fetching/saving Mistral API response:", error);
    return res.status(500).json({
      error: "Failed to create message",
    });
  }

  res.sendStatus(201);
});

app.post("/chat/threads", requireAuth, async (req, res) => {
  try {
    const { title, text_content } = req.body;

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return res.status(400).json({
        error: "Title cannot be empty",
      });
    }

    const trimmedContent = text_content.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({
        error: "Content cannot be empty",
      });
    }

    // const userId = "165450e4-1197-43d4-9eca-e90ef581a626";

    const threads = await sql`
    INSERT INTO thread (title, user_id)
    VALUES (${trimmedTitle}, ${req.userId})
    RETURNING thread_id, title, user_id
    `;

    const thread = threads[0];

    const messages = await sql`
      INSERT INTO prompt (thread_id, message)
      VALUES (${thread.thread_id}, ${trimmedContent})
      RETURNING prompt_id, thread_id, message
    `;

    // Create a bot response for the initial chat message
    try {
      // ID of the prompt we just inserted
      const promptId = messages[0].prompt_id;
      const threadId = thread.thread_id;

      const body = await buildMistralRequestBody(threadId);

      const url = `${process.env.MISTRAL_API_URL}/chat/completions`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      });

      const mistralResponse = await response.json();

      await saveMistralResponse(promptId, mistralResponse);
    } catch (error) {
      console.error("Error fetching/saving Mistral API response:", error);
      return res.status(500).json({
        error: "Failed to create message",
      });
    }

    res.status(201).json(messages[0]);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({
      error: "Failed to create thread",
    });
  }
});

// === Start Server ===
app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
