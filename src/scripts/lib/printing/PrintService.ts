
/**
 * The information needed to connect to a printer
 */
export interface PrinterConnectionInfo {

    /**
     * The type of connection
     */
    type: string;

    /**
     * A type-dependent address or identifier for connecting to the printer
     */
    connection: string;

}

/**
 * Information about a printer, used when enumerating printers
 */
export interface Printer extends PrinterConnectionInfo {

    /**
     * The name of the printer
     */
    name: string;

    /**
     * The manufacturer of the printer, if known
     */
    manufacturer?: string;

    /**
     * The model of the printer, if known
     */
    model?: string;

    /**
     * The serial number of the printer, if known
     */
    serial?: string;

}

/**
 * A print job
 */
export interface PrintJob {
    connection: PrinterConnectionInfo;
    documents: Document[];
}

/**
 * A document to print
 */
export interface Document {
    name: string;
    data: ArrayBuffer;
}

/**
 * A service that allows printing a document
 */
export interface PrintService {

    /**
     * Checks if the service supports printing over the given connection
     * @param connection The connection to check
     */
    supportsConnection(connection: PrinterConnectionInfo): boolean;

    /**
     * Returns a list of automatically discovered devices
     */
    discoverDevices(): Promise<Printer[]>;

    /**
     * If available, prompts the user to select a device through a native UI
     * @param multiple If the user should be able to select multiple devices
     */
    promptForDevices(multiple: boolean): Promise<Printer[]>;

    /**
     * Prints a print job
     * @param job The print job to print
     */
    print(job: PrintJob): Promise<void>;

}

