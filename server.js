const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// base Telegram API
const TELEGRAM_API = "https://api.telegram.org";

// proxy route
app.all("/telegram/*", async (req, res) => {
  try {
    const targetUrl = TELEGRAM_API + req.originalUrl.replace("/telegram", "");

    const options = {
      method: req.method,
      headers: { ...req.headers, host: "api.telegram.org" },
    };

    if (req.method !== "GET" && req.body && Object.keys(req.body).length > 0) {
      const params = new URLSearchParams(req.body);
      options.body = params;
    }

    const telegramResponse = await fetch(targetUrl, options);
    const data = await telegramResponse.text();

    res.status(telegramResponse.status).send(data);

  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("Telegram Proxy OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on " + PORT));
