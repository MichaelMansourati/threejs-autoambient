import * as THREE from "three"
import osc from "osc"
import "./main.css"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200)
const renderer = new THREE.WebGLRenderer({antialias: true})

camera.position.z = 5

renderer.setClearColor("#191970")
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

const apothemRatio = Math.sqrt(3)/2
const drawHexRect = (hexIndex, sideLength) => {
    const geometry = new THREE.PlaneGeometry( sideLength/apothemRatio, 0.1 )
    const material = new THREE.MeshLambertMaterial( {color: 0x00ff00, side: THREE.DoubleSide} )
    const rect = new THREE.Mesh(geometry, material)
    rect.translateOnAxis(new THREE.Vector3(1, 0, 0), 0)
    rect.rotation.y = hexIndex/3 * (Math.PI)
    rect.translateOnAxis(new THREE.Vector3(0, 0, 1), -sideLength)
    return rect
}

const hexRects = []
const hexCount = 21
let heightAccumulator = 0
for (let hexIndex = 0; hexIndex < 6; hexIndex++) {
    for (let heightIndex = 0; heightIndex < hexCount; heightIndex++) {
        const sideLength = (Math.floor(heightIndex/2) * 0.12) + 0.1;
        const rect = drawHexRect(hexIndex, sideLength)
        const polarity = (heightIndex % 2) * 2 - 1;
        if (heightIndex === 0) {
            heightAccumulator = 0
        }
        heightAccumulator += heightIndex * polarity
        rect.translateOnAxis(
            new THREE.Vector3(0,1,0),
            Math.floor(hexCount/2 - heightIndex/2)/4 * polarity
        )
        rect.heightLevel = Math.floor(hexCount/2 - heightIndex/2)/4 * polarity
        hexRects.push(rect)
        scene.add(rect)
    }
}

const rotationSpeed = 1/300
const rendering = function() {
    const frameNum = renderer.info.render.frame
    requestAnimationFrame(rendering)
    hexRects.forEach(rect => {
        const twist = Math.sin(frameNum/50 + (rect.heightLevel/3))*10
        rect.translateOnAxis(new THREE.Vector3(1, 0, 0), -rotationSpeed*rect.geometry.parameters.width*apothemRatio)
        rect.rotateOnAxis(new THREE.Vector3(0,1,0), rotationSpeed)
        rect.translateOnAxis(
            new THREE.Vector3(0,1,0),
            Math.sin((frameNum + -rect.heightLevel*20)/30)/300
        )
    })
    renderer.render(scene, camera)
}

const light = new THREE.PointLight(0xFFFFFF, 1, 100)
light.position.set(5, 5, 5)
scene.add(light)

rendering()

try {
    let ws;
    try {
    ws = new WebSocket("ws://localhost:8081");
    } catch (e) {
        console.error({e})
    }

    let oscPort;
    const createWebsocketPort = function () {
        oscPort = new osc.WebSocketPort({
            url: "ws://localhost:8081",
            socket: ws,
            metadata: true
        })
        oscPort.open()
        oscPort.on("error", (e) => {
            console.error({e})
        })
        oscPort.socket.onmessage = (e) => { console.log(JSON.parse(e.data)) }
        oscPort.on("ready", () => {
            console.log("oscport ready")
        })
    }

    ws.addEventListener('open', () => {
        console.log("ws opened")
        createWebsocketPort()
    })
} catch (e) {
    console.error(e)
}


/*
superCollider code to ping this app:
(
b = NetAddr.new("localhost", 8081);

t = Task({ { b.sendMsg("/message", "where"); "osced".postln; 1.wait;}.loop });
t.start;
)
 */