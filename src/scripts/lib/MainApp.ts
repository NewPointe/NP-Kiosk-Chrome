import { App } from "./spa";
import { SettingsService, Setting, SettingTypeMap } from "./SettingsService";
import { SettingsPage, SetupPage, LoadingScreen, CheckinPage } from "./pages";
import { CheckinLabelService, CheckinLabelData } from "./CheckinLabelService";
import { TCPPrintService } from "./printing/TCPPrintService";
import { USBPrintService } from "./printing/USBPrintService";
import * as Comlink from 'comlink';
import { PrintService } from "./printing/PrintService";

export class MainApp extends App {

    /**
     * The main settings service
     */
    public settingsService = new SettingsService();

    /**
     * The main print service
     */
    public printServices = [
        new TCPPrintService(),
        new USBPrintService()
    ];

    /**
     * The checkin label service
     */
    public checkinLabelService = new CheckinLabelService(this.settingsService);

    /**
     * The api for controlling the backend app
     */
    public appApi = new AppApi(
        this,
        this.printServices,
        this.settingsService,
        this.checkinLabelService
    );

    /**
     * Creates a new App
     * @param appRoot The root HTML element for the app
     */
    constructor(appRoot: HTMLElement) {

        super(appRoot);

        this.registerPageTypes(SetupPage, SettingsPage, CheckinPage);
        this.registerOverlayTypes(LoadingScreen);

        this.setHomePageType(SetupPage);
        this.setLoadingOverlayType(LoadingScreen);

        chrome.commands.onCommand.addListener((command) => {
            if (command === 'show-settings') this.navigateInPlace("settings");
        });

    }

    public bindMessaging(peerWindow: Window, peerOrigin: string) {
        Comlink.expose(this.appApi, Comlink.windowEndpoint(peerWindow, undefined, peerOrigin));
        peerWindow.postMessage("NP_CHECKIN_INIT_API", peerOrigin);
    }

}

export class AppApi {

    constructor(
        private mainApp: MainApp,
        private printServices: PrintService[],
        private settingsService: SettingsService,
        private checkinLabelService: CheckinLabelService
    ) { }

    public async printLabels(labels: CheckinLabelData[]): Promise<void> {

        const printJobs = await this.checkinLabelService.getAndMergeLabels(labels);

        for (const job of printJobs) {

            const service = this.printServices.find(s => s.supportsConnection(job.connection));
            if(!service) {
                throw new Error(`There is no print service available for "${job.connection.type}" connections`);
            }
            await service.print(job);
        }

        return;

    }

    public async getAppSetting<T extends Setting>(key: T): Promise<SettingTypeMap[T] | null> {
        return this.settingsService.get(key, null);
    }

    public async setAppSetting<T extends Setting>(key: T, value: SettingTypeMap[T] | null): Promise<void> {
        return this.settingsService.set(key, value);
    }

    public async showSettingsPage(): Promise<void> {
        return this.mainApp.navigateInPlace("settings");
    }
}
