# Sri Sai Mandira Billing & Seva Management System

A high-performance, real-time multi-device billing and temple administration system built with React, TypeScript, Tailwind CSS, and Google Firebase Firestore.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18 or v20+
- **npm** or **yarn** / **pnpm**

### Steps
1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd sri-sai-mandira-billing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Push to GitHub

1. Initialize git in your local directory (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Sri Sai Mandira Billing System"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Link your remote repository and push:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚂 Deploy to Railway (railway.app)

1. Sign in to **[Railway.app](https://railway.app)**.
2. Click **+ New Project** → **Deploy from GitHub repo**.
3. Select your repository `sri-sai-mandira-billing`.
4. Railway will automatically detect the **Nixpacks / Node.js** build configuration (`railway.json` and `nixpacks.toml` are already pre-configured).
5. Once the build completes, go to **Settings** → **Networking** → **Generate Domain** to get your public live URL (e.g., `https://sri-sai-mandira-billing.up.railway.app`).

### Multi-Device Real-Time Cloud Sync
The application is pre-configured with Google Cloud Firestore. All billing receipts, devotees, sevas catalog, expenses, and accounts will synchronize in real-time across all connected devices and operators automatically!

---

## 🛠 Available Scripts

- `npm run dev`: Starts local development server on port 3000
- `npm run build`: Type-checks and builds the production bundle into `dist/`
- `npm run preview`: Previews the production build locally
- `npm run start`: Starts the production web server (used by Railway and cloud hosts)
- `npm run lint`: Runs TypeScript validation checks

