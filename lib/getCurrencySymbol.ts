// utils/currency.ts
export const getCurrencySymbol = (code: string): string => {
  const symbols: Record<string, string> = {
    LAK: "₭",
    THB: "฿",
    CNY: "¥",
    USD: "$",
  };
  return symbols[code] || code;
};

export function formatCurrency(
  value: number,
  currencyCode: string = "LAK",
  rate: number = 1
) {
  const convertedValue = value / rate;

  // ปัดเศษให้เหลือ 2 ตำแหน่งตามที่ต้องการแสดงผลจริง 
  // เพื่อให้ผลรวมรายบรรทัดตรงกับยอดรวมที่ผู้ใช้เห็น
  const roundedValue = Math.round(convertedValue * 100) / 100;

  const formatted = roundedValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2, // แนะนำให้ใช้ 2 เท่ากันเพื่อให้สวยงาม
  });

  return `${formatted}${" " + getCurrencySymbol(currencyCode)}`;
}
