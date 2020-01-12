import { App } from "./spa";
import { SettingsService, Setting, SettingTypeMap } from "./SettingsService";
import { SettingsPage, SetupPage, LoadingScreen, CheckinPage } from "./pages";
import { ZebraPrintService } from "./printing/ZebraPrintService";
import { CheckinLabelService, CheckinLabelData } from "./CheckinLabelService";
import * as Comlink from 'comlink';

export class MainApp extends App {

    /**
     * The main settings service
     */
    public settingsService = new SettingsService();

    /**
     * The main print service
     */
    public printService = new ZebraPrintService();

    /**
     * The checkin label service
     */
    public checkinLabelService = new CheckinLabelService(this.settingsService);

    /**
     * The api for controlling the backend app
     */
    public appApi = new AppApi(
        this,
        this.printService,
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
        console.log("Binding to window");
        console.log(peerOrigin);
        Comlink.expose(this.appApi, Comlink.windowEndpoint(peerWindow, undefined, peerOrigin));
        peerWindow.postMessage("NP_CHECKIN_INIT_API", peerOrigin);
    }

}

export class AppApi {

    constructor(
        private mainApp: MainApp,
        private printService: ZebraPrintService,
        private settingsService: SettingsService,
        private checkinLabelService: CheckinLabelService
    ) { }

    public async printLabels(labels: CheckinLabelData[]): Promise<void> {

        const printJobs = await this.checkinLabelService.getAndMergeLabels(labels);

        await this.printService.printMultiple(printJobs);

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
