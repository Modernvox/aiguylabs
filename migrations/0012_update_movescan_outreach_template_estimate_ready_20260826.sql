-- Refresh the editable MoveScan outreach template with the estimate-ready campaign copy.
insert into campaign_email_templates (campaign, subject, body_text, updated_at)
values (
  'movescan_local_launch',
  'What if customers came to you estimate-ready?',
  'Hi,

What if customers didn''t have to call five moving companies and explain their move five different times?

**That''s what we''re building with MoveScan.**

The idea is simple:

A customer scans their home once with their phone. MoveScan uses AI to build their moving inventory and collects the details needed to estimate the job.

Then, instead of contacting moving companies one by one, the customer can request estimates from participating movers.

**Each moving company uses its own pricing.**

When a customer requests an estimate from your company, MoveScan applies **your rates, your minimums, your crew rules, your travel charges, and your other pricing settings** to that customer''s move.

That means the same customer can request estimates from multiple moving companies — and each company can provide an estimate based on its own pricing.

**The customer gets choices. You get an estimate-ready opportunity.**

And you don''t have to wait for the customer side of MoveScan to launch to start using it.

MoveScan already lets you add instant moving estimates directly to your own website, giving customers an estimate 24/7 without waiting for a callback or scheduling an in-home estimate.

We''re now onboarding moving companies while we build the consumer side of the MoveScan network.

**No credit card is required, and your first 5 estimates are free.**

See exactly how MoveScan works:

**Watch the MoveScan Demo →**

The way customers shop for movers is changing.

**We want your company to be ready when they do.**

Mike St. Pierre
MoveScan Founder',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
)
on conflict(campaign) do update set
  subject = excluded.subject,
  body_text = excluded.body_text,
  updated_at = excluded.updated_at;
