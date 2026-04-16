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

            // 🔥 LOG BONITO
            if (m.type === "remote") {
                console.log(`📡 ${m.method} -> ${m.remote}`)
            }
            else if (m.type === "button") {
                console.log(`🖱 ${m.name}`)
            }
            else {
                console.log("📦", m)
            }

            // 🔥 broadcast pra todos (site + roblox)
            wss.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(JSON.stringify(m))
                }
            })

        } catch {
            console.log("📩 STRING:", d.toString())
        }
    })

    ws.on('close', () => {
        console.log('❌ Cliente desconectado')
    })
})

server.listen(process.env.PORT || 8080, () => {
    console.log('🚀 Server rodando')
})
