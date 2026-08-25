-- Aggregate product-page engaged time for MoveScan outreach recipients.

CREATE TABLE IF NOT EXISTS campaign_recipient_engagement (
  recipient_id TEXT NOT NULL,
  campaign TEXT NOT NULL,
  product_page_engaged_ms INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (recipient_id, campaign)
);

CREATE INDEX IF NOT EXISTS campaign_recipient_engagement_campaign_idx
  ON campaign_recipient_engagement(campaign);

CREATE INDEX IF NOT EXISTS campaign_recipient_engagement_updated_idx
  ON campaign_recipient_engagement(campaign, updated_at DESC);

CREATE TABLE IF NOT EXISTS campaign_recipient_engagement_flushes (
  flush_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  campaign TEXT NOT NULL,
  delta_ms INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (flush_id, recipient_id, campaign)
);

CREATE INDEX IF NOT EXISTS campaign_recipient_engagement_flushes_campaign_idx
  ON campaign_recipient_engagement_flushes(campaign, created_at DESC);
