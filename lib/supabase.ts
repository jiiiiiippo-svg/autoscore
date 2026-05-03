import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string)
  : null;

export type ComparableFromDb = {
  price: number;
  year?: number | null;
  mileage?: number | null;
};

export async function fetchComparables(
  brandOrInput:
    | string
    | {
        brand: string;
        model: string;
        year: number;
        mileage: number;
      },
  modelArg?: string,
  yearArg?: number,
  mileageArg?: number
): Promise<ComparableFromDb[]> {
  if (!supabase) {
    return [];
  }

  const input =
    typeof brandOrInput === "string"
      ? {
          brand: brandOrInput,
          model: String(modelArg || ""),
          year: Number(yearArg),
          mileage: Number(mileageArg),
        }
      : brandOrInput;

  const yearMin = input.year - 3;
  const yearMax = input.year + 3;
  const mileageMin = Math.max(0, input.mileage - 60000);
  const mileageMax = input.mileage + 60000;

  const { data, error } = await supabase
    .from("market_listings")
    .select("price, year, mileage")
    .ilike("brand", input.brand)
    .ilike("model", input.model)
    .gte("year", yearMin)
    .lte("year", yearMax)
    .gte("mileage", mileageMin)
    .lte("mileage", mileageMax)
    .not("price", "is", null)
    .limit(20);

  if (error) {
    console.error("Supabase fetchComparables error:", error.message);
    return [];
  }

  return (data || []).filter((item) => Number.isFinite(Number(item.price)));
}

export function medianPrice(values: Array<number | ComparableFromDb>) {
  const clean = values
    .map((value) => {
      if (typeof value === "number") {
        return value;
      }

      return Number(value.price);
    })
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (clean.length === 0) {
    return null;
  }

  const middle = Math.floor(clean.length / 2);

  if (clean.length % 2 === 0) {
    return Math.round((clean[middle - 1] + clean[middle]) / 2);
  }

  return Math.round(clean[middle]);
}
