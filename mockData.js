export const nodes = [
    {
        id: "BEE-01",
        name: "NECTAR-01",
        battery: 97,
        altitude: 24.8,
        contactForce: 2.4,
        latency: 5,
        targetCoords: {
            x: 142.4,
            y: 87.6,
            z: 24.8
        },
        velocity: {
            dx: 0.42,
            dy: -0.18,
            dz: 0.03
        },
        spectrumMode: "RGB",
        status: "TARGET_LOCK",
        currentTarget: "FLOWER-07",
        pollinationCount: 49
    },

    {
        id: "BEE-02",
        name: "NECTAR-02",
        battery: 89,
        altitude: 18.7,
        contactForce: 1.8,
        latency: 6,
        targetCoords: {
            x: 94.2,
            y: 132.1,
            z: 18.7
        },
        velocity: {
            dx: -0.25,
            dy: 0.36,
            dz: 0.02
        },
        spectrumMode: "RGB",
        status: "POLLINATING",
        currentTarget: "FLOWER-03",
        pollinationCount: 42
    },

    {
        id: "BEE-03",
        name: "NECTAR-03",
        battery: 78,
        altitude: 34.5,
        contactForce: 3.6,
        latency: 7,
        targetCoords: {
            x: 188.8,
            y: 74.3,
            z: 34.5
        },
        velocity: {
            dx: 0.31,
            dy: 0.24,
            dz: -0.02
        },
        spectrumMode: "RGB",
        status: "SEARCHING",
        currentTarget: "FLOWER-21",
        pollinationCount: 36
    }
];


export const floralTargets = [
    {
        flowerId: "FLOWER-01",
        x: 52,
        y: 48,
        uvSignatureScore: 81.2,
        nectarDensity: 65,
        pollenDensity: 73,
        pollenStatus: "AVAILABLE",
        targetType: "NECTAR",
        locked: false
    },

    {
        flowerId: "FLOWER-03",
        x: 94,
        y: 132,
        uvSignatureScore: 98.1,
        nectarDensity: 92,
        pollenDensity: 88,
        pollenStatus: "AVAILABLE",
        targetType: "STIGMA",
        locked: true
    },

    {
        flowerId: "FLOWER-07",
        x: 142,
        y: 88,
        uvSignatureScore: 96.4,
        nectarDensity: 94,
        pollenDensity: 91,
        pollenStatus: "AVAILABLE",
        targetType: "STIGMA",
        locked: true
    },

    {
        flowerId: "FLOWER-09",
        x: 164,
        y: 152,
        uvSignatureScore: 91.7,
        nectarDensity: 85,
        pollenDensity: 69,
        pollenStatus: "AVAILABLE",
        targetType: "NECTAR",
        locked: false
    },

    {
        flowerId: "FLOWER-12",
        x: 76,
        y: 177,
        uvSignatureScore: 94.8,
        nectarDensity: 88,
        pollenDensity: 95,
        pollenStatus: "AVAILABLE",
        targetType: "ANTHER",
        locked: false
    },

    {
        flowerId: "FLOWER-17",
        x: 205,
        y: 116,
        uvSignatureScore: 95.2,
        nectarDensity: 79,
        pollenDensity: 90,
        pollenStatus: "AVAILABLE",
        targetType: "ANTHER",
        locked: false
    },

    {
        flowerId: "FLOWER-21",
        x: 188,
        y: 74,
        uvSignatureScore: 97.6,
        nectarDensity: 93,
        pollenDensity: 94,
        pollenStatus: "AVAILABLE",
        targetType: "STIGMA",
        locked: true
    },

    {
        flowerId: "FLOWER-26",
        x: 232,
        y: 163,
        uvSignatureScore: 87.3,
        nectarDensity: 73,
        pollenDensity: 81,
        pollenStatus: "AVAILABLE",
        targetType: "NECTAR",
        locked: false
    },

    {
        flowerId: "FLOWER-31",
        x: 121,
        y: 214,
        uvSignatureScore: 90.5,
        nectarDensity: 84,
        pollenDensity: 77,
        pollenStatus: "AVAILABLE",
        targetType: "STIGMA",
        locked: false
    },

    {
        flowerId: "FLOWER-36",
        x: 269,
        y: 92,
        uvSignatureScore: 83.8,
        nectarDensity: 67,
        pollenDensity: 74,
        pollenStatus: "AVAILABLE",
        targetType: "ANTHER",
        locked: false
    }
];


export const initialLogs = [
    {
        timestamp: Date.now() - 15000,
        level: "INFO",
        message: "ESP-NOW mesh initialized / 3 nodes discovered."
    },

    {
        timestamp: Date.now() - 13000,
        level: "SUCCESS",
        message: "BEE-01 acquired FLOWER-07 UV signature."
    },

    {
        timestamp: Date.now() - 11000,
        level: "INFO",
        message: "YOLOv8 inference complete / stigma confidence 96.4%."
    },

    {
        timestamp: Date.now() - 9000,
        level: "SUCCESS",
        message: "BEE-02 pollination contact confirmed at 1.8 mN."
    },

    {
        timestamp: Date.now() - 7000,
        level: "INFO",
        message: "Neuromorphic motion vector recalculated."
    },

    {
        timestamp: Date.now() - 5000,
        level: "INFO",
        message: "UV nectar guide reflection detected."
    },

    {
        timestamp: Date.now() - 3000,
        level: "SUCCESS",
        message: "FLOWER-21 target lock transferred to BEE-03."
    }
];


export const cameraFeeds = [
    {
        id: "CAM-01",
        nodeId: "BEE-01",
        cameraNumber: 1,
        orientation: "FRONT"
    },

    {
        id: "CAM-02",
        nodeId: "BEE-01",
        cameraNumber: 2,
        orientation: "SIDE"
    },

    {
        id: "CAM-03",
        nodeId: "BEE-02",
        cameraNumber: 3,
        orientation: "FRONT"
    },

    {
        id: "CAM-04",
        nodeId: "BEE-02",
        cameraNumber: 4,
        orientation: "REAR"
    },

    {
        id: "CAM-05",
        nodeId: "BEE-03",
        cameraNumber: 5,
        orientation: "FRONT"
    },

    {
        id: "CAM-06",
        nodeId: "BEE-03",
        cameraNumber: 6,
        orientation: "SIDE"
    }
];


export default {
    nodes,
    floralTargets,
    initialLogs,
    cameraFeeds
};
