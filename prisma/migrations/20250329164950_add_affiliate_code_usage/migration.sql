-- CreateTable
CREATE TABLE "AffiliateCodeUsage" (
    "id" TEXT NOT NULL,
    "affiliateCodeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateCodeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AffiliateCodeUsage_affiliateCodeId_idx" ON "AffiliateCodeUsage"("affiliateCodeId");

-- AddForeignKey
ALTER TABLE "AffiliateCodeUsage" ADD CONSTRAINT "AffiliateCodeUsage_affiliateCodeId_fkey" FOREIGN KEY ("affiliateCodeId") REFERENCES "AffiliateCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
