begin;

create or replace function public.current_staff_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role from public.staff_profiles
  where user_id = auth.uid() and status = 'active'
  limit 1
$$;

create or replace function public.staff_has_capability(requested text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select case public.current_staff_role()
    when 'super_admin' then true
    when 'content_admin' then requested = any(array[
      'dashboard:view','cafe:view','cafe:create','cafe:update','cafe:publish','cafe:archive',
      'quest:view','quest:create','quest:update','quest:publish','quest:archive',
      'taxonomy:view','taxonomy:manage','featured:view','featured:manage',
      'achievement:view','achievement:manage','announcement:view','announcement:manage',
      'analytics:view','health:view'
    ])
    when 'moderator' then requested = any(array[
      'dashboard:view','cafe:view','quest:view','report:view','report:resolve',
      'appeal:resolve','user:view','user:warn','user:suspend','analytics:view','health:view'
    ])
    when 'analyst' then requested = any(array[
      'dashboard:view','cafe:view','quest:view','taxonomy:view','featured:view',
      'achievement:view','subscription:view','analytics:view','analytics:export','health:view'
    ])
    else false
  end
$$;

create or replace function public.write_audit_log(
  audit_action text,
  audit_entity_type text,
  audit_entity_id uuid,
  audit_reason text default null,
  audit_before jsonb default null,
  audit_after jsonb default null
)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  staff_id uuid;
  audit_id uuid;
begin
  select id into staff_id from public.staff_profiles
  where user_id = auth.uid() and status = 'active';
  if staff_id is null then raise exception 'Active staff session required'; end if;

  insert into public.audit_logs(actor_staff_id, action, entity_type, entity_id, reason, before_state, after_state)
  values (staff_id, audit_action, audit_entity_type, audit_entity_id, audit_reason, audit_before, audit_after)
  returning id into audit_id;
  return audit_id;
end;
$$;

create or replace function public.prevent_immutable_mutation()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception '% is append-only', tg_table_name;
end;
$$;

drop trigger if exists audit_logs_immutable on public.audit_logs;
create trigger audit_logs_immutable before update or delete on public.audit_logs
for each row execute function public.prevent_immutable_mutation();

drop trigger if exists xp_ledger_immutable on public.xp_ledger;
create trigger xp_ledger_immutable before update or delete on public.xp_ledger
for each row execute function public.prevent_immutable_mutation();

alter table public.staff_profiles enable row level security;
alter table public.cafes enable row level security;
alter table public.cafe_branches enable row level security;
alter table public.cafe_hours enable row level security;
alter table public.cafe_photos enable row level security;
alter table public.tags enable row level security;
alter table public.cafe_tags enable row level security;
alter table public.featured_placements enable row level security;
alter table public.quests enable row level security;
alter table public.quest_versions enable row level security;
alter table public.quest_objectives enable row level security;
alter table public.app_users enable row level security;
alter table public.quest_participations enable row level security;
alter table public.reviews enable row level security;
alter table public.collections enable row level security;
alter table public.collection_cafes enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.xp_ledger enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.appeals enable row level security;
alter table public.announcements enable row level security;
alter table public.entitlements enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

do $$
declare t text;
begin
  foreach t in array array['cafes','cafe_branches','cafe_hours','cafe_photos'] loop
    execute format('create policy %I on public.%I for select using (public.staff_has_capability(''cafe:view''))', t || '_admin_read', t);
    execute format('create policy %I on public.%I for insert with check (public.staff_has_capability(''cafe:create''))', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update using (public.staff_has_capability(''cafe:update'')) with check (public.staff_has_capability(''cafe:update''))', t || '_admin_update', t);
  end loop;

  foreach t in array array['tags','cafe_tags'] loop
    execute format('create policy %I on public.%I for select using (public.staff_has_capability(''taxonomy:view''))', t || '_admin_read', t);
    execute format('create policy %I on public.%I for all using (public.staff_has_capability(''taxonomy:manage'')) with check (public.staff_has_capability(''taxonomy:manage''))', t || '_admin_manage', t);
  end loop;

  foreach t in array array['quests','quest_versions','quest_objectives'] loop
    execute format('create policy %I on public.%I for select using (public.staff_has_capability(''quest:view''))', t || '_admin_read', t);
    execute format('create policy %I on public.%I for insert with check (public.staff_has_capability(''quest:create''))', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update using (public.staff_has_capability(''quest:update'')) with check (public.staff_has_capability(''quest:update''))', t || '_admin_update', t);
  end loop;

  foreach t in array array['reports','moderation_actions','appeals'] loop
    execute format('create policy %I on public.%I for select using (public.staff_has_capability(''report:view''))', t || '_moderator_read', t);
    execute format('create policy %I on public.%I for all using (public.staff_has_capability(''report:resolve'')) with check (public.staff_has_capability(''report:resolve''))', t || '_moderator_manage', t);
  end loop;
end $$;

create policy featured_read on public.featured_placements for select
using (public.staff_has_capability('featured:view'));
create policy featured_manage on public.featured_placements for all
using (public.staff_has_capability('featured:manage')) with check (public.staff_has_capability('featured:manage'));

create policy achievements_read on public.achievements for select
using (public.staff_has_capability('achievement:view'));
create policy achievements_manage on public.achievements for all
using (public.staff_has_capability('achievement:manage')) with check (public.staff_has_capability('achievement:manage'));
create policy user_achievements_admin_read on public.user_achievements for select
using (public.staff_has_capability('achievement:view'));

create policy users_moderator_read on public.app_users for select
using (public.staff_has_capability('user:view') or public.staff_has_capability('analytics:view'));
create policy users_super_update on public.app_users for update
using (public.current_staff_role() = 'super_admin' or public.staff_has_capability('user:suspend'))
with check (public.current_staff_role() = 'super_admin' or public.staff_has_capability('user:suspend'));

create policy participations_admin_read on public.quest_participations for select
using (public.staff_has_capability('quest:view') or public.staff_has_capability('report:view'));
create policy reviews_admin_read on public.reviews for select
using (public.staff_has_capability('cafe:view') or public.staff_has_capability('report:view'));
create policy reviews_moderator_update on public.reviews for update
using (public.staff_has_capability('report:resolve')) with check (public.staff_has_capability('report:resolve'));

create policy collections_owner_read on public.collections for select
using (user_id = (select id from public.app_users where auth_user_id = auth.uid()));
create policy collection_cafes_owner_read on public.collection_cafes for select
using (exists (select 1 from public.collections c where c.id = collection_id and c.user_id = (select id from public.app_users where auth_user_id = auth.uid())));

create policy xp_admin_read on public.xp_ledger for select
using (public.staff_has_capability('user:view') or public.staff_has_capability('analytics:view'));
create policy xp_super_insert on public.xp_ledger for insert
with check (public.staff_has_capability('xp:adjust'));

create policy announcements_admin_read on public.announcements for select
using (public.staff_has_capability('announcement:view'));
create policy announcements_admin_manage on public.announcements for all
using (public.staff_has_capability('announcement:manage')) with check (public.staff_has_capability('announcement:manage'));

create policy entitlements_admin_read on public.entitlements for select
using (public.staff_has_capability('subscription:view'));
create policy entitlements_super_update on public.entitlements for update
using (public.staff_has_capability('subscription:resync')) with check (public.staff_has_capability('subscription:resync'));

create policy analytics_admin_read on public.analytics_events for select
using (public.staff_has_capability('analytics:view'));
create policy audit_super_read on public.audit_logs for select
using (public.staff_has_capability('audit:view'));

create policy staff_self_read on public.staff_profiles for select
using (user_id = auth.uid() or public.staff_has_capability('staff:view'));
create policy staff_super_manage on public.staff_profiles for all
using (public.current_staff_role() = 'super_admin') with check (public.current_staff_role() = 'super_admin');

revoke all on function public.write_audit_log(text,text,uuid,text,jsonb,jsonb) from public;
grant execute on function public.write_audit_log(text,text,uuid,text,jsonb,jsonb) to authenticated;

commit;
