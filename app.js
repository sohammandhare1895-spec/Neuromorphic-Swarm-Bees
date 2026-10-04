import data from "./mockData.js";
import { TelemetryEngine } from "./telemetryEngine.js";
import { CompoundEyeEngine } from "./compoundEyeEngine.js";


const {
    nodes,
    floralTargets,
    initialLogs
} = data;


/* -------------------------------------------------------
   GLOBAL STATE
------------------------------------------------------- */

const state = {
    visionMode: "RGB",
    flowersPollinated: 127,
    logs: [...initialLogs],
    cameras: [],
    telemetry: null
};


/* -------------------------------------------------------
   DOM HELPERS
------------------------------------------------------- */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* -------------------------------------------------------
   CLOCK
------------------------------------------------------- */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );

    const date =
        now.toLocaleDateString(
            "en-IN"
        );

    const clock =
        $("#systemClock");

    const dateElement =
        $("#systemDate");

    if (clock) {
        clock.textContent = time;
    }

    if (dateElement) {
        dateElement.textContent = date;
    }

    for (let i = 1; i <= 6; i++) {

        const cameraTime =
            $(`#camTime${i}`);

        if (cameraTime) {
            cameraTime.textContent = time;
        }
    }
}


setInterval(
    updateClock,
    1000
);

updateClock();


/* -------------------------------------------------------
   COMPOUND EYE CAMERAS
------------------------------------------------------- */

function initializeCameras() {

    const canvases =
        $$(".bee-camera");

    state.cameras = [];

    canvases.forEach(
        canvas => {

            const cameraId =
                Number(
                    canvas.dataset.camera
                );

            const engine =
                new CompoundEyeEngine(
                    canvas,
                    {
                        cameraId
                    }
                );

            engine.setMode(
                state.visionMode
            );

            state.cameras.push(
                engine
            );
        }
    );
}


initializeCameras();


/* -------------------------------------------------------
   VISION MODE
------------------------------------------------------- */

function setVisionMode(mode) {

    state.visionMode = mode;

    document.body.classList.toggle(
        "uv-mode",
        mode === "UV"
    );

    $$(".vision-btn").forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );
        }
    );

    state.cameras.forEach(
        camera =>
            camera.setMode(mode)
    );

    addLog(
        "INFO",
        `Compound vision switched to ${mode} spectral mode.`
    );
}


$("#rgbButton")
    ?.addEventListener(
        "click",
        () => setVisionMode("RGB")
    );

$("#uvButton")
    ?.addEventListener(
        "click",
        () => setVisionMode("UV")
    );


/* -------------------------------------------------------
   TERMINAL
------------------------------------------------------- */

function addLog(
    level,
    message
) {

    const item = {
        timestamp: Date.now(),
        level,
        message
    };

    state.logs.push(item);

    if (state.logs.length > 80) {
        state.logs.shift();
    }

    renderTerminal();
}


function renderTerminal() {

    const terminal =
        $("#missionTerminal");

    if (!terminal) {
        return;
    }

    terminal.innerHTML =
        state.logs
            .map(log => {

                const date =
                    new Date(
                        log.timestamp
                    );

                const time =
                    date.toLocaleTimeString(
                        "en-IN",
                        {
                            hour12: false
                        }
                    );

                const levelClass =
                    `log-${String(
                        log.level
                    ).toLowerCase()}`;

                return `
                    <div class="log-line">
                        <span class="log-time">[${time}]</span>
                        <span class="${levelClass}">
                            [${log.level}]
                        </span>
                        <span class="log-message">
                            ${escapeHTML(log.message)}
                        </span>
                    </div>
                `;
            })
            .join("");

    terminal.scrollTop =
        terminal.scrollHeight;
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


renderTerminal();


/* -------------------------------------------------------
   TELEMETRY ENGINE
------------------------------------------------------- */

function initializeTelemetry() {

    const engine =
        new TelemetryEngine(
            nodes,
            floralTargets
        );

    state.telemetry =
        engine;

    engine.on(
        "telemetry",
        snapshot =>
            updateTelemetry(snapshot)
    );

    engine.on(
        "pollination",
        event =>
            handlePollination(event)
    );

    engine.on(
        "log",
        event =>
            addLog(
                event.level,
                event.message
            )
    );

    engine.start();

    addLog(
        "SUCCESS",
        "Telemetry engine online. Autonomous swarm control active."
    );
}


initializeTelemetry();


/* -------------------------------------------------------
   TELEMETRY UI
------------------------------------------------------- */

function updateTelemetry(snapshot) {

    $("#meshLatency").textContent =
        snapshot.meshLatency.toFixed(0);

    $("#activeNodes").textContent =
        `${String(snapshot.activeNodes).padStart(2, "0")} / 03`;

    $("#pollinatedCount").textContent =
        snapshot.flowersPollinated;

    const nodes =
        snapshot.nodes;

    nodes.forEach(
        (node, index) => {

            const cameraNumber =
                index + 1;

            const battery =
                node.battery;

            const batteryElement =
                $(`#bat${cameraNumber}`);

            const altitudeElement =
                $(`#alt${cameraNumber}`);

            const forceElement =
                $(`#force${cameraNumber}`);

            if (batteryElement) {
                batteryElement.textContent =
                    battery.toFixed(0);
            }

            if (altitudeElement) {
                altitudeElement.textContent =
                    node.altitude.toFixed(1);
            }

            if (forceElement) {
                forceElement.textContent =
                    node.contactForce.toFixed(1);
            }

            updateBatteryBar(
                index + 1,
                battery
            );
        }
    );

    updateForce(
        snapshot.averageForce
    );

    updateMap(
        nodes
    );

    updateCoordinates(
        nodes[0]
    );
}


function updateBatteryBar(
    index,
    battery
) {

    const bar =
        $(`#beeBattery${index}`);

    const text =
        $(`#beeBatteryText${index}`);

    if (!bar || !text) {
        return;
    }

    bar.style.width =
        `${battery}%`;

    text.textContent =
        `${battery.toFixed(0)}%`;
}


function updateForce(force) {

    const display =
        $("#mainForce");

    const status =
        $("#forceStatus");

    const needle =
        $("#forceNeedle");

    if (display) {
        display.textContent =
            force.toFixed(1);
    }

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                force * 10
            )
        );

    if (needle) {
        needle.style.left =
            `${percentage}%`;
    }

    if (status) {

        if (force >= 5) {

            status.textContent =
                "ALERT";

            status.style.color =
                "#ef4444";

            status.style.borderColor =
                "rgba(239,68,68,0.4)";

        } else {

            status.textContent =
                "SAFE";

            status.style.color =
                "#a3e635";

            status.style.borderColor =
                "rgba(132,204,22,0.3)";
        }
    }
}


function updateCoordinates(node) {

    if (!node) {
        return;
    }

    $("#mapX").textContent =
        node.targetCoords.x.toFixed(1);

    $("#mapY").textContent =
        node.targetCoords.y.toFixed(1);

    $("#mapZ").textContent =
        node.targetCoords.z.toFixed(1);
}


/* -------------------------------------------------------
   POLLINATION EVENT
------------------------------------------------------- */

function handlePollination(event) {

    state.flowersPollinated =
        event.total;

    $("#pollinatedCount").textContent =
        event.total;

    addLog(
        "SUCCESS",
        `${event.node.id} confirmed pollination at ${event.target.flowerId} / ${event.target.targetType}.`
    );
}


/* -------------------------------------------------------
   NAVIGATION MAP
------------------------------------------------------- */

const mapCanvas =
    $("#navigationCanvas");

const mapCtx =
    mapCanvas.getContext("2d");

let mapWidth = 0;
let mapHeight = 0;

function resizeMap() {

    const rect =
        mapCanvas.getBoundingClientRect();

    const ratio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    mapWidth =
        rect.width;

    mapHeight =
        rect.height;

    mapCanvas.width =
        rect.width * ratio;

    mapCanvas.height =
        rect.height * ratio;

    mapCtx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resizeMap
);

resizeMap();


function drawHexGrid() {

    const ctx = mapCtx;

    const radius = 19;

    const xStep =
        Math.sqrt(3) * radius;

    const yStep =
        radius * 1.5;

    ctx.strokeStyle =
        "rgba(245,158,11,0.09)";

    ctx.lineWidth = 0.7;

    let row = 0;

    for (
        let y = -radius;
        y < mapHeight + radius;
        y += yStep
    ) {

        const offset =
            row % 2
                ? xStep / 2
                : 0;

        for (
            let x = -xStep;
            x < mapWidth + xStep;
            x += xStep
        ) {

            drawHex(
                ctx,
                x + offset,
                y,
                radius
            );
        }

        row++;
    }
}


function drawHex(
    ctx,
    x,
    y,
    radius
) {

    ctx.beginPath();

    for (let i = 0; i < 6; i++) {

        const angle =
            Math.PI / 3 * i +
            Math.PI / 6;

        const px =
            x +
            Math.cos(angle) *
            radius;

        const py =
            y +
            Math.sin(angle) *
            radius;

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.closePath();

    ctx.stroke();
}


function drawTargets() {

    const ctx = mapCtx;

    floralTargets.forEach(
        target => {

            const x =
                target.x /
                300 *
                mapWidth;

            const y =
                target.y /
                240 *
                mapHeight;

            const pulse =
                3 +
                Math.sin(
                    Date.now() * 0.004 +
                    target.x
                ) * 1.5;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                pulse,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                target.locked
                    ? "#eab308"
                    : "#8b5cf6";

            ctx.shadowColor =
                target.locked
                    ? "#eab308"
                    : "#8b5cf6";

            ctx.shadowBlur = 12;

            ctx.fill();

            ctx.shadowBlur = 0;

            if (target.locked) {

                ctx.strokeStyle =
                    "rgba(234,179,8,0.45)";

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    9,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();
            }
        }
    );
}


function drawBee(
    node,
    index
) {

    const ctx = mapCtx;

    const x =
        node.targetCoords.x /
        300 *
        mapWidth;

    const y =
        node.targetCoords.y /
        240 *
        mapHeight;

    const color =
        index === 0
            ? "#f59e0b"
            : index === 1
                ? "#22d3ee"
                : "#84cc16";

    ctx.save();

    ctx.translate(x, y);

    const angle =
        Math.atan2(
            node.velocity.dy,
            node.velocity.dx
        );

    ctx.rotate(angle);

    ctx.fillStyle =
        color;

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 15;

    ctx.beginPath();

    ctx.moveTo(9, 0);
    ctx.lineTo(-7, -5);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-7, 5);
    ctx.closePath();

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle =
        "rgba(255,255,255,0.5)";

    ctx.stroke();

    ctx.restore();

    ctx.fillStyle =
        color;

    ctx.font =
        "7px JetBrains Mono";

    ctx.fillText(
        node.id,
        x + 8,
        y - 8
    );
}


function updateMap(
    currentNodes
) {

    mapCtx.clearRect(
        0,
        0,
        mapWidth,
        mapHeight
    );

    drawHexGrid();

    drawTargets();

    currentNodes.forEach(
        (node, index) =>
            drawBee(
                node,
                index
            )
    );
}


function animateMap() {

    if (
        state.telemetry
    ) {

        updateMap(
            state.telemetry.getNodes()
        );
    }

    requestAnimationFrame(
        animateMap
    );
}


animateMap();


/* -------------------------------------------------------
   INITIAL MISSION LOG
------------------------------------------------------- */

addLog(
    "INFO",
    "Ommatidial compound-eye optical architecture initialized."
);

addLog(
    "INFO",
    "Six CCTV perspective streams awaiting synchronized telemetry."
);

addLog(
    "SUCCESS",
    "YOLOv8 floral target detector online."
);

addLog(
    "INFO",
    "UV nectar-guide calibration matrix loaded."
);


/* -------------------------------------------------------
   CAMERA SIGNAL EFFECT
------------------------------------------------------- */

setInterval(
    () => {

        const cameras =
            $$(".camera-card");

        cameras.forEach(
            card => {

                if (
                    Math.random() >
                    0.94
                ) {

                    card.style.filter =
                        "brightness(1.35)";

                    setTimeout(
                        () => {
                            card.style.filter =
                                "";
                        },
                        80
                    );
                }
            }
        );

    },
    700
);


/* -------------------------------------------------------
   PERIODIC AI EVENTS
------------------------------------------------------- */

const aiEvents = [
    "YOLOv8 detected high-confidence stigma geometry.",
    "UV reflection signature exceeds target threshold.",
    "Neuromorphic motion vector stabilized.",
    "Mesh route optimized for minimum latency.",
    "Pollen density estimate updated.",
    "Electrostatic contact actuator calibrated.",
    "Flower trajectory prediction refreshed.",
    "Bee-to-bee collision avoidance vector updated."
];


setInterval(
    () => {

        const event =
            aiEvents[
                Math.floor(
                    Math.random() *
                    aiEvents.length
                )
            ];

        addLog(
            "INFO",
            event
        );

    },
    4200
);
