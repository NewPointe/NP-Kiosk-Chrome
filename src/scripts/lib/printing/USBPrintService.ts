import { PrintService, PrinterConnectionInfo, Printer, PrintJob } from './PrintService';
import { promisifyChrome } from '../Util';

const getDevices = promisifyChrome(chrome.usb.getDevices);
const getUserSelectedDevices = promisifyChrome(chrome.usb.getUserSelectedDevices);
const openDevice = promisifyChrome(chrome.usb.openDevice);
const listInterfaces = promisifyChrome(chrome.usb.listInterfaces);
const claimInterface = promisifyChrome(chrome.usb.claimInterface);
const bulkTransfer = promisifyChrome(chrome.usb.bulkTransfer);
const releaseInterface = promisifyChrome(chrome.usb.releaseInterface);
const closeDevice = promisifyChrome(chrome.usb.closeDevice);

function usbDeviceToPrinter(device: chrome.usb.Device): Printer {
    return {
        type: "usb",
        name: device.productName,
        connection: device.serialNumber,
        manufacturer: device.manufacturerName,
        model: device.productName,
        serial: device.serialNumber
    }
}

export class USBPrintService implements PrintService {

    supportsConnection(connection: PrinterConnectionInfo): boolean {
        return connection.type === "usb";
    }

    async discoverDevices(): Promise<Printer[]> {
        return (await getDevices({ filters: [{ interfaceClass: 7 }] })).map(usbDeviceToPrinter);
    }

    async promptForDevices(multiple: boolean = false): Promise<Printer[]> {
        return (await getUserSelectedDevices({ multiple, filters: [{ interfaceClass: 7 }] })).map(usbDeviceToPrinter);
    }

    async print(job: PrintJob): Promise<void> {

        // Get all connected printers
        const printers = await getDevices({ filters: [{ interfaceClass: 7 }] });
        if(printers.length === 0) throw new Error("No printer devices found. Is your printer plugged in and turned on?");

        // Find the one to print to
        const printer = printers.find(p => p.serialNumber === job.connection.connection);
        if(!printer) throw new Error(`Printer ${  job.connection.connection } could not be found. Is it plugged in and turned on?`);

        // Open a connection to the device
        const connection = await openDevice(printer);

        try {

            // Look for a printer interface
            const interfaces = await listInterfaces(connection);
            const printInterface = interfaces.find(i => i.interfaceClass === 7);
            if (!printInterface) throw new Error("USB Device does not have a printer interface");

            // Look for a bulk out endpoint
            const printEndpoint = printInterface.endpoints.find(e => e.direction === "out" && e.type === "bulk");
            if (!printEndpoint) throw new Error("The USB Device's printer interface does not have an out endpoint");

            // Claim the interface
            await claimInterface(connection, printInterface.interfaceNumber);

            try {

                // For each job
                for (const document of job.documents) {

                    // Send it over the USB interface
                    const result = await bulkTransfer(connection, {
                        direction: "out",
                        endpoint: printEndpoint.address,
                        data: document.data,
                        timeout: 10000
                    });

                    if (result.resultCode !== 0) throw new Error(`USB transfer returned non-zero result code ${result.resultCode}`);

                }

            }
            finally {

                // Release the interface
                await releaseInterface(connection, printInterface.interfaceNumber);

            }

        }
        finally {

            // Close the device
            await closeDevice(connection);

        }
    }

}
