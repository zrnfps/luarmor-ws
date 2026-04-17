const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static(__dirname))

wss.on('connection', ws => {
    ws.type = null

    ws.on('message', raw => {
        let data
        try { data = JSON.parse(raw) } catch { return }

        // 🔥 registrar tipo
        if (data.type === "register") {
            ws.type = data.client
            console.log("📌", ws.type, "registrado")
            return
        }

        // 🔥 ROTEAMENTO CORRETO
        wss.clients.forEach(client => {
            if (client.readyState !== WebSocket.OPEN) return

            // SITE → GAME
            if (ws.type === "site" && client.type === "game") {
                client.send(JSON.stringify(data))
            }

            // GAME → SITE (IMPORTANTE!)
            if (ws.type === "game" && client.type === "site") {
                client.send(JSON.stringify(data))
            }
        })
    })
})

server.listen(process.env.PORT || 8080, () => {
    console.log("🚀 server rodando")
})
