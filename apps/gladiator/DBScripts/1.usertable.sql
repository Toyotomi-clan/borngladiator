create table users(
                    user_id uuid Primary Key not NULL,
                    username VARCHAR NOT NULL ,
                    email VARCHAR NOT NULL,
                    date_of_birth TIMESTAMP NOT NULL,
                    subscribed BOOLEAN NOT NULL
)
