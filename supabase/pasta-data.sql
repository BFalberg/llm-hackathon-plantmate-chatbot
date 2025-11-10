TRUNCATE thread cascade;
INSERT INTO thread (thread_id, user_id, title, created_at) 
VALUES 
('11111111-1111-1111-1111-111111111111', '165450e4-1197-43d4-9eca-e90ef581a626', 'Best pasta recipe', '2025-10-02 09:15:00+00');

INSERT INTO prompt (prompt_id, thread_id, message, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Dear bison, pleas help, i am no good cook, i want pasta', '2025-10-02 09:16:00+00');

INSERT INTO output (output_id, prompt_id, created_at, ordering, content_type, text_content, image_url)
VALUES 
('22222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2025-10-02 09:17:00+00', 0, 'text', 'Sure! Here is an amazing beautiful pasta recipe: ...', NULL),
('33333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2025-10-02 09:17:00+00', 1, 'image', NULL, 'https://gastromad.dk/wp-content/uploads/2025/05/Bucatini-allAmatriciana-3.jpg');