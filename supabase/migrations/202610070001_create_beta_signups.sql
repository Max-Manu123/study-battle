create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  goal text not null,
  exam_timing text not null,
  competition_interest text not null,
  usefulness text not null,
  email text not null
);

alter table public.beta_signups enable row level security;

drop policy if exists "Anyone can submit beta signup" on public.beta_signups;
create policy "Anyone can submit beta signup"
on public.beta_signups
for insert
to anon
with check (
  length(email) between 5 and 320
  and position('@' in email) > 1
  and length(usefulness) between 2 and 1000
);

-- There is intentionally no public SELECT policy.
-- Beta responses must not be readable by anonymous visitors.