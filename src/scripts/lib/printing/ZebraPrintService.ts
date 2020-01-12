import { TcpSocket } from "../sockets";
import { groupBy } from "../Util";

export interface IPrintJob {
    address: string;
    printData: string;
}

function getSplitAddress(address: string) {
    const [ip, port = "9100"] = address.split(":");
    return { ip, port: +port };
}

export class ZebraPrintService {

    public async printMultiple(jobs: IPrintJob[]) {

        const socket = await TcpSocket.create();

        const jobsByAddress = groupBy(jobs, "address");

        try {

            for (const address of jobsByAddress.keys()) {

                const printerJobs = jobsByAddress.get(address);

                if (printerJobs) {

                    const target = getSplitAddress(address);

                    await socket.connect(target.ip, target.port);

                    try {

                        for (const job of printerJobs) {
                            await socket.send(job.printData);
                        }

                    }
                    finally {

                        await socket.disconnect();

                    }

                }

            }

        }
        finally {

            await socket.close();

        }

    }

    public async printOne(job: IPrintJob) {

        const target = getSplitAddress(job.address);

        const socket = await TcpSocket.create();

        try {

            await socket.connect(target.ip, target.port);

            try {

                await socket.send(job.printData);

            }
            finally {

                await socket.disconnect();

            }

        }
        finally {

            await socket.close();

        }

    }

}
