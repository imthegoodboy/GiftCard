# 🎁 GiftCard – Universal Crypto Gift Cards

> Send crypto gift cards that can be redeemed in **any cryptocurrency** on **any chain**, powered by **SideShift API v2**.

---

 
## 🚀 What is GiftCard?

**GiftCard** is a web application that enables anyone to create and send crypto gift cards that recipients can redeem in their preferred cryptocurrency on any blockchain—without needing the same wallet, token, or network.

**Think of it like:**
- 🎁 **Amazon Gift Card, but for crypto** — cross-chain, instant, and simple
- 💸 Universal gift cards that work across 200+ assets and 40+ blockchains

---

## 🚨 The Problem We Solve

Current crypto gifting is broken:

- ❌ Sender has ETH, receiver wants USDT
- ❌ Sender is on Solana, receiver uses Polygon  
- ❌ Receiver may be new to crypto and confused
- ❌ Manual swaps are confusing and risky
- ❌ Wrong chain = funds lost forever

**👉 Crypto is powerful, but terrible for gifting.**

---

## ✅ Our Solution

GiftCard makes crypto gifting:

✨ **Chain-agnostic** – Works across any blockchain  
✨ **Token-agnostic** – Pay with any crypto, receive any crypto  
✨ **Beginner-friendly** – No technical knowledge required  
✨ **Non-custodial** – Your keys, your crypto  
✨ **Instant** – Powered by SideShift for lightning-fast swaps  

The sender pays with **ANY crypto**, and the receiver redeems in **ANY crypto** — seamlessly powered by **SideShift's cross-chain swap API**.

---

## 👥 How It Works

### 🧑‍💻 **Sender Flow (Gift Creator)**

1. **Open GiftCard** website
2. Click **"Create Gift Card"**
3. Enter:
   - Gift amount (e.g., $25 USD)
   - Optional personal message
   - Optional expiry date
4. **Choose payment cryptocurrency** (e.g., SOL on Solana)
5. Click **"Pay"**
   - **SideShift API** converts SOL → stable settlement asset (USDT on Tron)
6. **Gift created successfully!**
   - Receive gift link
   - QR code for easy sharing
   - Shareable URL

✅ **Sender is done.** No further wallet management required.

---

### 🎁 **Receiver Flow (Gift Claimer)**

1. **Open gift link** (shared by sender)
2. View:
   - Gift amount
   - Personal message from sender
3. Click **"Redeem Gift"**
4. Choose:
   - Preferred blockchain (Ethereum, Polygon, Solana, etc.)
   - Preferred token (USDT, MATIC, ETH, BTC, etc.)
5. Enter **wallet address**
6. Click **"Claim"**
   - **SideShift API** executes swap: Stable asset → chosen token & chain
7. **Funds arrive directly in wallet** 🎉

✅ **Receiver never worries about chains or swaps.**

---

## 🔀 How SideShift Powers Our App

**SideShift is not optional — it powers the entire application.**

### 🔹 **1. Gift Creation Swap**
- Sender pays in **any token**
- SideShift converts it to a **stable holding asset** (USDT on Tron)
- This makes the gift value **stable** and **chain-neutral**

### 🔹 **2. Gift Redemption Swap**
- Receiver selects **any chain/token** they prefer
- SideShift swaps from **stable asset → chosen asset**
- **Direct-to-wallet delivery** with no manual intervention

**👉 Zero-UI + Cross-Chain Power = Perfect UX**

---

## 🧠 Why SideShift is Perfect for GiftCard

✅ No need to build custom bridges  
✅ No DEX liquidity headaches  
✅ No custody of user funds  
✅ Direct-to-wallet swaps  
✅ Supports **200+ assets** across **40+ chains**  
✅ Variable & fixed-rate shifts  
✅ Built for real-world use cases like gifting  

**This is exactly the kind of integration SideShift was designed for.**

---

## 🧰 Tech Stack

### **Frontend**
- **Next.js 15** (App Router)
- **React Three Fiber** (3D gift card animations)
- **Tailwind CSS** + **Framer Motion** (Modern UI/UX)
- **Lucide Icons**

### **Backend**
- **Next.js API Routes**
- **SideShift API v2** integration
- **MongoDB** for gift storage

### **Key Features**
- Cross-chain swaps via **SideShift**
- Gift tracking & status monitoring
- QR code generation for easy sharing
- Real-time exchange rates
- Support for 200+ cryptocurrencies

---

## 📂 Project Structure

```
orchids-greetings/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── create/page.tsx             # Create gift card flow
│   │   ├── redeem/[giftId]/page.tsx    # Redeem gift card
│   │   ├── track/page.tsx              # Track gift status
│   │   └── api/
│   │       ├── coins/route.ts          # Get available coins
│   │       ├── pair/route.ts           # Get exchange rates
│   │       ├── qrcode/route.ts         # Generate QR codes
│   │       └── gifts/
│   │           ├── create/route.ts     # Create new gift
│   │           ├── [giftId]/route.ts   # Get gift details
│   │           └── redeem/route.ts     # Redeem gift
│   ├── components/
│   │   ├── Navbar.tsx                  # Navigation component
│   │   ├── GiftCard3D.tsx              # 3D gift card visual
│   │   └── ui/                         # shadcn/ui components
│   └── lib/
│       ├── mongodb.ts                  # Database connection
│       ├── sideshift.ts                # SideShift API wrapper
│       ├── types.ts                    # TypeScript types
│       └── utils.ts                    # Utility functions
├── .env                                # Environment variables
└── README.md                           # This file
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# SideShift API
SIDESHIFT_SECRET=your_sideshift_secret_key
SIDESHIFT_AFFILIATE_ID=your_affiliate_id
SIDESHIFT_API=https://sideshift.ai/api/v2

# Gemini AI (optional features)
GEMINI_API_KEY=your_gemini_api_key

# WalletConnect (optional wallet integration)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WC_PROJECT_ID=your_wc_project_id

# Pinata (optional NFT features)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- MongoDB instance
- SideShift API credentials

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🎨 Features

### ✨ **Landing Page**
- Stunning 3D animated gift card
- Purple/green gradient theme
- Feature highlights
- How it works section

### 💳 **Create Gift Card**
- Multi-step creation wizard
- Set gift amount in USD
- Add personalized message
- Select payment cryptocurrency (200+ options)
- Get deposit address for payment
- Receive shareable gift link and QR code

### 🎁 **Redeem Gift Card**
- View gift details and sender message
- Choose preferred cryptocurrency to receive
- Select preferred blockchain network
- Enter wallet address
- One-click redemption with automatic swap

### 📊 **Track Gift Status**
- Monitor gift card status:
  - **Pending** – Awaiting deposit
  - **Funded** – Ready to claim
  - **Claimed** – Successfully redeemed
  - **Expired** – Past expiry date

---

## 🧪 API Endpoints

### **GET** `/api/coins`
Fetches all available cryptocurrencies from SideShift (200+ assets).

### **GET** `/api/pair`
Gets exchange rate and limits for a trading pair.

**Query params:**
- `depositCoin`, `depositNetwork`
- `settleCoin`, `settleNetwork`

### **POST** `/api/gifts/create`
Creates a new gift card.

**Body:**
```json
{
  "amountUsd": 25,
  "message": "Happy Birthday!",
  "depositCoin": "SOL",
  "depositNetwork": "solana",
  "senderAddress": "wallet_address"
}
```

### **GET** `/api/gifts/[giftId]`
Retrieves gift card details and status.

### **POST** `/api/gifts/redeem`
Redeems a gift card.

**Body:**
```json
{
  "giftId": "uuid",
  "redeemCoin": "USDT",
  "redeemNetwork": "polygon",
  "redeemAddress": "wallet_address"
}
```

### **GET** `/api/qrcode`
Generates QR code for gift link.

---

## 🧩 How SideShift Integration Works

### **Gift Creation:**
```typescript
// 1. Get exchange rate
const pairInfo = await getPair(depositCoin, depositNetwork, 'USDT', 'tron');

// 2. Create variable shift
const shift = await createVariableShift(
  depositCoin, depositNetwork,
  'USDT', 'tron',
  settlementAddress,
  refundAddress,
  userIp
);

// 3. User deposits to shift.depositAddress
// 4. SideShift automatically swaps to USDT and holds it
```

### **Gift Redemption:**
```typescript
// 1. Get exchange rate for redemption
const pairInfo = await getPair('USDT', 'tron', redeemCoin, redeemNetwork);

// 2. Create redemption shift
const redeemShift = await createVariableShift(
  'USDT', 'tron',
  redeemCoin, redeemNetwork,
  receiverWalletAddress,
  undefined,
  userIp
);

// 3. SideShift swaps USDT → chosen asset
// 4. Funds delivered to receiver's wallet
```

---

## 🏆 Why Judges Will Love GiftCard

| Criteria | Why GiftCard Scores High |
|----------|-------------------------|
| **API Integration** | SideShift used twice per gift (creation + redemption) |
| **Use Case** | Mass adoption potential, non-trading focused |
| **Originality** | Simple idea, powerful cross-chain execution |
| **Crypto-Native** | Truly cross-chain, wallet-first approach |
| **UX** | Extremely easy to understand and use |
| **Real-World Value** | Solves actual crypto usability problems |

---

## 🔮 Future Enhancements

- 🎨 NFT-based gift cards
- 📧 Email / WhatsApp delivery
- 🏢 Corporate bulk gifting
- 🎯 Brand partnerships
- 🏆 DAO community rewards
- 💎 Premium gift card designs

---

## 🤝 Contributing

We welcome contributions! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **SideShift.ai** – For providing the cross-chain swap infrastructure
- **Next.js** – For the amazing React framework
- **MongoDB** – For reliable data storage
- **shadcn/ui** – For beautiful UI components

---

## 📞 Contact & Support

For questions or support:
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for the SideShift Hackathon**

*Making crypto gifting simple, universal, and delightful.*
