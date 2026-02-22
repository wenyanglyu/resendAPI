# resendapi — Setup Guide

## Prerequisites

- Free account on [Resend.com](https://resend.com)
- Free account on [Cloudflare.com](https://cloudflare.com)

---

## Step 1 — Resend: Get API Key

1. Sign up at https://resend.com
2. Go to **API Keys** → **Create API Key**
3. Copy the key — you'll need it in Step 3

---

## Step 2 — Cloudflare: Deploy the Worker

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create Application** → **Create Worker**
3. Connect to GitHub public repo and name the application **resendapi**
   - This matches the name in `wrangler.jsonc`
4. Click **Deploy**

---

## Step 3 — Cloudflare: Add Environment Variables

Go to your Worker → **Settings** → **Variables and Secrets**

| Key | Type | Value |
|-----|------|-------|
| `RECIPIENT_EMAIL` | Plain text | Your Resend registered email address |
| `RESEND_API_KEY` | Secret | API key from Step 1 |

> To change the recipient later, just update `RECIPIENT_EMAIL` here. No app change needed.

---

## How It Works

```
SKU Trainer  →  POST /send-email { subject, body }
                      ↓
              Cloudflare Worker  (adds recipient from env)
                      ↓
                   Resend API
                      ↓
                    📧 Email
```
