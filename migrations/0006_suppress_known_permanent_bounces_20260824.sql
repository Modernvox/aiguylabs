-- Mark known permanent North Carolina outreach bounces as suppressed.
-- Engagement events remain in campaign_events for debugging, but dashboard reporting treats this final status as authoritative.
UPDATE campaign_recipients
SET delivery_status = 'bounced_suppressed'
WHERE campaign = 'movescan_local_launch'
  AND lower(trim(recipient_email)) IN (
    'aj@accelerateddeliveries.com',
    'allinmovers50@gmail.com',
    'tlmar@goarmstrong.com',
    'benniecameron@aol.com'
  );
