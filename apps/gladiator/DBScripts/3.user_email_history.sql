create table user_email_history(
                                 user_id uuid references users (user_id) not NULL,
                                 email_sent TIMESTAMP NOT NULL)
