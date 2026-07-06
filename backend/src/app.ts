import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
  res.send("OK");
});

export default app;