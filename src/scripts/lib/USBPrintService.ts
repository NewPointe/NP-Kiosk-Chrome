import { IPrintJob } from "./printing/ZebraPrintService";
import { promisifyChrome } from "./Util";


const getDevices = promisifyChrome(chrome.usb.getDevices);
const getUserSelectedDevices = promisifyChrome(chrome.usb.getUserSelectedDevices);
const openDevice = promisifyChrome(chrome.usb.openDevice);
const listInterfaces = promisifyChrome(chrome.usb.listInterfaces);
const claimInterface = promisifyChrome(chrome.usb.claimInterface);
const bulkTransfer = promisifyChrome(chrome.usb.bulkTransfer);
const releaseInterface = promisifyChrome(chrome.usb.releaseInterface);
const closeDevice = promisifyChrome(chrome.usb.closeDevice);

export class USBPrintService {

    async findPrinters(): Promise<chrome.usb.Device[]> {
        return getDevices({
            filters: [{ interfaceClass: 7 }]
        });
    }

    getUserSelectedPrinters(multiple: boolean): Promise<chrome.usb.Device[]> {
        return getUserSelectedDevices({
            multiple,
            filters: [{ interfaceClass: 7 }]
        });
    }

    async print(jobs: IPrintJob[], printer: chrome.usb.Device) {

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
                for (const job of jobs) {

                    // Encode the data
                    const dataBuffer = new TextEncoder().encode(job.printData).buffer;

                    // Send it over the USB interface
                    const result = await bulkTransfer(connection, {
                        direction: "out",
                        endpoint: printEndpoint.address,
                        data: dataBuffer,
                        timeout: 10000
                    });

                    if (result.resultCode !== 0) throw new Error(`USB transfer returned non-zero result code ${result.resultCode}`);

                }

            }
            finally {
                await releaseInterface(connection, printInterface.interfaceNumber);
            }

        }
        finally {
            await closeDevice(connection);
        }

    }

}

