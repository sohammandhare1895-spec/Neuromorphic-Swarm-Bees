export class CompoundEyeEngine {

    constructor(canvas, options = {}) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.cameraId = options.cameraId || 1;

        this.mode = "RGB";

        this.width = 0;
        this.height = 0;

        this.time = Math.random() * 100;

        this.particles = [];
        this.flowers = [];

        this.resize();

        this.createParticles();
        this.createFlowers();

        window.addEventListener("resize", () => this.resize());

        this.animate();
    }


    resize() {

        const rect = this.canvas.getBoundingClientRect();

        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = Math.max(1, rect.width * ratio);
        this.canvas.height = Math.max(1, rect.height * ratio);

        this.ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );
    }


    setMode(mode) {

        this.mode = mode;
    }


    createParticles() {

        this.particles = [];

        for (let i = 0; i < 42; i++) {

            this.particles.push({
                x: Math.random(),
                y: Math.random(),
                speed: 0.0005 + Math.random() * 0.002,
                size: 0.5 + Math.random() * 1.5
            });
        }
    }


    createFlowers() {

        this.flowers = [
            {
                x: 0.25,
                y: 0.42,
                size: 20,
                intensity: 0.8
            },

            {
                x: 0.62,
                y: 0.30,
                size: 28,
                intensity: 1
            },

            {
                x: 0.77,
                y: 0.67,
                size: 17,
                intensity: 0.65
            },

            {
                x: 0.45,
                y: 0.72,
                size: 23,
                intensity: 0.9
            }
        ];
    }


    drawBackground() {

        const ctx = this.ctx;

        const gradient = ctx.createLinearGradient(
            0,
            0,
            this.width,
            this.height
        );

        if (this.mode === "UV") {

            gradient.addColorStop(0, "#11051f");
            gradient.addColorStop(0.45, "#181044");
            gradient.addColorStop(1, "#030916");

        } else {

            gradient.addColorStop(0, "#0b2114");
            gradient.addColorStop(0.5, "#19351b");
            gradient.addColorStop(1, "#030b08");
        }

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }


    drawVegetation() {

        const ctx = this.ctx;

        ctx.save();

        for (let i = 0; i < 24; i++) {

            const x =
                ((i * 83 + this.cameraId * 41) %
                    (this.width + 100)) - 50;

            const base =
                this.height * 0.82 +
                Math.sin(this.time * 0.003 + i) * 7;

            const height =
                25 + ((i * 17) % 65);

            ctx.strokeStyle =
                this.mode === "UV"
                    ? `rgba(139,92,246,${0.18 + (i % 3) * 0.06})`
                    : `rgba(70,120,60,${0.18 + (i % 3) * 0.07})`;

            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.moveTo(x, base);

            ctx.quadraticCurveTo(
                x - 5,
                base - height / 2,
                x + Math.sin(i) * 10,
                base - height
            );

            ctx.stroke();
        }

        ctx.restore();
    }


    drawFlowers() {

        const ctx = this.ctx;

        for (const flower of this.flowers) {

            const x = flower.x * this.width;
            const y = flower.y * this.height;

            const pulse =
                1 +
                Math.sin(this.time * 0.005 + x) * 0.12;

            const radius =
                flower.size * pulse;

            if (this.mode === "UV") {

                const glow =
                    ctx.createRadialGradient(
                        x,
                        y,
                        0,
                        x,
                        y,
                        radius * 2.8
                    );

                glow.addColorStop(
                    0,
                    "rgba(234,179,8,0.95)"
                );

                glow.addColorStop(
                    0.2,
                    "rgba(139,92,246,0.65)"
                );

                glow.addColorStop(
                    1,
                    "rgba(139,92,246,0)"
                );

                ctx.fillStyle = glow;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    radius * 2.8,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            } else {

                const glow =
                    ctx.createRadialGradient(
                        x,
                        y,
                        0,
                        x,
                        y,
                        radius * 2
                    );

                glow.addColorStop(
                    0,
                    "rgba(245,158,11,0.8)"
                );

                glow.addColorStop(
                    1,
                    "rgba(245,158,11,0)"
                );

                ctx.fillStyle = glow;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    radius * 2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }

            ctx.save();

            ctx.translate(x, y);

            for (let p = 0; p < 6; p++) {

                const angle =
                    (Math.PI * 2 / 6) * p;

                const px =
                    Math.cos(angle) * radius * 0.5;

                const py =
                    Math.sin(angle) * radius * 0.5;

                ctx.fillStyle =
                    this.mode === "UV"
                        ? "rgba(139,92,246,0.65)"
                        : "rgba(245,158,11,0.38)";

                ctx.beginPath();

                ctx.arc(
                    px,
                    py,
                    radius * 0.32,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }

            ctx.fillStyle =
                this.mode === "UV"
                    ? "#eab308"
                    : "#fef3c7";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                radius * 0.2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }


    drawParticles() {

        const ctx = this.ctx;

        for (const particle of this.particles) {

            particle.x += particle.speed;

            if (particle.x > 1.1) {
                particle.x = -0.1;
            }

            const x = particle.x * this.width;
            const y = particle.y * this.height;

            ctx.fillStyle =
                this.mode === "UV"
                    ? "rgba(34,211,238,0.38)"
                    : "rgba(226,232,240,0.15)";

            ctx.fillRect(
                x,
                y,
                particle.size,
                particle.size
            );
        }
    }


    drawOmmatidialGrid() {

        const ctx = this.ctx;

        const radius = 18;

        const horizontal =
            radius * Math.sqrt(3);

        const vertical =
            radius * 1.5;

        ctx.save();

        ctx.lineWidth = 0.45;

        ctx.strokeStyle =
            this.mode === "UV"
                ? "rgba(139,92,246,0.16)"
                : "rgba(245,158,11,0.10)";

        for (
            let row = -1,
            y = -radius;
            y < this.height + radius;
            row++,
            y += vertical
        ) {

            const offset =
                row % 2
                    ? horizontal / 2
                    : 0;

            for (
                let x = offset - horizontal;
                x < this.width + horizontal;
                x += horizontal
            ) {

                this.hexagon(
                    x,
                    y,
                    radius
                );
            }
        }

        ctx.restore();
    }


    hexagon(x, y, radius) {

        const ctx = this.ctx;

        ctx.beginPath();

        for (let i = 0; i < 6; i++) {

            const angle =
                Math.PI / 3 * i +
                Math.PI / 6;

            const px =
                x + Math.cos(angle) * radius;

            const py =
                y + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();
        ctx.stroke();
    }


    drawScanLine() {

        const ctx = this.ctx;

        const scan =
            (this.time * 0.045) %
            (this.height + 60);

        const gradient =
            ctx.createLinearGradient(
                0,
                scan - 30,
                0,
                scan + 30
            );

        gradient.addColorStop(
            0,
            "rgba(34,211,238,0)"
        );

        gradient.addColorStop(
            0.5,
            "rgba(34,211,238,0.13)"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            scan - 30,
            this.width,
            60
        );
    }


    drawPeripheralDistortion() {

        const ctx = this.ctx;

        const gradient =
            ctx.createRadialGradient(
                this.width / 2,
                this.height / 2,
                this.width * 0.15,
                this.width / 2,
                this.height / 2,
                this.width * 0.75
            );

        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            0.65,
            "rgba(0,0,0,0.08)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0.68)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }


    render() {

        this.time += 1;

        this.drawBackground();

        this.drawVegetation();

        this.drawFlowers();

        this.drawParticles();

        this.drawOmmatidialGrid();

        this.drawScanLine();

        this.drawPeripheralDistortion();
    }


    animate() {

        this.render();

        requestAnimationFrame(
            () => this.animate()
        );
    }
}
