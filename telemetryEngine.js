export class TelemetryEngine {

    constructor(nodes, targets) {

        this.nodes = structuredClone(nodes);
        this.targets = structuredClone(targets);

        this.flowersPollinated = 127;

        this.listeners = {
            telemetry: [],
            pollination: [],
            log: []
        };

        this.running = false;

        this.lastPollination = 0;

        this.interval = null;
    }


    on(event, callback) {

        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].push(callback);
    }


    emit(event, payload) {

        if (!this.listeners[event]) {
            return;
        }

        for (const callback of this.listeners[event]) {
            callback(payload);
        }
    }


    start() {

        if (this.running) {
            return;
        }

        this.running = true;

        this.interval = setInterval(
            () => this.update(),
            650
        );
    }


    stop() {

        this.running = false;

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = null;
    }


    update() {

        for (const node of this.nodes) {

            this.updateNode(node);
        }

        this.emitTelemetry();

        this.simulatePollination();
    }


    updateNode(node) {

        const batteryDrain =
            0.003 +
            Math.random() * 0.006;

        node.battery = Math.max(
            5,
            node.battery - batteryDrain
        );

        node.latency =
            Math.max(
                3,
                Math.min(
                    12,
                    node.latency +
                    (Math.random() - 0.5) * 2
                )
            );

        node.altitude +=
            node.velocity.dz +
            (Math.random() - 0.5) * 0.8;

        node.altitude =
            Math.max(
                8,
                Math.min(
                    55,
                    node.altitude
                )
            );

        node.targetCoords.x +=
            node.velocity.dx +
            (Math.random() - 0.5) * 1.2;

        node.targetCoords.y +=
            node.velocity.dy +
            (Math.random() - 0.5) * 1.2;

        node.targetCoords.x =
            this.wrap(
                node.targetCoords.x,
                20,
                285
            );

        node.targetCoords.y =
            this.wrap(
                node.targetCoords.y,
                20,
                225
            );

        node.contactForce =
            Math.max(
                0.4,
                Math.min(
                    7.5,
                    node.contactForce +
                    (Math.random() - 0.5) * 0.8
                )
            );

        if (node.contactForce > 5) {

            node.status = "SEARCHING";

            this.emit("log", {
                level: "WARNING",
                message:
                    `${node.id} contact force ${node.contactForce.toFixed(1)}mN — reducing actuator pressure.`
            });

        } else if (
            node.currentTarget &&
            node.contactForce > 1
        ) {

            node.status = "TARGET_LOCK";

        } else {

            node.status = "SEARCHING";
        }

        if (node.battery < 20) {

            node.status = "LOW_BATTERY";

            this.emit("log", {
                level: "WARNING",
                message:
                    `${node.id} battery below reserve threshold.`
            });
        }
    }


    simulatePollination() {

        const now = Date.now();

        if (now - this.lastPollination < 7000) {
            return;
        }

        const candidates =
            this.nodes.filter(
                node =>
                    node.contactForce >= 1 &&
                    node.contactForce < 4.7 &&
                    node.currentTarget
            );

        if (!candidates.length) {
            return;
        }

        if (Math.random() > 0.32) {
            return;
        }

        const node =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
            ];

        const target =
            this.targets.find(
                flower =>
                    flower.flowerId ===
                    node.currentTarget
            );

        if (!target) {
            return;
        }

        target.pollenStatus = "COLLECTED";

        this.flowersPollinated += 1;

        this.lastPollination = now;

        node.pollinationCount += 1;

        node.status = "POLLINATING";

        this.emit(
            "pollination",
            {
                node,
                target,
                total: this.flowersPollinated
            }
        );
    }


    emitTelemetry() {

        const totalLatency =
            this.nodes.reduce(
                (sum, node) =>
                    sum + node.latency,
                0
            );

        const averageForce =
            this.nodes.reduce(
                (sum, node) =>
                    sum + node.contactForce,
                0
            ) / this.nodes.length;

        this.emit(
            "telemetry",
            {
                timestamp: Date.now(),
                meshLatency:
                    totalLatency /
                    this.nodes.length,
                activeNodes:
                    this.nodes.filter(
                        node =>
                            node.battery > 10
                    ).length,
                flowersPollinated:
                    this.flowersPollinated,
                averageForce,
                nodes: this.nodes
            }
        );
    }


    wrap(value, min, max) {

        if (value < min) {
            return max;
        }

        if (value > max) {
            return min;
        }

        return value;
    }


    getNodes() {

        return this.nodes;
    }
}
