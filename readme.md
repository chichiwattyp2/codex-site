# Lifted Leaf Co.

A concept storefront for a pre-roll brand featuring a product catalog and an AI concierge that analyzes facial mood cues to recommend strains from a curated knowledge base.

## Features

- ⚡️ React + Vite single-page experience with immersive visual design.
- 🛒 Product showcase with cart management and a slide-out drawer summary.
- 🤖 AI concierge that
  - loads `face-api.js` expression models from CDN and analyzes live webcam feed,
  - classifies moods and pairs them with strains from `src/data/strains.ts`,
  - supports manual mood selection and chat-based fallbacks, and
  - adds recommended products directly to the cart on request.
- 🔐 No images are persisted. Face data stays in-memory for the duration of the session.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed URL in your browser. Grant camera permissions to try the concierge. If the environment blocks camera access, you can still pick a mood chip or chat with the bot.

## Production Build

```bash
npm run build
npm run preview
```

The `build` command type-checks the project and emits the optimized bundle in `dist/`.

## Notes

- The face expression models are hosted on the jsDelivr CDN; no local downloads are required.
- For environments without webcam support (e.g., certain laptops or CI), fall back to the manual mood selector or chat prompts such as “Help me relax tonight.”
- Extend the product data in `src/data/products.ts` and strain knowledge base in `src/data/strains.ts` to scale the catalog.
