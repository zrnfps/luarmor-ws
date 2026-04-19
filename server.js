const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

app.use(express.static(__dirname));

wss.on("connection", (ws) => {
    ws.type = null;

    ws.on("message", (msg) => {
        let data;

        try {
            data = JSON.parse(msg);
        } catch {
            return; // evita crash
        }

        // =========================
        // REGISTRO
        // =========================
        if (data.type === "register") {
            ws.type = data.client; // "site" ou "game"
            return;
        }

        // =========================
        // SITE → GAME
        // =========================
        if (ws.type === "site") {
            wss.clients.forEach((client) => {
                if (
                    client.readyState === WebSocket.OPEN &&
                    client.type === "game"
                ) {
                    client.send(JSON.stringify(data));
                }
            });
        }

        // =========================
        // GAME → SITE (PLAYERS)
        // =========================
        if (ws.type === "game" && data.type === "players") {
            wss.clients.forEach((client) => {
                if (
                    client.readyState === WebSocket.OPEN &&
                    client.type === "site"
                ) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on("close", () => {
        ws.type = null;
    });
});

server.listen(process.env.PORT || 8080, () => {
    console.log("🚀 Server rodando");
});
