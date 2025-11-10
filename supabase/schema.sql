DROP TABLE IF EXISTS thread CASCADE;
CREATE TABLE thread (
    thread_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    title text NOT NULL
);

-- Table for user prompts
DROP TABLE IF EXISTS prompt CASCADE;
CREATE TABLE prompt (
    prompt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    thread_id uuid NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,

    message text NOT NULL
);

-- Table for LLM output (chat responses)
-- We expect each prompt row to have 0-* related outputs
-- (0 if the AI is thinking, 1 if the output is simple text, >1 if its multimedia)

DROP TYPE IF EXISTS llm_content_type CASCADE;
CREATE TYPE llm_content_type AS ENUM ('text', 'image');

DROP TABLE IF EXISTS output CASCADE;
CREATE TABLE output (
    output_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    prompt_id uuid NOT NULL REFERENCES prompt(prompt_id) ON DELETE CASCADE,

    -- Saves the array index of each LLM output part, so that 
    -- we can make sure they are ordered correctly
    ordering integer NOT NULL,
    -- Enum used to check the content type of this output
    content_type llm_content_type NOT NULL,

    -- One of these will be filled, others will be null
    text_content text,
    image_url text
);

-- Set up indexing for related fields
DROP INDEX IF EXISTS prompt_thread_id_idx;
CREATE INDEX prompt_thread_id_idx ON prompt(thread_id);

DROP INDEX IF EXISTS output_prompt_id_idx;
CREATE INDEX output_prompt_id_idx ON output(prompt_id);
