import express from "express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import http from "http";
import url from "url";
import supabase from "./utilis/supabase.js";
import initiate from "./websocket/initiate.js";
import handleMessage from "./websocket/handleMessage.js";
import handleClose from "./websocket/handleClose.js";
import crypto from "crypto";
import cors from "cors";
import mainRouter from "./routes/mainRoute.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket to the same server
const wss = new WebSocketServer({ server });

const clients = new Map();
const devices = new Map();

const interval = setInterval(() => {
  console.log(Array.from(wss.clients).length);
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log("Terminating dead connection");
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, process.env.HEARTBEAT_INTERVAL);

wss.on("close", () => {
  clearInterval(interval);
});

wss.on("connection", async (ws, req) => {
  ws.isAlive = true;

  const parameters = url.parse(req.url, true).query;
  const { role, id } = parameters;
  const channel = await initiate({ role, id, ws, clients, devices });

  if (!channel) {
    ws.close(1008, "Something went wrong!");
    return;
  }

  const { clientID, devicesID } = channel;

  ws.on("message", (message) => {
    handleMessage({ role, clientID, devicesID, message, ws, clients, devices });
  });
  ws.on("pong", () => {
    ws.isAlive = true;
    ws.lastSeen = new Date();
  });

  ws.on("close", () => {
    handleClose({ role, clientID, devicesID, ws, clients, devices });
  });

  ws.on("error", console.error);
});

// Normal HTTP route

app.get("/", (req, res) => {
  mainRouter(req, res, wss);
});

app.get("/generate-api-key", async (req, res) => {
  const id = req.headers["authorization"].split(" ")[1];
  if (!id) {
    return res.json({ error: "ID is required" }).status(400);
  }
  const apiKey = crypto.randomBytes(32).toString("base64");
  const { data, error } = await supabase
    .from("profiles")
    .update({ api_key: apiKey })
    .eq("id", id)
    .select("*");
  if (error) {
    return res.json({ error: error.message }).status(500);
  }
  res.json({ message: "API key generated", key: apiKey }).status(200);
});
app.get("/register-phone-number", async (req, res) => {
  const { id, phoneNumber } = req.query;
  if (!id) {
    return res.json({ error: "ID is required" }).status(400);
  }
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return res.json({ error: error.message }).status(500);
  }
  if (!data) {
    return res.json({ error: "ID not found" }).status(404);
  }
});

app.get("/register-device", async (req, res) => {
  const { id, deviceId } = req.query;
  if (!id) {
    return res.json({ error: "ID is required" }).status(400);
  }
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return res.json({ error: error.message }).status(500);
  }
  if (!data) {
    return res.json({ error: "ID not found" }).status(404);
  }
  if (data.deviceKey === deviceId) {
    return res.json({ data: data, message: "Logged in" }).status(200);
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("channels")
    .update({ deviceKey: deviceId })
    .eq("id", id)
    .select("*");
  if (updateError) {
    return res.json({ error: updateError.message }).status(500);
  }
  if (!data) {
    return res.json({ error: "Device not found" }).status(404);
  }

  return res
    .json({ data: updatedData[0], message: "Device registered successfully" })
    .status(200);
});

server.listen(PORT,() => {
  console.log("Server running on PORT:", PORT);
});
