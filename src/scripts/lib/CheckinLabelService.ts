import { IDBCache, ICacheItem } from "./IDBCache";
import { SettingsService, Setting } from "./SettingsService";
import { PrintJob } from "./printing/PrintService";

export interface CheckinLabelData {
    FileGuid: string;
    LabelFile: string;
    LabelKey: string;
    LabelType: number;
    MergeFields: Record<string, string>;
    Order: number;
    PersonId: number;
    PrintFrom: number;
    PrintTo: number;
    PrinterAddress: string;
    PrinterDeviceId: number;
}

/**
 * A service for fetching and merging label data
 */
export class CheckinLabelService {

    /**
     * A cache for label data
     */
    private labelCache = new IDBCache<string, string>("label-data");

    /**
     * Creates a new checkin label service.
     * @param settingsService The settings service
     */
    constructor(
        private settingsService: SettingsService
    ) { }

    /**
     * Gets and merges the labels into print jobs
     * @param labels The labels to get and merge
     */
    public async getAndMergeLabels(labels: CheckinLabelData[]): Promise<PrintJob[]> {

        const printerOverride = await this.settingsService.get(Setting.PRINTER_OVERRIDE, null);
        const cacheEnabled = await this.settingsService.get(Setting.ENABLE_LABEL_CACHING, true);
        const cacheTime = await this.settingsService.get(Setting.CACHE_DURATION, 1800);

        const printJobs = new Map<string, PrintJob>();

        const textEncoder = new TextEncoder();

        for (const label of labels) {

            const labelContent = await this.getLabelContent(label, cacheEnabled, cacheTime);
            const labelPrinterConnection = printerOverride || label.PrinterAddress;

            // Get the job for this connection
            let job = printJobs.get(labelPrinterConnection);

            // If the job doesn't exist, create it
            if (!job) {
                job = {
                    connection: {
                        type: "tcp",
                        connection: labelPrinterConnection
                    },
                    documents: []
                };
                printJobs.set(labelPrinterConnection, job);
            }

            // Add the document to the job
            job.documents.push({
                name: "",
                data: textEncoder.encode(this.mergeLabelContent(labelContent, label.MergeFields)).buffer
            });

        }

        return [...printJobs.values()];

    }

    /**
     * Gets the label contents
     * @param label The label data
     * @param cacheEnabled If the label should be chached
     * @param cacheTime The ammount of time to cache the label, in milliseconds
     */
    public async getLabelContent(label: CheckinLabelData, cacheEnabled: boolean, cacheTime: number): Promise<string> {
        if (!cacheEnabled) {
            return await this.fetchLabel(label.LabelFile);
        }
        else {
            return await this.labelCache.getOrUpdate(
                label.LabelKey,
                async (): Promise<ICacheItem<string>> => ({
                    value: await this.fetchLabel(label.LabelFile),
                    expiresAt: Date.now() + (1000 * cacheTime)
                })
            );
        }
    }

    /**
     * Fetches the label contents from the network
     * @param url The URL of the label
     */
    public async fetchLabel(url: string) {
        return await (await fetch(url)).text();
    }

    /**
     * Merges the label content
     * @param labelContent The label contents
     * @param mergeFields The merge fields
     */
    public mergeLabelContent(labelContent: string, mergeFields: Record<string, string>): string {

        for (const [key, value] of Object.entries(mergeFields)) {
            if (value.length > 0) {

                // merge the contents of the field
                labelContent = labelContent.replace(new RegExp(`(?<=\\^FD)(${key})(?=\\^FS)`, "g"), value);

            }
            else {

                // remove the field origin (used for inverting backgrounds)
                labelContent = labelContent.replace(new RegExp(`\\^FO.*\\^FS\\s*(?=\\^FT.*\\^FD${key}\\^FS)`, "g"), "");

                // remove the field data (the actual value)
                labelContent = labelContent.replace(new RegExp(`\\^FD${key}\\^FS`, "g"), "");

            }
        }

        return labelContent;

    }
}
