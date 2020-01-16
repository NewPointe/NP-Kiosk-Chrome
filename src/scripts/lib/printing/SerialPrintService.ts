import { PrintService, PrinterConnectionInfo, Printer, PrintJob } from './PrintService';
import { promisifyChrome } from '../Util';

const getDevices = promisifyChrome(chrome.serial.getDevices);
const connect = promisifyChrome(chrome.serial.connect);
const disconnect = promisifyChrome(chrome.serial.disconnect);
const send = promisifyChrome(chrome.serial.send);
const flush = promisifyChrome(chrome.serial.flush);

function serialDeviceToPrinter(device: chrome.serial.DeviceInfo): Printer {
    return {
        type: "serial",
        name: device.displayName || device.path,
        connection: device.path
    }
}

/**
 * A print service that can communicate with a printer over a serial connection.
 */
export class SerialPrintService implements PrintService {

    supportsConnection(connection: PrinterConnectionInfo): boolean {
        return connection.type === "serial";
    }

    async discoverDevices(): Promise<Printer[]> {
        return (await getDevices()).map(serialDeviceToPrinter);
    }

    async promptForDevices(_: boolean = false): Promise<Printer[]> {
        // There's no native prompt for serial devices so return an empty result.
        return [];
    }

    async print(job: PrintJob): Promise<void> {

        // Connect to the printer
        const connection = await connect(job.connection.connection, {});

        try {

        }
        finally {
            await disconnect(connection.connectionId);
        }

    }

}
