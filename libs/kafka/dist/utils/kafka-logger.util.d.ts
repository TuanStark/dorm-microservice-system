export declare const formatEnvelopeForLog: (envelope: any) => {
    eventId: any;
    eventName: any;
    source: any;
    occurredAt: any;
    payloadSummary: {
        keys: string[];
        size: number;
        type?: undefined;
        length?: undefined;
    } | {
        type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        length: number;
        keys?: undefined;
        size?: undefined;
    } | null;
    note?: undefined;
} | {
    note: string;
    eventId?: undefined;
    eventName?: undefined;
    source?: undefined;
    occurredAt?: undefined;
    payloadSummary?: undefined;
};
