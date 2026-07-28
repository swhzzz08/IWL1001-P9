ALTER TABLE "portfolios"
ADD COLUMN "sgd_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "eur_balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE TABLE "cash_activities" (
    "id" SERIAL NOT NULL,
    "portfolio_id" INTEGER NOT NULL,
    "activity_type" TEXT NOT NULL,
    "currency" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "from_currency" TEXT,
    "to_currency" TEXT,
    "converted_amount" DOUBLE PRECISION,
    "exchange_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cash_activities_portfolio_id_created_at_idx"
ON "cash_activities"("portfolio_id", "created_at");

ALTER TABLE "cash_activities"
ADD CONSTRAINT "cash_activities_portfolio_id_fkey"
FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
