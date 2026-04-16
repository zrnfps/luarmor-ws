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

            console.log("📥", m)

            // broadcast pra todo mundo (site + roblox)
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
        console.log('❌ Cliente saiu')
    })
})

server.listen(process.env.PORT || 8080, () => {
    console.log('🚀 Rodando')
})
