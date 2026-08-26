$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "../..")
$corePath = Join-Path $projectRoot "supabase/migrations/0001_admin_core.sql"
$rlsPath = Join-Path $projectRoot "supabase/migrations/0002_admin_rls.sql"
$seedPath = Join-Path $projectRoot "supabase/seed.sql"

foreach ($path in @($corePath, $rlsPath, $seedPath)) {
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Missing required database file: $path"
  }
}

$core = Get-Content -LiteralPath $corePath -Raw
$rls = Get-Content -LiteralPath $rlsPath -Raw
$seed = Get-Content -LiteralPath $seedPath -Raw

$requiredTables = @(
  "staff_profiles", "cafes", "cafe_branches", "cafe_hours", "cafe_photos",
  "tags", "cafe_tags", "quests", "quest_versions", "quest_objectives",
  "quest_participations", "reviews", "collections", "achievements",
  "user_achievements", "xp_ledger", "reports", "moderation_actions",
  "appeals", "announcements", "entitlements", "analytics_events", "audit_logs"
)

foreach ($table in $requiredTables) {
  if ($core -notmatch "create table if not exists public\.$table") {
    throw "Core migration is missing table: $table"
  }
  if ($rls -notmatch "alter table public\.$table enable row level security") {
    throw "RLS is not enabled for: $table"
  }
}

foreach ($needle in @("staff_has_capability", "write_audit_log", "prevent_immutable_mutation")) {
  if ($rls -notmatch $needle -and $core -notmatch $needle) {
    throw "Missing security primitive: $needle"
  }
}

if ($seed -notmatch "super_admin" -or $seed -notmatch "content_admin" -or
    $seed -notmatch "moderator" -or $seed -notmatch "analyst") {
  throw "Seed must cover all staff roles."
}

Write-Host "Supabase schema contract passed."
