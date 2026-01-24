export function calculateShipping(item: GrCartItem, rule: PricingRule) {
  const qty = item.quantity || 1; // กันค่าว่างหรือ 0

  switch (rule.method) {
    case "FLAT_RATE":
      return {
        volumetricWeight: 0,
        chargeableWeight: item.weightKg,
        total: (rule.basePrice ?? 0) * qty, // ✅ คูณจำนวน
      };

    case "VOLUMETRIC_WEIGHT": {
      const volumetric =
        (item.widthCm * item.heightCm * item.lengthCm) /
        (rule.volumetricDivisor ?? 5000);

      const chargeable = Math.max(item.weightKg, volumetric);
      return {
        volumetricWeight: volumetric,
        chargeableWeight: chargeable,
        total: chargeable * (rule.pricePerUnit ?? 0) * qty, // ✅ คูณจำนวน
      };
    }

    case "WEIGHT_TIER": {
      let totalPerUnit = 0; // เปลี่ยนชื่อให้ชัดเจนว่าเป็นต่อหน่วย
      const weight = item.weightKg;

      const tiers = [...(rule.tiers ?? [])].sort(
        (a, b) => a.minWeightKg - b.minWeightKg,
      );

      for (const tier of tiers) {
        const min = tier.minWeightKg;
        const max = tier.maxWeightKg ?? Infinity;
        if (weight <= min) break;
        const chargeKg = Math.min(weight, max) - min;
        if (chargeKg > 0) {
          totalPerUnit += tier.basePrice + chargeKg * tier.pricePerKg;
        }
      }
      return {
        volumetricWeight: 0,
        chargeableWeight: weight,
        total: totalPerUnit * qty, // ✅ คูณจำนวน
      };
    }
  }
}

// pricing
export type PricingTier = {
  id: number;
  minWeightKg: number;
  maxWeightKg?: number | null;
  pricePerKg: number;
  basePrice: number;
};

export type PricingRule = {
  id: number;
  method: "WEIGHT_TIER" | "VOLUMETRIC_WEIGHT" | "FLAT_RATE";
  tiers?: PricingTier[];
  basePrice?: number | null;
  pricePerUnit?: number | null;
  volumetricDivisor?: number | null;
};

// product
export type Product = {
  category: string;
  id: number;
  nameTH: string;
  nameLA: string;
  barcode?: string;
};

export type GrCartItem = {
  id: string;
  quantity: number;
  productId: number;
  productNameLA: string;
  productNameTH: string;
  // 📦 กล่อง
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;

  volumetricWeight: number;
  chargeableWeight: number;

  pricingRule?: PricingRule;
  pricingRuleId?: number;

  shippingCost: number;
};
