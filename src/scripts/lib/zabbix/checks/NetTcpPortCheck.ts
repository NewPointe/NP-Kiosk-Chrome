import { ICheck } from "./ICheck";
import { TcpSocket } from "../../sockets";

export class NetTcpPortCheck implements ICheck {

    public readonly key = "net.tcp.port";

    async run(
        ip: string = "127.0.0.1",
        port: string = "80"
    ): Promise<0 | 1> {

        try {
            const socket = await TcpSocket.create();
            await socket.connect(ip, +port);
            await socket.disconnect();
            await socket.close();
            return 1;
        }
        catch (e) {
            return 0;
        }

    }

}
