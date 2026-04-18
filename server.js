const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {

    ws.type = null

    ws.on('message', (msg) => {
        let data
        try { data = JSON.parse(msg) } catch { return }

        // registrar cliente
        if (data.type === "register") {
            ws.type = data.client
            return
        }

        // 🔥 SITE → GAME
        if (ws.type === "site") {
            wss.clients.forEach(client => {
                if (client !== ws &&
                    client.readyState === WebSocket.OPEN &&
                    client.type === "game") {

                    client.send(JSON.stringify(data))
                }
            })
        }

        // 🔥 GAME → SITE (players)
        if (ws.type === "game" && data.type === "players") {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN &&
                    client.type === "site") {

                    client.send(JSON.stringify(data))
                }
            })
        }
    })
})
