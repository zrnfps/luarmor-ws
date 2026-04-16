const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static('public'))

wss.on('connection', (ws) => {
    console.log('🔗 Volt conectado')
    
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data)
            console.log(`${msg.type}: ${msg.button || 'ping'}`)
            
            // Envia para todos browsers
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msg))
                }
            })
        } catch (e) {
            console.log('Erro:', e)
        }
    })
    
    ws.on('close', () => {
        console.log('🔌 Volt desconectado')
    })
})

const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log('🚀 Luarmor WS na porta', port)
})
