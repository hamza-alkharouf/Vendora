-- CreateTable
CREATE TABLE "AdPricingConfig" (
    "tier" "AdTier" NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "peakMultiplier" DOUBLE PRECISION NOT NULL,
    "peakDays" INTEGER[],

    CONSTRAINT "AdPricingConfig_pkey" PRIMARY KEY ("tier")
);

-- CreateTable
CREATE TABLE "PeakPriceEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PeakPriceEvent_pkey" PRIMARY KEY ("id")
);
