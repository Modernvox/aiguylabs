-- AI Guy Labs lead capture schema for Cloudflare D1.
create table if not exists contact_requests (
  id text primary key,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name text not null,
  email text not null,
  company text,
  project_type text not null,
  budget_range text,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Discovery Scheduled', 'Proposal Sent', 'Won', 'Lost', 'Closed')),
  notes text not null default '',
  ip_address text,
  user_agent text,
  metadata text not null default '{}'
);

create index if not exists contact_requests_created_at_idx on contact_requests (created_at desc);
create index if not exists contact_requests_status_idx on contact_requests (status);
create index if not exists contact_requests_email_idx on contact_requests (email);
