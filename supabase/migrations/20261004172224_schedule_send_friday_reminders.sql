-- US 6.1: same two-slot approach as schedule_form_friday_groups. pg_cron only schedules
-- in UTC, and 18h Europe/Paris is 16h UTC in summer (CEST) or 17h UTC in winter (CET).
-- Both slots run every Friday; send_friday_reminders() returns at once in the one that
-- is not 18h in Paris, so nobody is notified twice (requirements 1 and 5).

select cron.unschedule('send-friday-reminders')
where exists (select 1 from cron.job where jobname = 'send-friday-reminders');

select cron.schedule(
  'send-friday-reminders',
  '0 16,17 * * 5',
  $$ select public.send_friday_reminders(); $$
);
