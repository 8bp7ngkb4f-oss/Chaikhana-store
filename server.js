require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const Stripe = require("stripe");

const app = express();
const PORT = process.env.PORT || 4242;
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "products.json"), "utf8"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (_req, res) => res.json(products));

app.post("/create-checkout-session", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("REPLACE")) {
      return res.status(503).json({ error: "Online payment is not configured yet. Add your Stripe secret key." });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: "Your cart is empty." });

    const line_items = items.map(item => {
      const product = products.find(p => p.id === item.id);
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      if (!product || !Number.isInteger(product.price) || product.price <= 0) {
        throw new Error("A product price is not configured yet.");
      }
      return {
        quantity,
        price_data: {
          currency: product.currency || "eur",
          unit_amount: product.price,
          product_data: { name: product.name.en || product.name.fr }
        }
      };
    });

    const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${base}/?payment=success`,
      cancel_url: `${base}/?payment=cancelled`
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message || "Unable to start payment." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`CHAIKHANA is running on port ${PORT}`));
