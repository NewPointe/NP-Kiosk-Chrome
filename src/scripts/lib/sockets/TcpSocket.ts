import { SimpleEventEmiter } from "../SimpleEventEmitter";
import { TcpError } from "./TcpError";

export interface SocketEvent {
    socket: TcpSocket;
}

export interface SocketDataEvent extends SocketEvent {
    data: ArrayBuffer;
}

export interface SocketErrorEvent extends SocketEvent {
    error: TcpError;
}

export interface SocketCloseEvent {
    socketId: number;
}

type TcpSocketEventMap = {
    "receive": SocketDataEvent,
    "receiveerror": SocketErrorEvent,
    "close": SocketCloseEvent
}

export class TcpSocket extends SimpleEventEmiter<TcpSocketEventMap> {

    /**
     * The socket identifier.
     */
    public socketId: number | null;

    /**
     * Flag indicating whether the socket is left open when the application is suspended (see `SocketProperties.persistent`).
     */
    public persistent: boolean;

    /**
     * Application-defined string associated with the socket.
     */
    public name?: string;

    /**
     * The size of the buffer used to receive data. If no buffer size has been specified explictly, the value is not provided.
     */
    public bufferSize?: number;

    /**
     * Flag indicating whether a connected socket blocks its peer from sending more data (see `setPaused`).
     */
    public paused: boolean;

    /**
     * Flag indicating whether the socket is connected to a remote peer.
     */
    public connected: boolean;

    /**
     * If the underlying socket is connected, contains its local IPv4/6 address.
     */
    public localAddress?: string;

    /**
     * If the underlying socket is connected, contains its local port.
     */
    public localPort?: number;

    /**
     * If the underlying socket is connected, contains the peer/ IPv4/6 address.
     */
    public peerAddress?: string;

    /**
     * If the underlying socket is connected, contains the peer port.
     */
    public peerPort?: number;

    private boundHandleReceive = this.handleReceive.bind(this);
    private boundHandleReceiveError = this.handleReceiveError.bind(this);

    constructor(info: chrome.sockets.tcp.SocketInfo) {
        super();
        this.socketId = info.socketId;
        this.persistent = info.persistent;
        this.name = info.name;
        this.bufferSize = info.bufferSize;
        this.paused = info.paused;
        this.connected = info.connected;
        this.localAddress = info.localAddress;
        this.localPort = info.localPort;
        this.peerAddress = info.peerAddress;
        this.peerPort = info.peerPort;
        chrome.sockets.tcp.onReceive.addListener(this.boundHandleReceive);
        chrome.sockets.tcp.onReceiveError.addListener(this.boundHandleReceiveError);
    }

    /**
     * Creates a TCP socket.
     * @param properties The socket properties (optional).
     */
    public static async create(properties?: chrome.sockets.tcp.SocketProperties): Promise<TcpSocket> {
        return new Promise((resolve, reject) => {
            const cb = (createInfo: chrome.sockets.tcp.CreateInfo) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                else {
                    resolve(TcpSocket.createFromExisting(createInfo.socketId));
                }
            }
            if (properties) {
                chrome.sockets.tcp.create(properties, cb);
            }
            else {
                chrome.sockets.tcp.create(cb);
            }
        });
    }

    /**
     * Creates a TCP socket.
     * @param socketId The identifier of an existing socket.
     */
    public static async createFromExisting(socketId: number): Promise<TcpSocket> {
        return new Promise((resolve, reject) => {
            chrome.sockets.tcp.getInfo(socketId, (info) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                else {
                    resolve(new TcpSocket(info));
                }
            });
        });
    }

    /**
     * Updates the socket properties.
     * @param properties The properties to update.
     */
    public async update(properties: chrome.sockets.tcp.SocketProperties): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.update(this.socketId, properties, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo());
                    }
                });
            }
        });
    }

    /**
     * Enables or disables the application from receiving messages from its peer. The default value is "false". Pausing a socket is typically used by an application to throttle data sent by its peer. When a socket is paused, no `onReceive` event is raised. When a socket is connected and un-paused, `onReceive` events are raised again when messages are received.
     * @param paused
     */
    public async setPaused(paused: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.setPaused(this.socketId, paused, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo());
                    }
                });
            }
        });
    }

    /**
     * Enables or disables the keep-alive functionality for a TCP connection.
     * @param enable If true, enable keep-alive functionality.
     * @param delay Set the delay seconds between the last data packet received and the first keepalive probe. Default is 0.
     */
    public async setKeepAlive(enable: boolean, delay?: number): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {

                const cb = (result: number) => {
                    if (result < 0) {
                        reject(new TcpError(result));
                    }
                    else if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo(result));
                    }
                };

                if (delay) {
                    chrome.sockets.tcp.setKeepAlive(this.socketId, enable, delay, cb);
                }
                else {
                    chrome.sockets.tcp.setKeepAlive(this.socketId, enable, cb);
                }

            }
        });
    }

    /**
     * Sets or clears `TCP_NODELAY` for a TCP connection. Nagle's algorithm will be disabled when `TCP_NODELAY` is set.
     * @param noDelay If true, disables Nagle's algorithm.
     */
    public async setNoDelay(noDelay: boolean): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.setNoDelay(this.socketId, noDelay, (result: number) => {
                    if (result < 0) {
                        reject(new TcpError(result));
                    }
                    else if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo(result));
                    }
                });
            }
        });
    }

    /**
     * Connects the socket to a remote machine. When the `connect` operation completes successfully, `onReceive` events are raised when data is received from the peer. If a network error occurs while the runtime is receiving packets, a `onReceiveError` event is raised, at which point no more `onReceive` event will be raised for this socket until the `resume` method is called.
     * @param peerAddress The address of the remote machine. DNS name, IPv4 and IPv6 formats are supported.
     * @param peerPort The port of the remote machine.
     */
    public async connect(peerAddress: string, peerPort: number): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.connect(this.socketId, peerAddress, peerPort, (result) => {
                    if (result < 0) {
                        reject(new TcpError(result));
                    }
                    else if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo(result));
                    }
                });
            }
        });
    }

    /**
     * Disconnects the socket.
     */
    public async disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.disconnect(this.socketId, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo());
                    }
                });
            }
        });
    }

    /**
     * Start a TLS client connection over the connected TCP client socket.
     * @param options Constraints and parameters for the TLS connection.
     */
    public async secure(options?: chrome.sockets.tcp.SecureOptions) {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {

                const cb = (result: number) => {
                    if (result < 0) {
                        reject(new TcpError(result));
                    }
                    else if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(this.updateInfo(result));
                    }
                };

                if (options) {
                    chrome.sockets.tcp.secure(this.socketId, options, cb);
                }
                else {
                    chrome.sockets.tcp.secure(this.socketId, cb);
                }

            }
        });
    }

    /**
     * Sends data on the given TCP socket.
     * @param value The data to send.
     */
    public async send(value: ArrayBuffer | string): Promise<chrome.sockets.tcp.SendInfo> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                const bytes = typeof value === 'string' ? new TextEncoder().encode(value).buffer : value;
                chrome.sockets.tcp.send(this.socketId, bytes, sendInfo => {
                    if (sendInfo.resultCode < 0) {
                        reject(new TcpError(sendInfo.resultCode));
                    }
                    else if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(sendInfo);
                    }
                });
            }
        });
    }

    /**
     * Closes the socket and releases the address/port the socket is bound to. Each socket created should be closed after use. The socket id is no no longer valid as soon at the function is called. However, the socket is guaranteed to be closed only when the callback is invoked.
     */
    public async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                resolve();
            }
            else {
                chrome.sockets.tcp.close(this.socketId, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve();
                    }
                });
                this.emit("close", { socketId: this.socketId });
                this.socketId = null;
                this.name = undefined;
                this.bufferSize = undefined;
                this.paused = true;
                this.connected = false;
                this.localAddress = undefined;
                this.localPort = undefined;
                this.peerAddress = undefined;
                this.peerPort = undefined;
                chrome.sockets.tcp.onReceive.removeListener(this.boundHandleReceive);
                chrome.sockets.tcp.onReceiveError.removeListener(this.boundHandleReceiveError);
            }
        });
    }

    /**
     * Retrieves the state of the given socket.
     */
    public async getInfo(): Promise<chrome.sockets.tcp.SocketInfo> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcp.getInfo(this.socketId, (info: chrome.sockets.tcp.SocketInfo) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        this.socketId = info.socketId;
                        this.persistent = info.persistent;
                        this.name = info.name;
                        this.bufferSize = info.bufferSize;
                        this.paused = info.paused;
                        this.connected = info.connected;
                        this.localAddress = info.localAddress;
                        this.localPort = info.localPort;
                        this.peerAddress = info.peerAddress;
                        this.peerPort = info.peerPort;
                        resolve(info);
                    }
                });
            }
        });
    }

    /**
     * Retrieves the list of currently opened sockets owned by the application.
     */
    public static async getSockets(): Promise<Array<chrome.sockets.tcp.SocketInfo>> {
        return new Promise((resolve, reject) => {
            chrome.sockets.tcp.getSockets((info: chrome.sockets.tcp.SocketInfo[]) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                else {
                    resolve(info);
                }
            });
        });
    }

    private async updateInfo<T>(result?: T): Promise<T> {
        await this.getInfo();
        return result as T;
    }

    private handleReceive(info: chrome.sockets.tcp.OnReceiveInfo) {
        if (info.socketId === this.socketId) {
            this.emit("receive", {
                socket: this,
                data: info.data
            });
        }
    }

    private handleReceiveError(info: chrome.sockets.tcp.OnReceiveErrorInfo) {
        if (info.socketId === this.socketId) {
            this.emit("receiveerror", {
                socket: this,
                error: new TcpError(info.resultCode)
            });
        }
    }

}
