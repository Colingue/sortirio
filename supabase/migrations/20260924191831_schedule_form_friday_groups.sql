-- pg_cron only schedules in UTC (cron.timezone is not configurable on Supabase), and
-- 19h Europe/Paris is 17h UTC in summer (CEST) or 18h UTC in winter (CET). Rather than
-- correcting the schedule twice a year, both slots run every Thursday; the one that
-- fires too early is a no-op because form_friday_groups() refuses to work until
-- get_next_open_friday() - 7 is actually past current_date.

create extension if not exists pg_cron;

select cron.unschedule('form-friday-groups')
where exists (select 1 from cron.job where jobname = 'form-friday-groups');

select cron.schedule(
  'form-friday-groups',
  '0 17,18 * * 4',
  $$ select public.form_friday_groups(); $$
);
