import { NextResponse } from "next/server";

export type Rating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

// Simple mock dataset
const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 99.99,
    description: "Bluetooth over-ear headphones with noise cancellation.",
    category: "electronics",
    image: "/vercel.svg",
    rating: { rate: 4.5, count: 1203 },
  },
  {
    id: 2,
    title: "Cotton T-Shirt",
    price: 19.99,
    description: "Soft 100% cotton t-shirt available in multiple colors.",
    category: "clothing",
    image: "/next.svg",
    rating: { rate: 4.1, count: 523 },
  },
  {
    id: 3,
    title: "Ceramic Coffee Mug",
    price: 12.5,
    description: "Dishwasher safe 350ml ceramic mug.",
    category: "home",
    image: "/globe.svg",
    rating: { rate: 4.7, count: 2119 },
  },
  {
    id: 4,
    title: "Running Shoes",
    price: 59.99,
    description: "Lightweight running shoes with breathable mesh upper.",
    category: "clothing",
    image: "/window.svg",
    rating: { rate: 4.2, count: 812 },
  },
  {
    id: 5,
    title: "Smartphone",
    price: 699,
    description:
      "6.1-inch display with dual camera system and long battery life.",
    category: "electronics",
    image: "/file.svg",
    rating: { rate: 4.6, count: 3420 },
  },
  {
    id: 6,
    title: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "Insulated bottle keeps drinks cold for 24h and hot for 12h.",
    category: "outdoors",
    image: "/vercel.svg",
    rating: { rate: 4.8, count: 1549 },
  },
];

function applySearch(products: Product[], query: string | null): Product[] {
  if (!query) return products;
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const haystack = `${p.title} ${p.description} ${p.category}`.toLowerCase();
    return haystack.includes(q);
  });
}

function applySort(
  products: Product[],
  sortField: string | null,
  order: string | null
): Product[] {
  if (!sortField) return products;
  const normalizedOrder = order === "desc" ? "desc" : "asc";
  if (sortField !== "category") return products;

  const sorted = [...products].sort((a, b) =>
    a.category.localeCompare(b.category)
  );
  return normalizedOrder === "desc" ? sorted.reverse() : sorted;
}

function generateProducts(total: number): Product[] {
  if (!Number.isFinite(total) || total <= 0) return [];
  if (total <= PRODUCTS.length) return PRODUCTS.slice(0, total);
  const generated: Product[] = [];
  const base = PRODUCTS;
  for (let i = 0; i < total; i++) {
    const src = base[i % base.length];
    const factor = Math.floor(i / base.length);
    generated.push({
      id: i + 1,
      title: `${src.title} ${factor > 0 ? `#${factor + 1}` : ""}`.trim(),
      price: Number((src.price + (factor % 7) * 1.11).toFixed(2)),
      description: src.description,
      category: src.category,
      image: src.image,
      rating: {
        rate: Math.min(
          5,
          Math.max(0, src.rating.rate + ((factor % 5) - 2) * 0.1)
        ),
        count: src.rating.count + factor * 3,
      },
    });
  }
  return generated;
}

const PREGENERATED_DATASET_SIZE = 1000;
const STABLE_DATASET: Product[] = (function () {
  // Pre-generate a stable dataset once per module load to keep results consistent
  return generateProducts(PREGENERATED_DATASET_SIZE);
})();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const category = searchParams.get("category");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const totalParam = searchParams.get("total");

  const page = Math.max(1, Number(pageParam) || 1);
  const limit = Math.max(1, Number(limitParam) || 50);
  // Default to the full pre-generated dataset so pagination works out of the box
  const requestedTotal = Math.max(
    1,
    Number(totalParam) || PREGENERATED_DATASET_SIZE
  );
  const totalToUse = Math.min(PREGENERATED_DATASET_SIZE, requestedTotal);

  // Use the pre-generated stable dataset, then slice to requested total to avoid regeneration
  let dataset = STABLE_DATASET.slice(0, totalToUse);
  dataset = applySearch(dataset, q);
  dataset = applySort(dataset, sort, order);

  if (category && category.trim()) {
    const c = category.trim().toLowerCase();
    dataset = dataset.filter((p) => p.category.toLowerCase() === c);
  }

  const total = dataset.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const end = start + limit;
  const data = dataset.slice(start, end);

  return NextResponse.json(
    {
      data,
      page: safePage,
      limit,
      total,
      totalPages,
    },
    { status: 200 }
  );
}
