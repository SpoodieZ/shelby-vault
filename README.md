# Shelby Vault

Ứng dụng lưu trữ file phi tập trung trên **Shelby Protocol** (Aptos blockchain).

## Tính năng
- Upload file lên Shelby decentralized storage
- Xem danh sách file đang lưu
- Download file từ Shelbynet

## Cài đặt

### 1. Cài Node.js (nếu chưa có)
```bash
# macOS
brew install node
```

### 2. Cài dependencies
```bash
cd shelby-vault
npm install
```

### 3. Lấy API Key & Tài khoản Shelby

Cài Shelby CLI:
```bash
npm install -g @shelby-protocol/cli
shelby init
```

Hoặc lấy API key tại: https://explorer.shelby.xyz

### 4. Tạo file `.env.local`
```bash
cp .env.example .env.local
# Điền thông tin vào .env.local
```

```
SHELBY_API_KEY=your_api_key
SHELBY_ACCOUNT_ADDRESS=your_aptos_address
SHELBY_ACCOUNT_PRIVATE_KEY=your_private_key
```

### 5. Nạp token test (ShelbyUSD + APT)
Dùng faucet trên Shelbynet testnet để nhận token miễn phí.

### 6. Chạy app
```bash
npm run dev
# Mở http://localhost:3000
```

## Tech Stack
- **Next.js 14** — Frontend + API Routes
- **@shelby-protocol/sdk** — Shelby storage client
- **@aptos-labs/ts-sdk** — Aptos account signing
