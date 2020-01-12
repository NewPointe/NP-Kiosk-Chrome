
/**
 * Builds a Zabbix packet for string data.
 * @param data The string data.
 */
export function buildPacket(data: string): ArrayBuffer {

    // Encode the string data (UTF-8)
    const binaryData = new TextEncoder().encode(data).buffer;

    // Build the header
    const headerData = buildPacketHeader(HeaderFlag.ZABBIX_PROTOCOL, binaryData.byteLength);

    // Allocate a buffer for the packet
    var packet = new Uint8Array(headerData.byteLength + binaryData.byteLength);

    // Append the header
    packet.set(new Uint8Array(headerData), 0);

    // Append the data
    packet.set(new Uint8Array(binaryData), headerData.byteLength);

    // Return the buffer
    return packet.buffer;
}

/**
 * Flags that can be set inside a Zabbix header
 */
export enum HeaderFlag {
    ZABBIX_PROTOCOL = 0x01,
    COMPRESSION = 0x02
}

/**
 * Builds a header for the Zabbix protocol.
 * @param flags The protocol flags.
 * @param dataSize The size of the data to send.
 * @param uncompressedSize The size of the data before compression (if compressed).
 */
export function buildPacketHeader(flags: HeaderFlag, dataSize: number, uncompressedSize: number = 0): ArrayBuffer {

    // Allocate a buffer for our header
    const headerData = new DataView(new ArrayBuffer(13));

    // <PROTOCOL> - "ZBXD" (4 bytes).
    headerData.setUint8(0, "Z".charCodeAt(0));
    headerData.setUint8(1, "B".charCodeAt(0));
    headerData.setUint8(2, "X".charCodeAt(0));
    headerData.setUint8(3, "D".charCodeAt(0));

    // <FLAGS> - the protocol flags, (1 byte).
    headerData.setUint8(4, flags);

    // <DATALEN> - data length (4 bytes). 1 will be formatted as 01/00/00/00 (four bytes, 32 bit number in little-endian format).
    headerData.setUint32(5, dataSize, true);

    // <RESERVED> - reserved for protocol extensions (4 bytes).
    // When compression is enabled (0x02 flag) the <RESERVED> bytes contains uncompressed data size, 32 bit number in little-endian format.
    headerData.setUint32(9, uncompressedSize);

    // Return the buffer
    return headerData.buffer;

}
