import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export type ComparableFromDb = {
  price: number;
  year?: number | null;
  mileage?: number | null;
};

export async function fetchComparables(input: {
  brand: string;
  model: string;
  year: number;
  mileage: number;
}): Promise<ComparableFromDb[]> {
  if (!supabase) {
    return [];
  }

  const yearMin = Number(input.year) - 3;
  const yearMax = Number(input.year) + 3;
  const mileageMin = Math.max(0, Number(input.mileage) - 60000);
  const mileageMax = Number(input.mileage) + 60000;

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

  return (data || [])
    .map((item: any) => ({
      price: Number(item.price),
      year: item.year === null || item.year === undefined ? null : Number(item.year),
      mileage:
        item.mileage === null || item.mileage === undefined
          ? null
          : Number(item.mileage),
    }))
    .filter((item) => Number.isFinite(item.price));
}
