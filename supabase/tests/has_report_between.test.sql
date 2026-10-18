begin;
select plan(3);

insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 3) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.reports (reporter_id, reported_id) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

select ok(
  public.has_report_between('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  'true when a reported b');
select ok(
  public.has_report_between('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
  'true when b reported a');
select ok(
  not public.has_report_between('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  'false without a report');

select * from finish();
rollback;
