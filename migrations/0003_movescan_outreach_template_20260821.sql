-- Set the current MoveScan outreach email as the saved default used by Private Campaigns.
INSERT INTO campaign_email_templates (campaign, subject, body_text, updated_at)
VALUES (
  'movescan_local_launch',
  'Turn your moving website into a 24/7 AI-powered instant estimator',
  'Turn your moving website into a 24/7 AI-powered instant estimator

MoveScan turns the customer’s phone into a guided moving-estimate walkthrough—and turns your website into a place where customers can actually get an estimate instead of just requesting one.

A typical two- to three-bedroom home can complete the entire walkthrough in under five minutes.

There are no furniture lists to type. No app to download. No 20-minute phone conversation just to figure out what someone owns.

The customer simply shows MoveScan their home, room by room. Most room recordings take only a few seconds, with a maximum of 20 seconds per room. MoveScan’s AI analyzes those quick recordings, builds the inventory, combines it with the customer’s move details, and applies your company’s pricing rules to produce an instant estimate.

That means your company can be generating estimates 24 hours a day—even while you’re sleeping, working another move, or helping another customer.',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
)
ON CONFLICT(campaign) DO UPDATE SET
  subject = excluded.subject,
  body_text = excluded.body_text,
  updated_at = excluded.updated_at;
