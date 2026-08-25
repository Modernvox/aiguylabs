-- Add verified Illinois/Chicago MoveScan outreach prospects.
-- Idempotent: existing campaign recipients are preserved by email and by same-state company name.

INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '46ccf576-2ed9-4dc9-91f0-f3d7a43c8b81', '9aa2bb8f-b26a-4483-9019-d83df45a9c7a', 'Movers Chicago', 'info@moverschicago.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@moverschicago.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Movers Chicago')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '5f2eb40b-c263-4146-bc30-3dbcdc8b43ee', '66d77a8c-d8be-4d6b-9ace-debcfb2095bb', 'Chicago Movers', 'mk@chicagomovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'mk@chicagomovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Chicago Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'f5af83a1-0e4a-4836-b59c-5143887ecc49', 'b7c52a0b-24c4-4c24-8b8c-0cd3c947f48e', 'STI Moving & Storage', 'info@stimovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@stimovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('STI Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '42581ed1-4fca-48cb-829a-e59deffaf577', '9d5060a6-eacd-4f44-8815-4a3d9c45038e', 'Windy City Movers', 'info@wcmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@wcmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Windy City Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '2d18de6b-355d-4881-9ed6-d58ed5fe8186', 'adc28fb3-7572-4fc0-9adc-43842fc1d460', 'Lyons Moving', 'info@lyonsmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@lyonsmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Lyons Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd5454d9f-6503-41c0-a52d-3b782f3e7537', '8e3edcbe-5788-409a-8c03-510b6fdcfa44', 'Chicago Movers Near Me', 'info@chicagomoversnearme.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@chicagomoversnearme.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Chicago Movers Near Me')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'b9beb9f6-b283-4339-938f-5259691a13d4', '7979251b-d43f-4584-9a03-c87dfefcac08', 'FairPlay Moving', 'info@fairplaymoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@fairplaymoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('FairPlay Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '6a7dc557-e082-41c7-a3a4-53c6b500bebf', '54ce2f43-74b2-4ef7-8ab0-787215996f31', 'Sweet Home Movers Chicago', 'info@shmchicago.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@shmchicago.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Sweet Home Movers Chicago')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'a7286393-e0c6-49a1-bfd9-2df3970cd9a7', 'a1eb4b1d-9b35-44f3-a430-4f8f40f5dcd5', 'Expert Movers', 'info@hireexpertmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@hireexpertmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Expert Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '6a9c7f9b-4d66-4d32-b1e7-0647ac58485f', '324cc08d-3047-4f02-84c6-0245d3331485', 'Elite Moving & Storage', 'info@elitemover.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@elitemover.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Elite Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '2ca287bc-0cf5-41b0-8a46-c962061fc918', '468e691c-63fa-4121-8524-798885b01579', 'Aaron Bros. Moving System', 'info@wemovechicago.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@wemovechicago.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Aaron Bros. Moving System')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '30be02b0-d9ca-4ca1-9301-fb7510978ac6', '48081735-28e2-4736-b5fa-5cc08ddeeca4', 'Move-Tastic', 'info@move-tastic.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@move-tastic.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Move-Tastic')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd93dd61d-9144-42ac-862d-514925a8b666', 'f3164b4b-83a4-4e12-a84d-45eb50fb32a1', 'H2H Movers', 'info@h2hmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@h2hmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('H2H Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'b36a3f7c-41a2-4d7a-abab-302f9e4bf3ea', 'ea4ad7bb-78b4-4f8e-a5a8-8d693a291262', 'Bernard Movers', 'info@bernardmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@bernardmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Bernard Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '116e8559-dc75-4447-8139-2af420473394', '34dc7784-7c63-499e-8c87-c20c6f2d7092', 'MOOvers Chicago', 'contact@mooverschicago.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'contact@mooverschicago.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('MOOvers Chicago')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'ca10fd00-0da1-47a1-8acd-d01d730a3092', '20c8a8e5-b073-4341-a7c0-ad8b497a967f', 'Move4U Movers', 'info@move4umovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@move4umovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Move4U Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd9be10c0-d120-4d81-9684-a639804b3768', '3248ef3b-a860-4abf-b7d1-ee1cf8790512', 'Mid-West Moving & Storage', 'info@midwestmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@midwestmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Mid-West Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'a5bd0f09-6a36-4702-b57b-8e2af4c49082', '5a148437-7f0f-4e34-81c6-fa05ca1ae4dc', 'Golan’s Moving & Storage', 'sales@golansmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'sales@golansmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Golan’s Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'a912c359-2bfd-4a06-96c9-8715233a2992', '873f063c-8112-445b-a723-81108827ea1e', 'Reliable Movers LLC', 'info@reliablemovers.net', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@reliablemovers.net')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Reliable Movers LLC')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'acb67261-b190-49ff-9797-1313f203332e', 'af56847b-9610-4edd-9fa9-d21b5d47bddc', 'Ace Relocation Systems', 'kferris@acerelocation.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'kferris@acerelocation.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Ace Relocation Systems')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '57188319-62e1-4e41-989c-b1b3f731b850', '3157e1d7-33bc-4225-834c-14d83f8b5dba', 'Boerman Moving & Storage', 'info@boerman.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@boerman.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Boerman Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '960b0930-b3d7-48cd-8efa-c6a3d1d59b45', 'e5464120-0e50-4587-96d3-73153e5fbd7c', 'Happ Movers', 'happmovers@happmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'happmovers@happmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Happ Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'cd16fdda-baf5-43d4-9c62-2bb70ac82fea', '2cfa02af-5c2a-4623-ad66-e92e8a7e30dd', 'USA Moving & Storage', 'info@usamovingandstorage.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@usamovingandstorage.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('USA Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '3883f44d-6dbc-44fd-aa9c-2a77075476a6', 'f40a9d8d-18d2-4579-b84e-91ffe1a18168', 'Golden Eagle Movers', 'info@goldeneaglemovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@goldeneaglemovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Golden Eagle Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e85ad7c9-d061-425e-a48f-bedef3c1da89', '553ef4a0-8665-4729-922b-4a283105338a', 'Moving Solutions', 'info@movingsolutionschicago.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@movingsolutionschicago.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Moving Solutions')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'c928d2ae-1d3b-414f-975e-46ba01ddd337', '8fe4fe35-6909-4038-bc55-c9b74e14ad6c', 'Chicago Best Movers', 'info@chicagobestmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@chicagobestmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Chicago Best Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '61bbcf31-1529-4cbd-a61c-e48e1839762c', '0be8286c-1091-4c7b-99b0-999a151e617f', 'Great Chicago Movers', 'info@greatchicagomover.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@greatchicagomover.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Great Chicago Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd1becd88-ac4a-48a3-9620-6c6c762aa227', '32807417-ead3-4722-a70f-f453457cd42a', 'Lift & Load Moving', 'contact@liftandloadmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'contact@liftandloadmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Lift & Load Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '3a4712ef-ccf9-4a5b-be0f-ce9894637748', '17270120-047d-4ed3-b7aa-e6326cc2639a', '3MD Relocation', 'info@3mdrelocation.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@3mdrelocation.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('3MD Relocation')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '65a03a25-7c73-4ca8-9072-1fcf59ebd80f', '5e21c057-da3f-4d62-aa02-74234903bce3', 'LifeTime Movers', 'info@lifetimemovers.us', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@lifetimemovers.us')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('LifeTime Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '898cc864-5a83-404a-9c5a-e5b99d6e9cce', '0bf9763c-6b02-4c05-b39a-95301c5738aa', 'Asher Movers', 'info@ashermovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@ashermovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Asher Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e85b4a61-5b49-4416-ad45-6880da8428e0', '42788b6f-9d8a-4fcc-9b75-1cab91402535', 'All Seasons Mover', 'contact@allseasonsmover.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'contact@allseasonsmover.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('All Seasons Mover')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '1b4e29f3-0e8c-4b70-8319-305d682c481c', '9728e24f-709f-4454-9b35-9aac9a569610', 'A Move to Remember', 'support@amovetoremember.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'support@amovetoremember.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('A Move to Remember')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '2afdd38f-c2fa-405d-af1a-e0db5418027b', '7617e3e6-1413-4392-b0bf-73aa2776f1dc', 'White Glove Moving & Storage', 'info@whiteglovetransport.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@whiteglovetransport.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('White Glove Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '40c46fa2-4ab0-4a2c-a848-c5463f7edfd0', '96c14ef0-08ca-49d3-99c3-f048eb156b4e', 'AMPOL Movers', 'info@ampolmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@ampolmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('AMPOL Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'dcb8cc6b-45f3-4330-8588-b014d9015f53', '30ad752f-1c42-4ce8-81d7-fc1b74abdbc9', 'Midway Moving & Storage', 'info@midwaymoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@midwaymoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Midway Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '37022a29-f0c6-4e41-8e95-83d80e01d1be', 'ea4eef86-c295-470a-b1ae-a646a692d383', 'MiniMoves', 'drusso@minimoves.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'drusso@minimoves.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('MiniMoves')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'ddb3cd50-4e2d-4b26-9eb4-54d0d56b0120', '42b75d73-bfaf-4758-9073-9634e5b4b0d2', 'Beltmann Relocation Group', 'mike.harvey@beltmann.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'mike.harvey@beltmann.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Beltmann Relocation Group')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '1c984770-06b6-4753-b96d-da9fef23e7c6', 'ed493b8e-7e04-4c8a-b4df-12b1c1edc3d5', 'Breda Moving Company', 'mbreda@bredamoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'mbreda@bredamoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Breda Moving Company')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '879f7f65-a2d9-419d-97b1-e99ba1461d60', '8193b97a-81f5-4529-a87f-3589db6d6978', 'Shurway Moving & Cartage', 'ericb@shurwaymovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'ericb@shurwaymovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Shurway Moving & Cartage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '311f97f7-d9a3-4e77-9cae-bb115595f307', 'b56f2d27-4c8a-48bb-a8fd-1ec44d1b4cd5', 'Federal Companies', 'joe.friedman@federalcos.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'joe.friedman@federalcos.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Federal Companies')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'abc84947-4795-4c8e-a155-413ee6468481', 'fd1640fa-cb55-489d-bd7e-40a304e9691d', 'New World Van Lines', 'info@nwvl.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@nwvl.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('New World Van Lines')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9beda2c8-090a-460c-8dba-fd6cce909f17', 'f94b3719-04aa-4c5a-b193-4f1433c9c85f', 'Reebie Storage & Moving', 'aburl@reebieallied.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'aburl@reebieallied.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Reebie Storage & Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '4fd41f0c-376e-404f-a1c1-61267aa1d576', 'b7c24f27-7b08-4174-9cc2-02f217807b06', 'The Professionals Moving Specialists', 'info@thepromove.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@thepromove.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('The Professionals Moving Specialists')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '27c1a421-e8fa-47ea-8947-6ab9b68111c8', '8f73ebe5-dca8-4c98-bd84-0df7a6fc5975', 'B12 Moving', 'info@b12moving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@b12moving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('B12 Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '4194b932-02af-4332-b5e9-cb963ddfdb21', 'efaa6d86-904f-451b-bd94-e3ab31ae1979', 'Coffey Bros. Moving', 'info@coffeybrosmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@coffeybrosmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Coffey Bros. Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '15d4d30a-4f38-49d8-aab8-1b12798e690f', 'b8f8c0e0-3946-4069-9cc8-41b41363e3ef', 'Kolovitz Movers', 'info@kolovitzmovers.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'info@kolovitzmovers.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Kolovitz Movers')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'eda3176c-45e9-4b43-9c08-c385901688e8', '8778f65c-6952-4c28-a21f-bf15dc0476ef', 'Hassett Commercial Moving & Storage', 'marty.schiller@hassettmoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'marty.schiller@hassettmoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Hassett Commercial Moving & Storage')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '74f4e31c-18f5-42d2-8ec8-1cc584bf17cb', 'dc788f1b-362c-4005-8a76-18d596fd86b9', 'Hollander International Storage & Moving', 'rob@hollandermoving.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'rob@hollandermoving.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Hollander International Storage & Moving')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9081aba8-39b3-4ff7-90f3-39777e0892ba', 'd89c626a-3dc3-4585-81cb-6ea699dae7fb', 'Hercules Moving LLC', 'mazzocchi@herculesmove.com', 'movescan_local_launch', 'unsent', 'IL', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = 'mazzocchi@herculesmove.com')
  AND NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND state = 'IL' AND lower(trim(company_name)) = lower(trim('Hercules Moving LLC')));
