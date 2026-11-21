begin;
select plan(4);

insert into public.bans (email) values ('banned@example.com');

select ok(
  public.block_banned_email_at_signup('{"user":{"email":"Banned@Example.com"}}') ? 'error',
  'a banned email is refused, whatever its case'
);
select is(
  (public.block_banned_email_at_signup('{"user":{"email":"banned@example.com"}}') -> 'error' ->> 'http_code')::int,
  403,
  'the refusal is a 403'
);
select is(
  public.block_banned_email_at_signup('{"user":{"email":"new@example.com"}}'),
  '{}'::jsonb,
  'another email is accepted'
);
select ok(
  not has_function_privilege('authenticated', 'public.block_banned_email_at_signup(jsonb)', 'execute'),
  'a signed-in user cannot call the hook'
);

select * from finish();
rollback;
