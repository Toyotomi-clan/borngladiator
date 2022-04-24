create table last_checking(
                            user_id uuid references users (user_id) not NULL,
                            last_logged_in TIMESTAMP NOT NULL)
