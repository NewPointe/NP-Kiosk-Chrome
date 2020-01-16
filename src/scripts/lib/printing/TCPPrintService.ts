import { PrintService, PrinterConnectionInfo, Printer, PrintJob } from './PrintService';
import { TcpSocket } from '../sockets';

function getSplitAddress(address: string) {
    const [ip, port = "9100"] = address.split(":");
    return { ip, port: +port };
}

/**
 * A print service that can communicate with a printer over a TCP network connection.
 */
export class TCPPrintService implements PrintService {

    supportsConnection(connection: PrinterConnectionInfo): boolean {
        return connection.type === "tcp";
    }

    async discoverDevices(): Promise<Printer[]> {
        // TODO: See if there's a nice way to do network discovery. Maybe mdns?
        return [];
    }

    async promptForDevices(_: boolean = false): Promise<Printer[]> {
        // There's no native prompt for network devices so return an empty result.
        return [];
    }

    async print(job: PrintJob): Promise<void> {

        // Create a new TCP socket
        const socket = await TcpSocket.create();

        try {

            // Get the target address
            const target = getSplitAddress(job.connection.connection);

            // Connect to the target
            await socket.connect(target.ip, target.port);

            try {

                // For each document
                for (const document of job.documents) {

                    // Send the print data
                    await socket.send(document.data);

                }

            }
            finally {

                // Disconnect the socket
                await socket.disconnect();

            }

        }
        finally {

            // Close the socket
            await socket.close();

        }

    }

}
