import { TcpServer, ClientEvent, ClientErrorEvent, ServerErrorEvent, ClientDataEvent } from "../sockets/TcpServer"
import { FancyError } from "../FancyError";
import { SimpleEventEmiter } from "../SimpleEventEmitter";
import * as checks from "./checks";
import { CheckManager } from "./CheckManager";

export interface ZabbixAgentConfiguration {

    Hostname: string;

    /**
     * Aliases for item keys. It can be used to substitute long and complex item key with a smaller and simpler one.
     */
    ItemAliases?: Array<{
        alias: string;
        key: string;
    }>;

    /**
     * Whether remote commands from Zabbix server are allowed.
     */
    AllowRemoteCommands?: boolean;

    /**
     * The port to listen to for passive checks from the server.
     *
     * Range: 1024-32767
     *
     * Default: 10050
     */
    ListenPort?: number;

    /**
     * The address to listen to for passive checks from the server.
     *
     * Default: 0.0.0.0
     */
    ListenAddress?: string;

    /**
     * How often to refresh the list of active checks, in seconds.
     *
     * Range: 60-3600
     *
     * Default: 120
     */
    RefreshInterval?: number;

    /**
     * A list of Zabbix servers/proxies to allow passive requests from.
     */
    PassiveServers?: string | string[];

    /**
     * A list of Zabbix servers/proxies to use for active checks.
     */
    ActiveServers?: string | string[];

}

export enum AgentEvent {
    ERROR
}

type AgentEventMap = {
    [AgentEvent.ERROR]: FancyError
}

export class ZabbixAgent extends SimpleEventEmiter<AgentEventMap> {

    private tcpServer?: TcpServer;
    public readonly config: ZabbixAgentConfiguration;

    private checkManager = new CheckManager(this);

    constructor(config: ZabbixAgentConfiguration) {
        super();
        this.config = config;

        if (this.config.PassiveServers) {
            TcpServer.create().then(this.initTcpServer.bind(this)).catch(this.initTcpServerError.bind(this));
        }

        this.checkManager.registerCheckType(...Object.values(checks));

    }

    private async initTcpServer(tcpServer: TcpServer) {

        // Start listening
        await tcpServer.listen(
            this.config.ListenAddress || "0.0.0.0",
            this.config.ListenPort || 10050
        );

        // If successful, save the server
        this.tcpServer = tcpServer;

        this.tcpServer.on("accept", this.tcpServerHandleAccept.bind(this));
        this.tcpServer.on("accepterror", this.tcpServerHandleAcceptError.bind(this));
        this.tcpServer.on("receive", this.tcpServerHandleReceive.bind(this));
        this.tcpServer.on("receiveerror", this.tcpServerHandleRecieveError.bind(this));

    }

    private tcpServerHandleAccept(info: ClientEvent) {
        console.log("Accept:");
        console.log(info);
        if (info.client.peerAddress && this.config.PassiveServers) {
            return checkAddressFilter(info.client.peerAddress, this.config.PassiveServers);
        }
        else {
            return false;
        }
    }

    private tcpServerHandleAcceptError(info: ServerErrorEvent) {
        console.log("AcceptError:");
        console.log(info);
    }

    private tcpServerHandleReceive(info: ClientDataEvent) {
        this.tcpServerHandleReceiveAsync(info).then(() => { },
            error => {
                console.log("Error sending response:");
                console.log(error);
            }
        )
    }

    private async tcpServerHandleReceiveAsync(info: ClientDataEvent) {
        console.log("Receive:");
        console.log(info);

        const requests = new TextDecoder().decode(info.data).split('\n');
        for (const request of requests) {

            let result: any;

            try {
                result = await this.checkManager.runCheck(request);
            }
            catch (error) {
                info.client.send(error.type + '\0' + error.message + '\n')
            }

            if (typeof result !== 'undefined' && info.client.connected) info.client.send(JSON.stringify(result) + '\n');

        }
    }

    private tcpServerHandleRecieveError(info: ClientErrorEvent) {
        console.log("ReceiveError:");
        console.log(info);
    }

    private initTcpServerError(error: Error) {
        console.log("initTcpServerError:");
        console.log(error);
        this.emitError("Failed to start TCP server for passive checks.", error);
    }

    private emitError(message: string, causedBy?: Error) {
        this.emit(
            AgentEvent.ERROR,
            new FancyError({ component: 'Zabbix Agent', message, causedBy })
        );
    }

}

function checkAddressFilter(address: string, filter: string | string[]) {
    const filters = typeof filter === "string" ? [filter] : filter;
    return filters.some(f => matchAddress(address, f));
}

function matchAddress(address: string, filter: string) {
    // TODO: add actual filter matching (CIDR/etc)
    return address === filter;
}
