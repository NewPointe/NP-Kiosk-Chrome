export function groupBy<T, TKey extends keyof T>(items: T[], key: TKey) {
    return items.reduce(
        (groupMap, item) => {
            const group = groupMap.get(item[key]);
            if (group) group.push(item);
            else groupMap.set(item[key], [item]);
            return groupMap;
        },
        new Map<T[TKey], T[]>()
    );
};

export function checkOrigin(sourceUrl: string, targetUrl: string): boolean {
    try {
        return getOrigin(sourceUrl) === getOrigin(targetUrl);
    }
    catch (e) {
        return false;
    }
}

const hex = Array(256).fill(0).map((_, i) => i.toString(16).padStart(2, '0'));

function formatGuid(bytes: Uint8Array) {
    return hex[bytes[0]]  + hex[bytes[1]]  + hex[bytes[2]]  + hex[bytes[3]]  + '-' +
           hex[bytes[4]]  + hex[bytes[5]]  + '-' +
           hex[bytes[6]]  + hex[bytes[7]]  + '-' +
           hex[bytes[8]]  + hex[bytes[9]]  + '-' +
           hex[bytes[10]] + hex[bytes[11]] + hex[bytes[12]] + hex[bytes[13]] + hex[bytes[14]] + hex[bytes[15]];
}

function getGuidBytes() {
    const d = new Uint8Array(16);
    window.crypto.getRandomValues(d);
    d[6] = d[6] | 0x40;
    d[8] = d[8] | 0x80;
    return d
}

export function generateGuid() {
    return formatGuid(getGuidBytes());
}

/**
 * Regex for a port number (integer in the range 1-65535)
 */
const PORT_REGEX = "([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])"

/**
 * Regex for an IP address octet (integer in the range 0-255)
 */
const IP_OCTET_REGEX = "([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";

/**
 * Regex for an IP address with optional port (`[0-255].[0-255].[0-255].[0-255]:[1-65535]`)
 */
export const IP_PORT_REGEX = `^${IP_OCTET_REGEX}\\\.${IP_OCTET_REGEX}\\\.${IP_OCTET_REGEX}\\\.${IP_OCTET_REGEX}(:${PORT_REGEX})?$`;


const trueStrings = ["t", "true", "y", "yes", "on", "checked", "enabled", "1"];
const falseStrings = ["f", "false", "n", "no", "off", "unchecked", "disabled", "0"];
export function str2bool<T extends boolean | null>(value: string, defaultValue: T): boolean | T {
    const lowerVal = value.toLowerCase();
    if(trueStrings.some(x => x === lowerVal)) return true;
    if(falseStrings.some(x => x === lowerVal)) return false;
    return defaultValue;
}

export function str2num<T extends number | null>(value: string, defaultValue: T): T | number {
    try {
        const asNumber = Number.parseFloat(value);
        if(Number.isFinite(asNumber) && !Number.isNaN(asNumber)) return asNumber;
    }
    finally {
        return defaultValue;
    }
}

export function ensureUrlProtocol(url: string): string {
    return url.includes("://") ? url : `https://${url}`;
}

export function removeHttps(url: string): string {
    return url.startsWith("https://") ? url.replace("https://", "") : url;
}

export function getOrigin(url: string): string {
    return new URL(url).origin;
}
