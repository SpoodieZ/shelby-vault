# Shelby Vault

A decentralized file storage app built on [Shelby Protocol](https://shelby.xyz) and the Aptos blockchain. Upload, store, and download files from a globally distributed network — no centralized server, no single point of failure.

**Live demo:** [shelby-vault-alpha.vercel.app](https://shelby-vault-alpha.vercel.app)

---

## Features

- **Upload files** — drag & drop or click to select (up to 100MB)
- **Decentralized storage** — files are erasure-coded and distributed across Shelby's global node network
- **On-chain proof** — every upload is committed to the Aptos blockchain
- **Download anytime** — retrieve your files from anywhere
- **Bilingual UI** — English / Vietnamese toggle
- **Shelby brand design** — warm cream palette, hexagon motifs, pink accents

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | [Next.js 16](https://nextjs.org) |
| Decentralized storage | [@shelby-protocol/sdk](https://docs.shelby.xyz) |
| Blockchain signing | [@aptos-labs/ts-sdk](https://aptos.dev) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### 1. Install Node.js (if not already installed)

```bash
# macOS — using nvm (no sudo required)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 22
```

### 2. Clone and install dependencies

```bash
git clone https://github.com/SpoodieZ/shelby-vault.git
cd shelby-vault
npm install
```

### 3. Set up a Shelby account

Install the Shelby CLI and generate a new account:

```bash
npm install -g @shelby-protocol/cli
shelby init --setup-default
```

Fund your account with testnet tokens:

```bash
shelby faucet
```

Or fund programmatically using the SDK:

```js
await client.fundAccountWithAPT({ address, amount: 100_000_000 })
await client.fundAccountWithShelbyUSD({ address, amount: 100_000_000 })
```

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
SHELBY_API_KEY=           # optional — required for file listing via indexer
SHELBY_ACCOUNT_ADDRESS=   # your Aptos account address (0x...)
SHELBY_ACCOUNT_PRIVATE_KEY=  # ed25519-priv-0x...
```

> **Note:** `SHELBY_API_KEY` is needed to list files from the Shelby indexer.
> Without it, the app falls back to browser localStorage for the file list.
> Join the early access program at [developers.shelby.xyz](https://developers.shelby.xyz) to get one.

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment

This app is deployed on Vercel. To deploy your own instance:

```bash
npx vercel deploy --prod
```

Set the environment variables in Vercel:

```bash
npx vercel env add SHELBY_ACCOUNT_ADDRESS production
npx vercel env add SHELBY_ACCOUNT_PRIVATE_KEY production
npx vercel env add SHELBY_API_KEY production   # optional
```

---

## How It Works

1. **Upload** — the file is read as a `Uint8Array`, erasure-coded via Clay codes, and distributed across Shelby storage providers worldwide.
2. **Registration** — blob commitments (merkle root + chunkset hashes) are written to the Aptos blockchain for cryptographic verification.
3. **Download** — the RPC node fetches and reassembles the chunks on demand, streaming the file back to the client.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts   — handles file upload to Shelby
│   │   ├── download/route.ts — streams file from Shelby
│   │   └── list/route.ts     — fetches blob list from indexer
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   └── FileVault.tsx         — main UI component
└── lib/
    └── shelby.ts             — Shelby client singleton
```

---

## Network

Currently running on **Shelbynet Testnet**.

- RPC endpoint: `https://api.shelbynet.shelby.xyz/shelby`
- Aptos fullnode: `https://api.shelbynet.shelby.xyz/v1`
- Explorer: [explorer.shelby.xyz](https://explorer.shelby.xyz/shelbynet)

---

## License

MIT
