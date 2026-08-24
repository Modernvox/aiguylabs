-- Clean North Carolina outreach prospects and add verified company-domain contacts.
-- Historical sent/event rows are preserved and suppressed; unused personal-domain rows are removed.

UPDATE campaign_recipients
SET delivery_status = CASE
  WHEN lower(trim(recipient_email)) IN (
    'aj@accelerateddeliveries.com',
    'allinmovers50@gmail.com',
    'tlmar@goarmstrong.com',
    'benniecameron@aol.com'
  ) THEN 'bounced_suppressed'
  ELSE 'suppressed'
END
WHERE campaign = 'movescan_local_launch'
  AND state = 'NC'
  AND lower(substr(trim(recipient_email), instr(trim(recipient_email), '@') + 1)) IN (
    'gmail.com', 'aol.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'icloud.com', 'live.com', 'msn.com', 'nc.rr.com', 'rr.com'
  )
  AND (
    sent_at IS NOT NULL
    OR EXISTS (
      SELECT 1
      FROM campaign_events
      WHERE campaign_events.campaign = campaign_recipients.campaign
        AND instr(campaign_events.metadata, '"recipientId":"' || campaign_recipients.id || '"') > 0
    )
  );

UPDATE campaign_recipients
SET delivery_status = 'bounced_suppressed'
WHERE campaign = 'movescan_local_launch'
  AND lower(trim(recipient_email)) IN (
    'aj@accelerateddeliveries.com',
    'allinmovers50@gmail.com',
    'tlmar@goarmstrong.com',
    'benniecameron@aol.com'
  );

DELETE FROM campaign_recipients
WHERE campaign = 'movescan_local_launch'
  AND state = 'NC'
  AND lower(substr(trim(recipient_email), instr(trim(recipient_email), '@') + 1)) IN (
    'gmail.com', 'aol.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'icloud.com', 'live.com', 'msn.com', 'nc.rr.com', 'rr.com'
  )
  AND (sent_at IS NULL OR trim(sent_at) = '')
  AND NOT EXISTS (
    SELECT 1
    FROM campaign_events
    WHERE campaign_events.campaign = campaign_recipients.campaign
      AND instr(campaign_events.metadata, '"recipientId":"' || campaign_recipients.id || '"') > 0
  );

INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '56b691ff-4fc1-4440-876a-42a4b37b7298', 'e58db0a2-3df5-4332-8231-bcf665c437e5', 'Easy Moving - Charlotte', 'support@easymoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'support@easymoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Easy Moving - Charlotte')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '47a50232-b547-4065-b5e3-32e1311ca319', '427562e3-5385-447f-b3ac-5418c888f1f4', 'Athens Moving Experts', 'move@athensmovingexperts.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'move@athensmovingexperts.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Athens Moving Experts')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'db2b5056-1b15-4551-81ae-40144743c8e3', 'b8833127-17c6-4ec2-8489-7ff74550cd2f', 'TROSA Moving', 'moving@trosamoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'moving@trosamoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('TROSA Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'aa39cb54-1b2e-4dca-b99d-aae070a3c8a7', 'c6c13896-cbc7-4d46-a914-ec07d204c4c2', 'Two Twigs Moving', 'support@twotwigsmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'support@twotwigsmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Two Twigs Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '7dfaf323-c7fb-4656-934d-5044463b6d0c', '052259cf-003d-44aa-8989-4ae1f663f994', 'Reign Moving Solutions', 'admin@reignmovingsolutions.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'admin@reignmovingsolutions.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Reign Moving Solutions')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '58873af5-abb9-4015-a5b7-ac2e19cde979', '7a82c1a7-fef6-4756-b881-0d2d88463540', 'Four Pillars Moving', 'Admin@FourPillarsMoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'admin@fourpillarsmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Four Pillars Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '3a3e76a5-7f60-4aa2-ba69-33ee11de6a9a', '5e868e17-30bf-48a5-9848-5d61fc5a0aad', 'Citywide Moving Systems', 'info@citywidemoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@citywidemoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Citywide Moving Systems')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '282e9ce1-bea0-40ce-896f-4c8c2081c8bb', 'e838bc60-b2b5-41bf-ace2-8b1df8a2f946', 'Coastal Carrier Moving & Storage Company', 'info@coastalcarrier.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@coastalcarrier.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Coastal Carrier Moving & Storage Company')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '7ae507f1-da77-4d6a-9dc9-c3d1252bb556', '853b4a10-2665-4a40-8b11-ae2f7a09c6df', 'Little Guys Movers', 'raleigh@littleguys.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'raleigh@littleguys.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Little Guys Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e780cf2c-b184-47a9-9d4c-83b7cc4fc7b0', '83539356-a346-4309-9b59-024795bf89bf', 'Junk Pros of NC', 'requestinfo@junkprosnc.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'requestinfo@junkprosnc.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Junk Pros of NC')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e5187f12-9944-4646-b299-87357555fd3c', '01cf3219-a9b5-4492-91f6-5955e3592ce5', 'UniMovers', 'triad@unimovers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'triad@unimovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('UniMovers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '5bb49b10-28a8-4b66-985a-f014a591eb03', '734ce31e-a678-4fc9-bfe0-5e46d2058a39', 'MoveMates', 'info@themovingmates.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@themovingmates.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('MoveMates')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9aa18368-080a-419d-8a94-2d06af31098c', 'f1b4e0c6-c99c-4375-8c64-ed24ad82a976', 'NuWay Relocation', 'info@nuway-relocation.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@nuway-relocation.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('NuWay Relocation')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '46c4c9d5-6f5c-44dc-8676-264238f692e1', '245b601b-8088-4ff3-8db5-fecd8df5271c', 'OBX Movers', 'matt@obxmovers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'matt@obxmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('OBX Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'af8b3675-4173-4c04-866c-88bcc1ca5f24', '17a99a80-d3d2-4661-9dd2-c2f67f92c296', 'Moving With Purpose', 'support@mwpmovers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'support@mwpmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Moving With Purpose')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'adfd090a-9434-4f23-91c4-a84f10442344', 'c419d134-60a7-4d2d-bf3b-8671dd03aa68', 'CJ Moving Services', 'info@cjmovingservicesllc.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@cjmovingservicesllc.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('CJ Moving Services')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'de58cbfb-c369-47c7-b80a-e6706cceef39', '5ac5ab85-08d3-4a77-b950-6616ab159232', 'WellKnown Moving Company', 'contact@wellknownmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'contact@wellknownmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('WellKnown Moving Company')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '60d15432-2e48-418e-9043-affd1665b3a0', '5b2ad34c-d026-4c72-9528-fc5e145f6a17', 'Red Brick Moving', 'info@redbrickmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@redbrickmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Red Brick Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '89a64c04-2afd-46a4-bb8d-10e4e43ca7e3', '7b30933e-fbd5-436e-914d-939ea3d7a8ca', 'Rye Moving & Packing', 'logan@ryemoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'logan@ryemoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Rye Moving & Packing')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'b0f4751b-46f9-4d85-afa7-f71985e62162', '711c755a-228f-4216-b640-86537b5e5952', 'Road Haugs Moving & Storage', 'moving@roadhaugs.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'moving@roadhaugs.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'NC' AND lower(trim(company_name)) = lower(trim('Road Haugs Moving & Storage')));
