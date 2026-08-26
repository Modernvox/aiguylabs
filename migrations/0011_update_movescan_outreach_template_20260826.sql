-- Refresh the editable MoveScan outreach template with the revised default copy.
insert into campaign_email_templates (campaign, subject, body_text, updated_at)
values (
  'movescan_local_launch',
  'Does this moving estimate look right to you?',
  'Hi,

Quick question — **does this estimate look reasonable to you?**

**Example MoveScan Instant Estimate**

**Job:** Unload Only
**Source:** 5'' × 12'' storage unit — 100% full
**Estimated Volume:** 480 cu. ft.

**Recommended Truck:** 15 ft. truck — approx. 70% full
**Recommended Crew:** 2 movers
**Billable Labor:** 2-hour minimum

**Moving Labor:** $250.00
**Tax:** $20.63

**Estimated Total: $270.63**

*Truck recommendation only — truck charges are not included.*

Here''s the interesting part: **no estimator had to build this estimate.**

MoveScan generated it automatically from the customer''s job information using the moving company''s own pricing rules.

For a full-service move, the customer simply walks room by room with their phone. **MoveScan''s AI identifies the furniture and builds the inventory automatically**, then uses your company''s pricing to generate the estimate.

For jobs that don''t require a room scan — like the unload example above — MoveScan collects the storage/truck, capacity, and access information it needs instead.

The result is the same: your customers can get an instant moving estimate **24/7**, without waiting for a callback or spending 20 minutes going over everything on the phone.

You can try MoveScan with **5 free estimates**.

**Mike St. Pierre**
**MoveScan Founder**',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
)
on conflict(campaign) do update set
  subject = excluded.subject,
  body_text = excluded.body_text,
  updated_at = excluded.updated_at;
