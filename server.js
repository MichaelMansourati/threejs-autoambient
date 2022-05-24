const osc = require("osc");
const path = require('path')
const { WebSocketServer } = require("ws")

const express = require('express')
const app = express();

const http = require('http')
const server = http.createServer(app);

const { Server } = require('socket.io')
const io = new Server(server)

const port = 8080;
const wsPort = 8081

app.use("/", express.static("dist"))

const wss = new WebSocketServer({ port: wsPort });

wss.on('connection', function connection(ws) {
    let udpPort;
    console.log("creating websocket");
    udpPort = new osc.UDPPort({
        localAddress: "localhost",
        localPort: wsPort,
        metadata: true
    })
    udpPort.on("message", (msg) => {
        console.log("message to udp:",  msg)
        ws.send(JSON.stringify(msg))
    })
    udpPort.open()
});

io.listen(8082)


// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});


server.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
});