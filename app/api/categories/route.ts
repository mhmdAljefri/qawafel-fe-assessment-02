import { NextResponse } from "next/server";

// Static categories for filtering
const CATEGORIES = ["electronics", "clothing", "home", "outdoors"];

export async function GET() {
  return NextResponse.json(CATEGORIES, { status: 200 });
}
