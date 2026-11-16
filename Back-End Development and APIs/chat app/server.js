import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import path from 'path';

const PORT = 3001;

const contentTypes = {
    "/index.html": "text/html",
    "/script.js": "text/javascript"
}

const server = http.createServer(async (req, res) => {
    const url = req.url === "/" ? "/index.html" : req.url;
    if(!(url in contentTypes)) {
        res.statusCode = 404;
        res.end();
    }
    const data = await fs.promises.readFile(path.join(import.meta.dirname, "public", url));
    res
    .writeHead(200, {"Content-Type": contentTypes[url]})
    .end(data);
});

const wss = new WebSocketServer({ server });

function broadcast(data) {
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(data));
    });
}

wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username");
    broadcast({type: "system", text: `${username} joined`});

    socket.on("message", message => {
        const { username, text } = JSON.parse(message);
        broadcast({type: "chat", username, text});
    });

    socket.on("close", () => {
        broadcast({type: "system", text: `${username} left`});
    });
});

server.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}.`);
})

const shutdownSignals = ["SIGTERM", "SIGINT"];
shutdownSignals.forEach((signal) => {
    process.on(signal, (s) => {
        broadcast({type: "system", text: "Server shut down"});
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN)
                client.close();
        });
        server.close(() => console.log(`Server shut down due to ${s} event.`));
    });
});
