
export class TcpSocket {

    private socketId: number | null;

    constructor(socketId: number) {
        this.socketId = socketId;
    }

    static async create(): Promise<TcpSocket> {
        return new Promise((resolve) => chrome.sockets.tcp.create({}, createInfo => resolve(new TcpSocket(createInfo.socketId))));
    }

    async connect(ip: string, port: number): Promise<number> {
        return new Promise((resolve, reject) => {
            if(this.socketId === null) reject(new Error("Socket does not exist or has already been destroyed."));
            else chrome.sockets.tcp.connect(this.socketId, ip, port, result => {
                if(result < 0) reject(new Error(`Connection error: ${result}`));
                else resolve(result);
            });
        });
    }

    async writeString(value: string) {
        const binaryData = new TextEncoder().encode(value).buffer;
        return this.writeBytes(binaryData);
    }

    async writeBytes(bytes: ArrayBuffer) {
        return new Promise((resolve, reject) => {
            if(this.socketId === null) reject(new Error("Socket does not exist or has already been destroyed."));
            else chrome.sockets.tcp.send(this.socketId, bytes, sendInfo => {
                if(sendInfo.resultCode < 0) reject(new Error(`Send error: ${sendInfo.resultCode}`));
                else resolve(sendInfo);
            });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            if(this.socketId === null) reject(new Error("Socket does not exist or has already been destroyed."));
            else chrome.sockets.tcp.disconnect(this.socketId, resolve);
        });
    }

    async destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.socketId === null) reject(new Error("Socket does not exist or has already been destroyed."));
            else chrome.sockets.tcp.close(this.socketId, resolve);
        });
    }

}
