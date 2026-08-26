begin;
select plan(4);

select has_function('public', 'staff_has_capability', array['text'], 'capability helper exists');
select has_function('public', 'write_audit_log', array['text','text','uuid','text','jsonb','jsonb'], 'audit helper exists');
select ok(row_security_active('public.audit_logs'::regclass), 'audit logs use RLS');
insert into public.audit_logs (id, action, entity_type)
values ('d0000000-0000-0000-0000-000000000001', 'test', 'test');
select throws_ok(
  $$ delete from public.audit_logs where id = 'd0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'audit_logs is append-only',
  'audit logs are append-only'
);

select * from finish();
rollback;
