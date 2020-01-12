import { SimpleEventEmiter } from "../SimpleEventEmitter";
import { TcpSocket, SocketDataEvent, SocketErrorEvent, SocketCloseEvent } from "./TcpSocket";
import { TcpError } from "./TcpError";


export interface ServerEvent {
    server: TcpServer;
}

export interface ClientEvent extends ServerEvent {
    client: TcpSocket;
}

export interface ClientDataEvent extends ClientEvent {
    data: ArrayBuffer;
}

export interface ServerErrorEvent extends ServerEvent {
    error: TcpError;
}

export interface ClientErrorEvent extends ClientEvent {
    error: TcpError;
}

type TcpServerEventMap = {
    "accept": ClientEvent,
    "accepterror": ServerErrorEvent,
    "receive": ClientDataEvent,
    "receiveerror": ClientErrorEvent,
    "error": ServerErrorEvent
}

/**
 * Manages a TCP Server using Chrome's `chrome.sockets.tcpServer` API.
 */
export class TcpServer extends SimpleEventEmiter<TcpServerEventMap> {

    private socketId: number | null;
    private clients = new Map<number, TcpSocket>();

    private boundHandleAccept = this.handleAccept.bind(this);
    private boundHandleAcceptError = this.handleAcceptError.bind(this);
    private boundHandleClientReceive = this.handleClientReceive.bind(this);
    private boundHandleClientReceiveError = this.handleClientReceiveError.bind(this);
    private boundHandleClientDestroy = this.handleClientDestroy.bind(this);

    public constructor(socketId: number) {
        super();
        this.socketId = socketId;
        chrome.sockets.tcpServer.onAccept.addListener(this.boundHandleAccept);
        chrome.sockets.tcpServer.onAcceptError.addListener(this.boundHandleAcceptError);
    }

    public static async create(properties?: chrome.sockets.tcpServer.SocketProperties): Promise<TcpServer> {
        return new Promise((resolve, reject) => {
            const cb = (createInfo: chrome.sockets.tcpServer.CreateInfo) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                else {
                    resolve(new TcpServer(createInfo.socketId));
                }
            }
            if (properties) {
                chrome.sockets.tcpServer.create(properties, cb);
            }
            else {
                chrome.sockets.tcpServer.create(cb);
            }
        });
    }

    public async update(properties: chrome.sockets.tcpServer.SocketProperties): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcpServer.update(this.socketId, properties, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }

    public async setPaused(paused: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcpServer.setPaused(this.socketId, paused, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }

    public async listen(address: string, port: number, backlog?: number): Promise<number> {
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
                        resolve(result);
                    }
                };

                if (typeof backlog !== 'undefined') {
                    chrome.sockets.tcpServer.listen(this.socketId, address, port, backlog, cb);
                }
                else {
                    chrome.sockets.tcpServer.listen(this.socketId, address, port, cb);
                }

            }
        });
    }

    public async disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcpServer.disconnect(this.socketId, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }

    public async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                resolve();
            }
            else {
                chrome.sockets.tcpServer.close(this.socketId, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve();
                    }
                });
                this.socketId = null;
                chrome.sockets.tcpServer.onAccept.removeListener(this.boundHandleAccept);
                chrome.sockets.tcpServer.onAcceptError.removeListener(this.boundHandleAcceptError);
            }
        });
    }

    public async getInfo(): Promise<chrome.sockets.tcpServer.SocketInfo> {
        return new Promise((resolve, reject) => {
            if (this.socketId === null) {
                reject(new Error("Socket does not exist or has already been closed."));
            }
            else {
                chrome.sockets.tcpServer.getInfo(this.socketId, (info: chrome.sockets.tcpServer.SocketInfo) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(info);
                    }
                });
            }
        });
    }

    public static async getSockets(): Promise<Array<chrome.sockets.tcpServer.SocketInfo>> {
        return new Promise((resolve, reject) => {
            chrome.sockets.tcpServer.getSockets((info: chrome.sockets.tcpServer.SocketInfo[]) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                else {
                    resolve(info);
                }
            });
        });
    }

    private handleAccept(info: chrome.sockets.tcpServer.OnAcceptInfo) {
        if (info.socketId === this.socketId) {
            TcpSocket
                .createFromExisting(info.clientSocketId)
                .then(
                    socket => {
                        const accept = this.emit("accept", { server: this, client: socket });
                        if (accept !== false) {
                            this.clients.set(info.clientSocketId, socket);
                            socket.on("receive", this.boundHandleClientReceive);
                            socket.on("receiveerror", this.boundHandleClientReceiveError);
                            socket.on("close", this.boundHandleClientDestroy);
                            return socket.setPaused(false);
                        }
                        else {
                            return socket.close();
                        }
                    }
                )
                .catch(error => this.emit("error", { server: this, error }));
        }
    }

    private handleAcceptError(info: chrome.sockets.tcpServer.OnAcceptErrorInfo) {
        if (info.socketId === this.socketId) {
            this.emit("accepterror", {
                server: this,
                error: new TcpError(info.resultCode)
            });
        }
    }

    private handleClientReceive(event: SocketDataEvent) {
        this.emit("receive", {
            server: this,
            client: event.socket,
            data: event.data
        });
    }

    private handleClientReceiveError(event: SocketErrorEvent) {

        const result = this.emit("receiveerror", {
            server: this,
            client: event.socket,
            error: event.error
        });

        // If the error event wasn't canceled, close the connection
        if(result !== false) {
            event.socket.close();
        }

    }

    private handleClientDestroy(event: SocketCloseEvent) {
        this.clients.delete(event.socketId);
    }

}
