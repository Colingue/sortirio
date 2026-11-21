-- US 7.1 (requirement 16) and US P2: a banned email cannot sign up again, even after the
-- account was deleted. Supabase Auth calls this before_user_created hook before it
-- creates the user (Apple and Google alike). See
-- docs/adr/2026-11-17-block-banned-email-at-signup.md.
--
-- security definer because bans has RLS with zero policy. Kept to one lookup: an error
-- here would block every sign-up. The message stays neutral, it never says "banned".

create function public.block_banned_email_at_signup(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.bans where email = lower(event->'user'->>'email')
  ) then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Inscription impossible avec cet email.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

revoke execute on function public.block_banned_email_at_signup(jsonb)
  from public, anon, authenticated;
grant execute on function public.block_banned_email_at_signup(jsonb)
  to supabase_auth_admin;
