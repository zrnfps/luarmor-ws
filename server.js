const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static(__dirname))

wss.on('connection', ws => {
    ws.type = null

    ws.on('message', msg => {
        let data

        try {
            data = JSON.parse(msg)
        } catch {
            return
        }

        // registrar tipo
        if (data.type === "register") {
            ws.type = data.client
            return
        }

        wss.clients.forEach(client => {
            if (client.readyState !== WebSocket.OPEN) return

            // site → game
            if (ws.type === "site" && client.type === "game") {
                client.send(JSON.stringify(data))
            }

            // game → site
            if (ws.type === "game" && client.type === "site") {
                client.send(JSON.stringify(data))
            }
        })
    })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log('🚀 server rodando'))
