-- Update the active saved MoveScan outreach email template.
-- This touches only the campaign template row; prospect, send, and analytics records are preserved.
INSERT INTO campaign_email_templates (campaign, subject, body_text, updated_at)
VALUES (
  'movescan_local_launch',
  'Does this estimate look correct to you?',
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

What makes this different is how the estimate was created.

**MoveScan generated it automatically from the customer''s move details.**

MoveScan lets moving companies give customers instant estimates from their phone while using **the moving company''s own pricing rules**.

For full-service moves, customers can quickly scan their rooms and MoveScan''s AI builds the inventory. For jobs like this unload, it collects the truck/storage and access details needed to produce the estimate without requiring a walkthrough.

Instead of spending 20 minutes on the phone figuring out what someone has, your website can be generating estimates **24/7**.

**See MoveScan in action:**
https://aiguylabs.com/products/movescan

You can start with **5 free estimates**.

**Mike St. Pierre**
**MoveScan Founder**',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
)
ON CONFLICT(campaign) DO UPDATE SET
  subject = excluded.subject,
  body_text = excluded.body_text,
  updated_at = excluded.updated_at;
