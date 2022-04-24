create table gender (
  id uuid primary key not null default gen_random_uuid(),
  gender text
);

insert into gender (gender) values ('male'),('female');
