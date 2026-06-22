<div align="center">

# 🛠️ Awesome Moni Scripts

### Ready-to-run **HTTP/HTTPS interceptor scripts** for tweaking, debugging & ad-blocking apps on your own device

**Block in-app ads · Mock API responses · Rewrite requests · Decrypt HTTPS · Tweak app UI**

[![Scripts](https://img.shields.io/badge/scripts-10+-blue)](#-script-catalog)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)
![Platform](https://img.shields.io/badge/iOS%20%7C%20Android%20%7C%20macOS-lightgrey)

⭐ **Star this repo to unlock more script packs for popular apps** ⭐

</div>

---

## 🔍 What is this?

A community collection of small **JavaScript interceptor scripts** you can run
against **your own device's traffic** to debug, customize and clean up apps —
no root, no jailbreak. Each script hooks the request/response of an HTTP(S)
connection and lets you read or modify it on the fly.

These are the kind of scripts power users and developers use to:

- 🚫 **Block ads & trackers** baked into apps
- 🧪 **Mock API responses** while building / testing your own app
- ✂️ **Rewrite requests** — strip tracking params, change headers, redirect URLs
- 🔓 **Decrypt & inspect HTTPS** bodies (JSON, JWT, protobuf)
- 🎨 **Tweak app UI** by editing the response your *own* client receives

> ⚠️ **Use responsibly.** These scripts are for inspecting and modifying
> **your own traffic on your own device** — debugging, learning, ad-blocking,
> and testing apps you build. They are **not** for bypassing paid features,
> forging data, or attacking services you don't own. See [DISCLAIMER](#-disclaimer).

---

## ▶️ How to run these scripts

These scripts use the standard **`onRequest` / `onResponse`** interceptor API.
To run them directly on your phone (no PC needed), you need an on-device proxy
engine that supports JS scripting. The easiest one we've found:

### 📲 Moni Proxy — HTTP debugger with JS scripting (iOS / Android / macOS)

> **Moni Proxy** is a Proxyman/Charles-style HTTP(S) debugging proxy that runs
> *on the device itself* and can execute these `onRequest/onResponse` scripts
> live. It's just a suggestion — any tool implementing the same API works — but
> it's what these snippets are tested against.

👉 **Get it for iOS, Android & macOS: [moniproxy.com](https://moniproxy.com/)**

**Steps:**
1. Install the proxy engine and trust its CA certificate (in-app guide).
2. Open **Rules → Script → Add**, or import a whole pack via
   **Rules → ⋯ → Import config**.
3. Paste a script from the [catalog](#-script-catalog) below, set the URL
   pattern, and turn it on.
4. Open the target app — the script runs automatically on matching requests.

---

## 📚 Script catalog

| Pack | What it does | Folder |
|---|---|---|
| 🚫 **Ad-block** | Remove banner/interstitial ads & analytics beacons — incl. a 🇻🇳 Vietnam pack + auto-updating [hostsVN](https://github.com/bigdargon/hostsVN) feed | [`scripts/adblock`](scripts/adblock) |
| 🧪 **Mock API** | Return fake/canned JSON so you can build a UI before the backend exists | [`scripts/mock`](scripts/mock) |
| ✂️ **Rewrite** | Strip tracking query params, swap headers, redirect hosts | [`scripts/rewrite`](scripts/rewrite) |
| 🔓 **Decrypt / inspect** | Pretty-print JSON, decode JWT, dump bodies to the console | [`scripts/decrypt`](scripts/decrypt) |
| 🎨 **UI tweaks** | Edit the response your own client renders (themes, flags, copy) | [`scripts/ui-tweaks`](scripts/ui-tweaks) |
| 🧰 **Utility** | Latency simulation, force JSON, custom User-Agent, A/B flags | [`scripts/utility`](scripts/utility) |
| 🎓 **Demo / learn** | Fully-commented examples of the core techniques: strip cache headers, parse→edit→re-stringify a JSON body, return a full mock response | [`scripts/demo`](scripts/demo) |

Every script is a single `.js` file with inline comments. Copy → paste → run.

---

## 🎓 Demo — debug your own app

New to interceptor scripts? Start with the fully-commented examples in
[`scripts/demo`](scripts/demo), then see the companion repo for debugging
**apps you build yourself** (inspect requests, mock your own API, force UI
states while developing):

👉 **[ios-script-proxy](https://github.com/anhvq25/ios-script-proxy)**

---

## ✨ The scripting API (cheat-sheet)

```js
// Runs before the request leaves your device.
async function onRequest(context, request) {
  // request.url, request.method, request.headers, request.body
  request.headers['X-Debug'] = 'moni';
  return request;            // return null to block the request
}

// Runs after the response arrives, before your app sees it.
async function onResponse(context, request, response) {
  // response.statusCode, response.headers, response.body
  return response;
}
```

- `request` / `response` are plain objects — mutate and `return` them.
- `console.log(...)` prints to the proxy's log console.
- You can `await fetch(...)` inside a script to call other APIs.

📖 **Want to write your own? Read the full guide:
[docs/WRITING-SCRIPTS.md](docs/WRITING-SCRIPTS.md)** — every field on
`request` / `response` / `context`, session state, blocking, URL matching,
recipes and gotchas.

---

## 🌟 Unlock more packs

This repo grows with community stars. **Hit ⭐ Star** and we'll keep publishing
new packs:

- [ ] **100 ⭐** → "Streaming & video" pack (subtitle injection, quality flags)
- [ ] **250 ⭐** → "Social apps" pack (hide sponsored posts, clean feeds)
- [ ] **500 ⭐** → "Developer toolkit" pack (GraphQL inspector, gRPC decode)

Watch + Star to get notified when they drop. 👀

---

## 🤝 Contributing

PRs welcome! Add a `.js` file to the right folder with:
1. A top comment: what it does + a sample URL pattern.
2. Only the legitimate use-cases described in the [disclaimer](#-disclaimer).

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🙏 Credits

- 🇻🇳 The Vietnam ad-block scripts ([`block-vietnam-ads.js`](scripts/adblock/block-vietnam-ads.js),
  [`hostsvn-remote-blocklist.js`](scripts/adblock/hostsvn-remote-blocklist.js))
  use domains from the excellent community project
  **[hostsVN](https://github.com/bigdargon/hostsVN)** by
  [bigdargon](https://github.com/bigdargon). Go ⭐ it.

---

## 📖 Mục đích / Purpose

> **Tài liệu học tập, demo và tham khảo.** Repo này được cung cấp **chỉ cho mục
> đích học tập, minh hoạ kỹ thuật và tham khảo** — để hiểu cách interceptor
> `onRequest`/`onResponse` hoạt động trên **traffic và thiết bị của chính bạn**.
>
> Learning, demo and reference material only.

## 🚫 Nghiêm cấm / Prohibited use

**NGHIÊM CẤM** dùng bất kỳ script nào ở đây để:

- ❌ Hack, crack, trick, can thiệp trái phép vào app/dịch vụ **không thuộc sở
  hữu của bạn**.
- ❌ Qua mặt thanh toán, mở khoá tính năng trả phí, giả mạo subscription /
  entitlement / số dư của bên thứ ba.
- ❌ Giả mạo dữ liệu, vượt xác thực, hay tấn công/scrape/làm gián đoạn dịch vụ
  mà không được phép.

Strictly **prohibited**: hacking, tricking, bypassing payments/licensing,
forging data, or tampering with services you do **not** own.

---

## ⚖️ Disclaimer

These scripts are provided for **educational, debugging, ad-blocking and
personal-customization** purposes, to be used on **traffic and devices you own
or are authorized to test**. Do **not** use them to:

- bypass paid features or licensing of apps you don't own,
- forge balances, credits, or other data of third-party services,
- attack, scrape, or disrupt services without permission.

You are responsible for complying with the Terms of Service of any app you use
these with, and with the laws of your jurisdiction. The authors accept no
liability for misuse. Licensed under [MIT](LICENSE).

---

<div align="center">

**Found this useful? Drop a ⭐ — it helps other tinkerers find it.**

</div>
