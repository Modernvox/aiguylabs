-- Import North Carolina MoveScan outreach prospects.
-- Data-only: preserves existing recipients, events, send history, and analytics.
-- Apply only after the campaign_recipients.state column exists.

INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'ecef3284-fd24-4f31-9554-9d7c503376e4', '48b04eaf-b113-481d-9cc0-251157488d31', 'A Cut Above Moving and Relocation Service', 'info@acutabovemoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@acutabovemoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '832fba77-92f8-486f-8a19-17a1b1e9785c', '1a0b3c82-2c40-44d9-b989-a032a76cd551', 'Absolute Moving & Storage, Inc.', 'adduckworth@yahoo.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('adduckworth@yahoo.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '2859cd46-b7f6-48c4-8851-1a8e615b64c1', 'f3589766-4e98-4733-851d-f77947be6524', 'Accelerated Deliveries', 'aj@AcceleratedDeliveries.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('aj@AcceleratedDeliveries.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'f2d70fa2-7de5-42de-8d02-b20034f466e3', 'ad20b0da-b40e-4633-b314-940699541b8c', 'Advanced Moving, LLC', 'bguff91@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('bguff91@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'f564eab8-2605-4c6f-a1d7-65a0ea677e24', '726f69d2-54b8-4606-a6e3-168e3256aa3e', 'All American Relocation', 'drushing@aacorp-usa.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('drushing@aacorp-usa.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '0c565dc3-8b89-44ea-b6cb-2d64a31e911b', 'c65fb20d-7a12-4006-931e-897fac64b9f7', 'All In Movers', 'allinmovers50@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('allinmovers50@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '4276125b-aba7-4e15-8ee2-9abc992c4183', '044f9637-0e7d-4879-aef4-17e69fcc89cd', 'All My Sons Moving & Storage of Raleigh', 'Raleigh@allmysons.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('Raleigh@allmysons.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '055d9fc4-2c32-4ef6-8f5b-aa00f54d4f2c', '280a7315-ff49-4aeb-b4ef-954763f93dd3', 'All My Sons of Greensboro, LLC', 'greensboro@allmysons.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('greensboro@allmysons.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '22fd12a8-9930-4481-a6d8-9765d19e43d0', '35130b13-cda0-4ccb-ac08-bcbbc7d9520c', 'American Moving & Hauling, Inc.', 'amy@americanmovingandhauling.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('amy@americanmovingandhauling.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'bbeb9ea2-6c92-478a-a101-468919f54152', '29d45ea8-6c40-4494-9f18-5b2a81a0ca89', 'Armstrong Relocation Co.', 'tlmar@goarmstrong.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('tlmar@goarmstrong.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '40f9effc-1ae0-401b-a280-312d2356295b', '186c4751-2352-4a99-90e8-4b3295e1506b', 'Armstrong Transfer & Storage Co., Inc.', 'cjones@goarmstrong.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('cjones@goarmstrong.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'ff04dddc-fc74-418a-a0f2-c32eb205263a', 'b36e4ddb-a03e-471f-bdeb-23eb75d02387', 'Boundless Moving & Storage, LLC', 'info@boundlessmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@boundlessmoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'eb6d8e75-b7cf-416c-bfdb-8aff9b389f59', '381349ba-4123-4af8-a14f-9ffe6480540e', 'Branch Out Delivery, Inc.', 'branchoutdelivery@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('branchoutdelivery@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '00abd4cc-dcb8-49a4-bf39-a513d2cf71b8', '5d85f3f5-b184-4e06-bea1-d24e409794fe', 'Cameron & Cameron Assembly, Moving & Storage, Inc.', 'benniecameron@aol.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('benniecameron@aol.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e1465140-ae63-49bb-90bc-c1c0860c4cfa', '5116a7c1-5d94-4dd5-b50b-abe2be7f8685', 'Capital Moving & Storage of the Triad, LLC', 'triad@capitalmovingnc.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('triad@capitalmovingnc.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'aaf7008c-44ea-4420-9b58-2e24a7c299ec', '9afa8d3f-4bbb-4c49-98cf-8b316eb55fb1', 'Capital Relocation Group', 'eric.martin@capitalrelocationgroup.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('eric.martin@capitalrelocationgroup.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '3a626fdb-e5ed-418f-9daf-bb15fd424d06', 'bf900431-8007-46ed-8a77-e4b29221be83', 'Carey Moving & Storage of Asheville, Inc.', 'jlaughter@careymoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('jlaughter@careymoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '242498f7-cca5-4c93-bea4-7f78084a3e8a', '76e7993f-e06f-42e9-a99e-f3ecb65805d3', 'Cary Moving', 'carymoving@aol.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('carymoving@aol.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '83688b26-7543-4f7c-b205-9afcd2803da5', '874fca65-a433-4913-a8dd-0be335cf8024', 'Charlie Powell''s Model Moves, Inc.', 'cpowell72@nc.rr.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('cpowell72@nc.rr.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '3f3ce3b2-b804-44bd-8390-700023b4fb2d', '9019b513-9e83-4aea-a07f-58a02be13ceb', 'Charlotte Hunks, LLC', 'scott.s.whitaker@chhj.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('scott.s.whitaker@chhj.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'cf3071a0-b3ab-4bdc-bbfd-45569ad08116', '43ede2bd-5a05-450f-af3b-621c2fb7950b', 'City Transfer & Storage Company', 'slassiter@ctsmoves.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('slassiter@ctsmoves.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '65867398-b6c1-4fb5-b3f6-625f39a70c07', '92a515f3-77eb-42fd-a91b-6795e34e7885', 'CK Movers, LLC', 'ckmoversnc@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('ckmoversnc@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'f7e1c3fa-5202-4c7b-a069-f7b7cff54e51', '69297b8f-0007-485f-a325-49cbb8216056', 'College Hunks Hauling Junk and Moving ' || char(8211) || ' Wilmington', 'jeff.moss@chhj.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('jeff.moss@chhj.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9152e3c7-710b-41de-ae7f-b35ec697acd7', '9d9ddef9-d699-4fbe-9481-aa79222eca2c', 'Crabtree Family Moving', 'cliff@crabtreefamilymoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('cliff@crabtreefamilymoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '33330176-de02-4a3c-9193-3dd0a6a9f36a', '0fa0e007-9f33-4830-9b58-8775f01ae765', 'DeHaven''s Transfer & Storage, Inc.', 'customerservice@dehavens.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('customerservice@dehavens.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '54bb5e91-7351-4adc-a096-ec6ec1f5c3b3', 'e1ae6aa4-602e-4bef-82a8-b40f543917a6', 'Dillard''s Moving & Transport, LLC', 'dillards.moving.transport@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('dillards.moving.transport@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd8d5abde-6f79-4137-b529-3990fa2d514e', '9968678b-22c1-4a96-b2bc-c8494d6e70a8', 'Dunnagan''s Moving & Storage', 'gilmovu@aol.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('gilmovu@aol.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9789c050-45a8-4525-a6fd-1fcf4a956ee5', '933cad0f-f695-438f-8be6-5987678b0196', 'E. E. Ward Moving & Storage Co., LLC', 'info@eeward.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@eeward.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '91d95fae-1852-463f-a478-76184cfc786e', '2c199489-2d02-4c8f-be3e-3979a758b19d', 'East Coast Moving', 'eastcoastmvg@atmc.net', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('eastcoastmvg@atmc.net')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'b1cfb229-3d21-4f9e-8905-b284cab75b01', '1074cac5-cf99-4f64-82a5-165494b5f74d', 'Easy Movers, Inc.', 'info@easymovers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@easymovers.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'a877cdeb-07f6-483b-95cb-0699b2daa1c6', '03f22de9-9c53-4ca3-b96d-f06dcce2ae68', 'Excel Moving & Storage', 'sroberts@excelms.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('sroberts@excelms.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '8986051c-2f8b-42f5-bffe-8c1f277a61a7', '3aa98de7-7839-4826-b62d-8486c64753a7', 'Flash Moving Company, LLC', 'flashmovingnc@gmail.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('flashmovingnc@gmail.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'd0ce3aad-a8d7-464b-b0bd-c21413257141', '65172159-e304-4453-832f-6ff9a0d72237', 'Gasperson Transfer', 'tomjr@gaspersonmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('tomjr@gaspersonmoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '89a8a102-2f89-4943-8ac5-de33256c9ef3', 'a999ba56-fb7d-4de6-aa46-2f4b9334b441', 'Gentle Giant Moving Company, LLC', 'rfarnum@gentlegiant.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('rfarnum@gentlegiant.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '5dba7b9f-dd4a-4f3c-adb6-c03e40b22abd', '09b966ea-4082-441c-b217-deded6201c60', 'King Moving, LLC', 'tylerneininger@kingmovingnc.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('tylerneininger@kingmovingnc.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'c4562d2d-b1fe-40ff-877e-3f7b7064cd28', '0f488afa-fb5a-4302-bd10-f67c88ddf262', 'Lawrence Companies, Inc.', 'jhobbs@lawrencecompanies.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('jhobbs@lawrencecompanies.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '92cfd5bc-1f36-4297-bf0e-f967d4dd3a41', '3d3b6124-5ea4-4c15-8481-d51465e3c0d3', 'Lentz Moving Services', 'jsuggs@coreloexperts.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('jsuggs@coreloexperts.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '496c69e1-2015-4ad7-a698-697ea674ab10', '92d8f3e3-c1d7-4364-b850-9becb37d653b', 'Lets Move', 'corym704@icloud.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('corym704@icloud.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '9fc3e273-c5a3-4248-9da4-0972e135a150', '32e86c1b-67b6-4724-8c2d-b9bac8bdd018', 'Logan E Logistics, LLC', 'loganelogistics@outlook.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('loganelogistics@outlook.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '2c455317-dbd7-4a0d-8af9-5ccbcbaaf09f', 'b4df93fc-d33f-44ea-96b5-ea8c21fcc64a', 'Luggers of Wilmington', 'ian.myers@junkluggers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('ian.myers@junkluggers.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'b6309c29-9236-4907-a8e5-2185920db36f', '978f885c-26ac-4ec2-bf04-a1905795f218', 'Make A Move', 'info@MakeAMoveToday.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@MakeAMoveToday.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '8cfc74bf-d345-4308-b914-bfc1dd996c8c', 'dc64162c-a4ce-437f-8b27-665d491c799f', 'Marathon Moving Company, Inc.', 'tyler@marathonmovingco.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('tyler@marathonmovingco.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '8146bbe2-f64c-4883-8a43-a61e8a7ca2cf', '90798eb5-a2a9-4716-9ba3-d73098d6a3d0', 'Mather Brothers Moving Company, LLC', 'info@matherbrothers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@matherbrothers.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'c8bab4ba-bb12-4ef4-ba0f-9ba1a5014283', '08c9b977-2f60-430d-9375-e092132345af', 'Metrolina Relocation, LLC', 'steve@metro-relo.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('steve@metro-relo.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '53a0392c-d940-4099-9061-3fdb8357dbd4', '38cf9036-f7b4-44bf-a250-ebf5ed885c66', 'Miracle Movers of the Triad, LLC', 'jared.huffman@miraclemoverstriad.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('jared.huffman@miraclemoverstriad.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'e47fb537-da33-43e3-b968-a49e22c159c5', '1d5f73ea-1b0e-4cbb-99c7-f18119a5cd31', 'Move 4 Less of North Carolina, LLC', 'admin@move4lessmoving.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('admin@move4lessmoving.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '4c7f0596-f68e-480b-94da-98b37fb1d370', '944aa857-9c67-49e1-9f45-b845ec503f2e', 'Move and Care, LLC', 'artem@move-and-care.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('artem@move-and-care.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'fd47fb40-8708-4929-9b0e-615908ff03f1', '939cf611-8b44-46dd-b221-a95bd5018b79', 'Movers Near Me, LLC', 'michael@greatmoversnearme.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('michael@greatmoversnearme.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT 'bfed4424-f52a-4bec-be3f-557b3c7bc179', 'e6e852d5-647b-4887-b758-3d91bda0e1e7', 'Movin'' On Movers, Inc.', 'hannah@movinonmovers.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('hannah@movinonmovers.com')));
INSERT INTO campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
SELECT '92e83fee-64ba-4929-ba88-53ca759f92ab', '27ddf12b-cd9a-4d0f-89b4-248846ce5119', 'Next Stop Movers, LLC', 'info@nextstopmoversnc.com', 'movescan_local_launch', 'unsent', 'NC', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL
WHERE NOT EXISTS (SELECT 1 FROM campaign_recipients WHERE campaign = 'movescan_local_launch' AND lower(trim(recipient_email)) = lower(trim('info@nextstopmoversnc.com')));
