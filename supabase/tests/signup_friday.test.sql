begin;
select plan(5);

select is(public.get_signup_friday('2026-10-20 12:00'), date '2026-10-23', 'tuesday: the coming Friday');
select is(public.get_signup_friday('2026-10-22 20:00'), date '2026-10-23', 'thursday after 19 h: this Friday');
select is(public.get_signup_friday('2026-10-23 17:59'), date '2026-10-23', 'friday 17:59: this Friday');
select is(public.get_signup_friday('2026-10-23 18:00'), date '2026-10-30', 'friday 18:00: the next Friday');
select is(public.get_next_open_friday('2026-10-22 20:00'), date '2026-10-30', 'group formation boundary unchanged');

select * from finish();
rollback;
