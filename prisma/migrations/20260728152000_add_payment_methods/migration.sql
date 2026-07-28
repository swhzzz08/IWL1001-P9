CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "method_type" TEXT NOT NULL,
    "account_holder" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "last_four" TEXT NOT NULL,
    "expiry_month" INTEGER,
    "expiry_year" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_methods_user_id_is_active_idx"
ON "payment_methods"("user_id", "is_active");

ALTER TABLE "payment_methods"
ADD CONSTRAINT "payment_methods_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
