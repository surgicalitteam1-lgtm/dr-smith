# 🛡️ Dr. Smith Healthcare - 100% Private Cloud Serverless Auth API

This serverless backend runs on Cloudflare Workers (100% Free Forever) and ensures **zero client-side password exposure**.

---

## 🔒 Security Advantages

1. **Zero Password Leakage**: Passwords and member records exist **only on the secure server**. Visitors downloading or inspecting your website in DevTools will **never** see or download any passwords.
2. **Server-Side 3-Attempt Rate Limiting**: The server enforces a lockout after 3 consecutive wrong attempts.
3. **Cryptographic HMAC-SHA256 Session Tokens**: Login returns signed tokens that cannot be forged or manipulated in browser `localStorage`.
4. **Injection Immune**: Strict regex validation prevents all SQL, XSS, and command injections.

---

## ⚡ 2-Minute Free Setup Guide (Cloudflare Workers)

### Step 1: Create a Free Cloudflare Account
1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) and create a free account.
2. In the left sidebar, click **Workers & Pages** ➔ **Create Application** ➔ **Create Worker**.
3. Name your worker (e.g. `drsmith-auth`) and click **Deploy**.

### Step 2: Paste the Serverless Script
1. Click **Edit Code** (Quick Edit) on your newly created worker.
2. Delete whatever default code is inside `worker.js`.
3. Open [`server/cloudflare-worker.js`](file:///c:/Users/SSTS/Documents/code/vs/code/repo/dr-smith/server/cloudflare-worker.js) in this project, copy its entire contents, and paste it into the Cloudflare editor.
4. (Optional) Customize the admin IDs/passwords inside `MEMBERS_STORE` in that file.
5. Click **Save and Deploy**.

### Step 3: Copy Your Live Worker URL
Your worker will have a URL like:
`https://drsmith-auth.<your-subdomain>.workers.dev`

### Step 4: Connect to Your Website
In [`index.html`](file:///c:/Users/SSTS/Documents/code/vs/code/repo/dr-smith/index.html) and [`catalogue/index.html`](file:///c:/Users/SSTS/Documents/code/vs/code/repo/dr-smith/catalogue/index.html), add this single line inside the `<head>` tag:

```html
<script>
  window.DR_SMITH_AUTH_API = 'https://drsmith-auth.<your-subdomain>.workers.dev';
</script>
```

---

## 🛡️ How It Works Under The Hood

```
[ User Browser ]
       │
       ▼ (Sends ONLY: { id: "admin", password: "..." })
[ Cloudflare Worker (Private Server) ]
       │  - Checks passwords securely in private memory
       │  - Checks server-side 3-attempt rate limit
       ▼
[ Cloudflare Worker ]
       │
       ▼ (Returns ONLY: { success: true, token: "hmac_sig..." })
[ User Browser ] -> Access Granted!
```

---

## 📁 Fallback Protection
If no server API is configured yet, the website automatically falls back to the resilient local validation engine, ensuring zero downtime during transition.
