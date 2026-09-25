-- Part 3: Tenant & landlord profiles
-- Run this in the Supabase SQL editor (or via the CLI) against the same
-- project referenced by SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.

-- 1. Extra personal/contact fields on the existing users table -------------
alter table users
  add column if not exists date_of_birth date,
  add column if not exists bio text,
  add column if not exists alternate_phone text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists postal_code text,
  add column if not exists country text;

-- 2. Landlord verification details ------------------------------------------
create table if not exists landlord_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,

  government_id_type text check (government_id_type in ('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE')),
  government_id_number text,
  government_id_document_path text, -- storage path in the private 'verification-documents' bucket

  business_name text,
  business_registration_number text,
  tax_id text,
  proof_of_ownership_path text, -- storage path in the private 'verification-documents' bucket

  status text not null default 'NOT_SUBMITTED'
    check (status in ('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED')),
  rejection_reason text,
  submitted_at timestamptz,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists landlord_verifications_status_idx on landlord_verifications(status);

-- keep updated_at current on every change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists landlord_verifications_set_updated_at on landlord_verifications;
create trigger landlord_verifications_set_updated_at
  before update on landlord_verifications
  for each row execute function set_updated_at();

-- 3. Storage buckets ---------------------------------------------------------
-- Run these once (or create the buckets from the Supabase dashboard):
--
--   insert into storage.buckets (id, name, public)
--   values ('profile-images', 'profile-images', true)
--   on conflict (id) do nothing;
--
--   insert into storage.buckets (id, name, public)
--   values ('verification-documents', 'verification-documents', false)
--   on conflict (id) do nothing;
--
-- The backend only ever talks to storage using the service-role key, so no
-- storage RLS policies are strictly required - but if you enable RLS on
-- storage.objects, make sure the service role is exempted (it is, by
-- default, since RLS does not apply to the service role).
