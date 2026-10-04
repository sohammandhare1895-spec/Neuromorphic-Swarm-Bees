export type SpectrumMode = "RGB" | "UV";

export type NodeStatus =
    | "ONLINE"
    | "SEARCHING"
    | "TARGET_LOCK"
    | "POLLINATING"
    | "RETURNING"
    | "LOW_BATTERY";

export type LogLevel =
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";

export interface Coordinates {
    x: number;
    y: number;
    z: number;
}

export interface FlightVector {
    dx: number;
    dy: number;
    dz: number;
}

export interface BeeNode {
    id: string;
    name: string;
    battery: number;
    altitude: number;
    contactForce: number;
    latency: number;
    targetCoords: Coordinates;
    velocity: FlightVector;
    spectrumMode: SpectrumMode;
    status: NodeStatus;
    currentTarget: string | null;
    pollinationCount: number;
}

export interface SpectralTarget {
    flowerId: string;
    x: number;
    y: number;
    uvSignatureScore: number;
    nectarDensity: number;
    pollenDensity: number;
    pollenStatus: "AVAILABLE" | "COLLECTED" | "DEPLETED";
    targetType: "STIGMA" | "ANTHER" | "NECTAR";
    locked: boolean;
}

export interface TelemetrySnapshot {
    timestamp: number;
    meshLatency: number;
    activeNodes: number;
    flowersPollinated: number;
    averageForce: number;
    nodes: BeeNode[];
}

export interface MeshLog {
    timestamp: number;
    level: LogLevel;
    message: string;
    nodeId?: string;
    targetId?: string;
}

export interface DetectionBox {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    label: string;
}

export interface CameraFeed {
    id: string;
    nodeId: string;
    cameraNumber: number;
    orientation: "FRONT" | "SIDE" | "REAR";
    spectrumMode: SpectrumMode;
    detections: DetectionBox[];
    signalStrength: number;
}

export interface MissionState {
    running: boolean;
    visionMode: SpectrumMode;
    flowersPollinated: number;
    activeTarget: string | null;
    meshLatency: number;
    missionStartTime: number;
}
