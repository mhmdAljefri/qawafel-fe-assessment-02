## Qawafel Assessment App

This is a Next.js app with a mock API and a small UI scaffold. Use it to implement the required features described below.

### Getting Started

```bash
pnpm dev
# or: npm run dev | yarn dev | bun dev
```

Open http://localhost:3000 and start building.

---

## Mock API Documentation

### GET `/api/products`
Returns a stable list of mock products with search, category filtering, sorting, and pagination.

Query params:

- `q` string: full‑text search over `title`, `description`, `category`.
- `category` string: filter by category (see `/api/categories`).
- `sort` string: only `category` is supported.
- `order` string: `asc` | `desc` (default `asc`).
- `page` number: 1‑based page index (default `1`).
- `limit` number: items per page (default `50`).
- `total` number: limits the dataset size deterministically (default `1000`).

Response shape:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "price": 99.99,
      "description": "...",
      "category": "electronics",
      "image": "/vercel.svg",
      "rating": { "rate": 4.5, "count": 1203 }
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 1000,
  "totalPages": 20
}
```

Notes:

- The dataset is pre‑generated once per server process to keep IDs and ordering stable across requests.
- Pagination is applied after search/sort/category filtering.

Examples:

```text
/api/products?page=2&limit=50
/api/products?q=shirt&category=clothing&sort=category&order=desc
/api/products?total=120&page=3&limit=24
```

### GET `/api/categories`
Returns static categories for filtering.

Response:

```json
["electronics", "clothing", "home", "outdoors"]
```

---

## Assignment (for candidate)

Build the storefront experience and required features using the mock API. Please match the design shown in `public/design.png` (also visible in the task brief image) as closely as possible.

### Functional Requirements

1) Auth Flow
- Implement sign in and sign out (form can be minimal; no real backend required).
- Protect any "cart" or "checkout" area behind auth. Redirect unauthenticated users to sign in.

2) Products Catalog
- Render products grid with images, titles, prices, and actions.
- Implement search, category filtering (use `/api/categories`), and sort by category.
- Implement pagination UI that consumes `page`/`limit` from `/api/products`.

3) Cart Management
- Add to cart from product cards; adjust quantity (+/−); remove items.
- Persist cart (approach is your choice).
- Display cart count in the header and a basic cart view/overlay.

### UI/UX Requirements

- Match `public/design.png` for layout, spacing, and general style.
- Use the existing header with the provided logo; action icons use `lucide-react`.
- Make the grid responsive and accessible (semantic labels, focus styles, button names).

### Tech Notes

- Framework: Next.js App Router.
- Styling: Tailwind is configured, but the styling approach is your choice.
- Types: Keep `Product`/`Rating` types in sync with the mock API.

Good luck, and have fun!
