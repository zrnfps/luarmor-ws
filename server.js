const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static('public'))

wss.on('connection', ws => {
    console.log('🔗 Cliente conectado')

    ws.on('message', d => {
        try {
            const m = JSON.parse(d)

            if (m.type === "button") {
                console.log("🖱 BTN:", m.name)
            }

            else if (m.type === "remote") {
                console.log("📡 REMOTE:", m.remote, m.args)
            }

            else if (m.type === "raw") {
                console.log("📤 RAW:", m.content)
            }

            else {
                console.log("📦 JSON:", m)
            }

            // broadcast pra todos (site + roblox)
            wss.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(JSON.stringify(m))
                }
            })

        } catch {
            console.log("⚠️ STRING:", d.toString())

            wss.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(d.toString())
                }
            })
        }
    })

    ws.on('close', () => {
        console.log('❌ Cliente desconectado')
    })
})

server.listen(process.env.PORT || 8080, () => {
    console.log('🚀 Server rodando')
})
