begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  display_name text not null check (char_length(display_name) between 2 and 80),
  email text not null unique,
  role text not null check (role in ('super_admin','content_admin','moderator','analyst')),
  status text not null default 'active' check (status in ('invited','active','deactivated')),
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  price_level smallint not null default 2 check (price_level between 1 and 4),
  estimated_spend_min numeric(10,2) not null default 0 check (estimated_spend_min >= 0),
  estimated_spend_max numeric(10,2) not null default 0 check (estimated_spend_max >= estimated_spend_min),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.staff_profiles(id),
  updated_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cafe_branches (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  label text not null default 'Main branch',
  address text not null,
  city text not null,
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  timezone text not null default 'Asia/Manila',
  phone text,
  wifi_available boolean not null default false,
  outlets_available boolean not null default false,
  accessibility_notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cafe_hours (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.cafe_branches(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  unique (branch_id, day_of_week),
  check (is_closed or (opens_at is not null and closes_at is not null and opens_at <> closes_at))
);

create table if not exists public.cafe_photos (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  sort_order integer not null default 0,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('vibe','amenity','use_case','dietary')),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.cafe_tags (
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete restrict,
  primary key (cafe_id, tag_id)
);

create table if not exists public.featured_placements (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid references public.cafes(id),
  quest_id uuid,
  surface text not null check (surface in ('home_hero','discovery','weekend_pick')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  sort_order integer not null default 0,
  created_by uuid references public.staff_profiles(id),
  check (ends_at > starts_at)
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft','scheduled','active','paused','archived')),
  current_version integer not null default 1 check (current_version > 0),
  starts_at timestamptz,
  ends_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

alter table public.featured_placements
  add constraint featured_placements_quest_id_fkey
  foreign key (quest_id) references public.quests(id) on delete cascade;

create table if not exists public.quest_versions (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  version integer not null check (version > 0),
  description text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  duration_minutes integer not null check (duration_minutes between 10 and 480),
  xp_reward integer not null check (xp_reward between 10 and 2000),
  safety_message text not null,
  proof_rule text,
  rare_condition text,
  published_at timestamptz,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  unique (quest_id, version)
);

create table if not exists public.quest_objectives (
  id uuid primary key default gen_random_uuid(),
  quest_version_id uuid not null references public.quest_versions(id) on delete cascade,
  instruction text not null,
  sort_order integer not null default 0,
  is_required boolean not null default true
);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  username text not null unique,
  display_name text not null,
  email text,
  avatar_path text,
  status text not null default 'active' check (status in ('active','warned','suspended','banned','anonymized')),
  xp_total integer not null default 0 check (xp_total >= 0),
  anonymization_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quest_participations (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id),
  quest_version_id uuid not null references public.quest_versions(id),
  user_id uuid not null references public.app_users(id),
  status text not null check (status in ('started','submitted','verified','rejected','abandoned')),
  proof_path text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (quest_id, user_id, started_at)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id),
  user_id uuid not null references public.app_users(id),
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  status text not null default 'visible' check (status in ('visible','hidden','removed')),
  hidden_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id),
  name text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_cafes (
  collection_id uuid not null references public.collections(id) on delete cascade,
  cafe_id uuid not null references public.cafes(id),
  added_at timestamptz not null default now(),
  primary key (collection_id, cafe_id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  icon text not null,
  rule_type text not null check (rule_type in ('quest_count','cafe_count','xp_threshold','streak')),
  threshold integer not null check (threshold > 0),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.app_users(id),
  achievement_id uuid not null references public.achievements(id),
  awarded_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id),
  amount integer not null check (amount <> 0),
  reason text not null check (char_length(reason) >= 12),
  source_type text not null check (source_type in ('quest','achievement','admin_adjustment','reversal')),
  source_id uuid,
  actor_staff_id uuid references public.staff_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references public.app_users(id),
  subject_type text not null check (subject_type in ('review','user','quest_proof','cafe_photo')),
  subject_id uuid not null,
  category text not null,
  summary text not null,
  private_evidence_path text,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','in_review','actioned','dismissed','appealed')),
  assigned_to uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id),
  actor_staff_id uuid not null references public.staff_profiles(id),
  outcome text not null check (outcome in ('no_violation','hide','restore','warn','suspend','ban','escalate','dismiss')),
  reason text not null check (char_length(reason) >= 12),
  private_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.appeals (
  id uuid primary key default gen_random_uuid(),
  moderation_action_id uuid not null references public.moderation_actions(id),
  user_id uuid not null references public.app_users(id),
  statement text not null,
  status text not null default 'pending' check (status in ('pending','upheld','overturned')),
  resolved_by uuid references public.staff_profiles(id),
  resolution_reason text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','scheduled','sending','sent','cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id),
  provider text not null,
  provider_customer_id text not null,
  plan text not null check (plan in ('free','plus','founder')),
  status text not null check (status in ('active','trialing','past_due','cancelled','expired')),
  current_period_ends_at timestamptz,
  last_synced_at timestamptz not null default now(),
  provider_payload jsonb not null default '{}'::jsonb,
  unique (provider, provider_customer_id)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_users(id),
  anonymous_id text,
  event_name text not null,
  occurred_at timestamptz not null default now(),
  city text,
  properties jsonb not null default '{}'::jsonb,
  check (user_id is not null or anonymous_id is not null)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_staff_id uuid references public.staff_profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  reason text,
  before_state jsonb,
  after_state jsonb,
  request_id text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists cafes_status_updated_idx on public.cafes(status, updated_at desc);
create index if not exists cafe_branches_city_idx on public.cafe_branches(city);
create index if not exists cafe_photos_moderation_idx on public.cafe_photos(moderation_status, created_at);
create index if not exists quests_status_schedule_idx on public.quests(status, starts_at);
create index if not exists participations_status_idx on public.quest_participations(status, started_at desc);
create index if not exists reviews_status_idx on public.reviews(status, created_at desc);
create index if not exists reports_queue_idx on public.reports(status, priority, created_at);
create index if not exists analytics_event_time_idx on public.analytics_events(event_name, occurred_at desc);
create index if not exists audit_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array['staff_profiles','cafes','cafe_branches','quests','app_users','reviews','announcements']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

commit;
