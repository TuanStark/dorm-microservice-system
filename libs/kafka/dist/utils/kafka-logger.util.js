"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEnvelopeForLog = void 0;
const formatEnvelopeForLog = (envelope) => {
    try {
        return {
            eventId: envelope.eventId,
            eventName: envelope.eventName,
            source: envelope.source,
            occurredAt: envelope.occurredAt,
            payloadSummary: (() => {
                if (!envelope.payload)
                    return null;
                if (typeof envelope.payload === 'object') {
                    const keys = Object.keys(envelope.payload);
                    return { keys, size: JSON.stringify(envelope.payload).length };
                }
                return { type: typeof envelope.payload, length: String(envelope.payload).length };
            })()
        };
    }
    catch (err) {
        return { note: 'format error' };
    }
};
exports.formatEnvelopeForLog = formatEnvelopeForLog;
//# sourceMappingURL=kafka-logger.util.js.map