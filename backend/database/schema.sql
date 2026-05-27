-- =========================================
-- DELETE OLD TABLES (SAFE RESET)
-- =========================================

DROP TABLE IF EXISTS watchlist_stocks CASCADE;
DROP TABLE IF EXISTS watchlists CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS educational_content CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PORTFOLIOS TABLE
-- =========================================

CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    portfolio_name VARCHAR(100) NOT NULL,
    base_currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TRANSACTIONS TABLE
-- =========================================

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    ticker_symbol VARCHAR(10) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (
        transaction_type IN ('BUY', 'SELL')
    ),
    quantity NUMERIC(12,2) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    fees NUMERIC(12,2) DEFAULT 0,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- HOLDINGS TABLE
-- =========================================

CREATE TABLE holdings (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    ticker_symbol VARCHAR(10) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    average_cost NUMERIC(12,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- WATCHLISTS TABLE
-- =========================================

CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    watchlist_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- WATCHLIST STOCKS TABLE
-- =========================================

CREATE TABLE watchlist_stocks (
    id SERIAL PRIMARY KEY,
    watchlist_id INTEGER REFERENCES watchlists(id) ON DELETE CASCADE,
    ticker_symbol VARCHAR(10) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- EDUCATIONAL CONTENT TABLE
-- =========================================

CREATE TABLE educational_content (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    difficulty_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- SAMPLE USER
-- =========================================

INSERT INTO users (
    username,
    email,
    password_hash
)
VALUES (
    'david',
    'david@email.com',
    'samplehashedpassword'
);

-- =========================================
-- SAMPLE PORTFOLIO
-- =========================================

INSERT INTO portfolios (
    user_id,
    portfolio_name
)
VALUES (
    1,
    'My First Portfolio'
);

-- =========================================
-- SAMPLE TRANSACTION
-- =========================================

INSERT INTO transactions (
    portfolio_id,
    ticker_symbol,
    transaction_type,
    quantity,
    price
)
VALUES (
    1,
    'AAPL',
    'BUY',
    10,
    185.50
);

-- =========================================
-- SHOW DATA
-- =========================================

SELECT * FROM users;
SELECT * FROM portfolios;
SELECT * FROM transactions;