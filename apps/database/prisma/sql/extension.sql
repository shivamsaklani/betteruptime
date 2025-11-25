CREATE EXTENSION IF NOT EXISTS timescaledb;
-- Ensure the table exists
CREATE TABLE IF NOT EXISTS websitetick (
    createdAt TIMESTAMPTZ NOT NULL,
    -- other columns...
    PRIMARY KEY (createdAt)
);

-- Convert table to Timescale hypertable
SELECT create_hypertable('websitetick', 'createdAt', migrate_data => true, if_not_exists => TRUE);
