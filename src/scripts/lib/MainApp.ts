import { App } from "./spa";
import { SettingsService, Setting } from "./SettingsService";
import { SettingsPage, SetupPage, LoadingScreen, CheckinPage } from "./pages";
import { ZebraPrintService, ICheckinLabel, IPrintJob, mergeLabelContent } from "./printing";
import { MessagingService, MessageType, IMessage } from "./messaging";
import { IDBCache, ICacheItem } from "./IDBCache";
import { ZabbixAgent } from "./zabbix/ZabbixAgent";

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
     * The client api messaging service
     */
    public messagingService = new MessagingService();

    /**
     * A cache for label data
     */
    private labelCache = new IDBCache<string, string>("label-data");

    private settingsTriggerDelay: number = 2;

    private settingsTriggerTimeout: number | null = null;

    protected zabbixAgent: ZabbixAgent | null = null;

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

        appRoot.addEventListener('touchstart', this.handleTouchEvent.bind(this));
        appRoot.addEventListener('touchend', this.handleTouchEvent.bind(this));
        appRoot.addEventListener('touchcancel', this.handleTouchEvent.bind(this));

        this.messagingService.on(MessageType.PRINT_LABEL, this.handlePrintMessage.bind(this));
        this.messagingService.on(MessageType.GET_APP_SETTING, this.handleGetSettingMessage.bind(this));
        this.messagingService.on(MessageType.SET_APP_SETTING, this.handleSetSettingMessage.bind(this));

        chrome.commands.onCommand.addListener((command) => {
            if (command === 'show-settings') this.navigateInPlace("settings");
        });

        this.zabbixAgent = new ZabbixAgent({
            Hostname: "test",
            PassiveServers: "127.0.0.1"
        });

    }

    private handleTouchEvent(event: TouchEvent) {

        if (event.touches.length === 5) {
            if (!this.settingsTriggerTimeout) {
                this.settingsTriggerTimeout = window.setTimeout(this.handleSettingsTrigger.bind(this), 1000 * this.settingsTriggerDelay);
            }
        }
        else if (this.settingsTriggerTimeout) {
            window.clearTimeout(this.settingsTriggerTimeout);
            this.settingsTriggerTimeout = null;
        }

    }

    private handleSettingsTrigger() {
        this.navigateInPlace("settings");
    }

    private handlePrintMessage(message: IMessage<ICheckinLabel[]>) {
        this.handlePrintMessageAsync(message).then(() => { },
            (error: Error) => this.messagingService.sendMessage({ type: MessageType.ACTION_ERROR, correlationId: message.correlationId, data: error })
        );
    }

    private async handlePrintMessageAsync(message: IMessage<ICheckinLabel[]>) {
        if (message.data) {

            const printJobs = await this.getAndMergeLabels(message.data);

            await this.printService.printMultiple(printJobs);

            this.messagingService.sendMessage({ type: MessageType.ACTION_SUCCESS, correlationId: message.correlationId });

        }
    }

    private handleGetSettingMessage(message: IMessage<{ key: Setting; }>) {
        this.handleGetSettingMessageAsync(message).then(() => { },
            (error: Error) => this.messagingService.sendMessage({ type: MessageType.ACTION_ERROR, correlationId: message.correlationId, data: error })
        );
    }

    private async handleGetSettingMessageAsync(message: IMessage<{ key: Setting; }>) {
        if (message.data) {

            const value = await this.settingsService.get(message.data.key, null);

            this.messagingService.sendMessage({ type: MessageType.ACTION_SUCCESS, correlationId: message.correlationId, data: value });

        }
    }

    private handleSetSettingMessage(message: IMessage<{ key: Setting; value: unknown }>) {
        this.handleSetSettingMessageAsync(message).then(() => { },
            (error: Error) => this.messagingService.sendMessage({ type: MessageType.ACTION_ERROR, correlationId: message.correlationId, data: error })
        );
    }

    private async handleSetSettingMessageAsync(message: IMessage<{ key: Setting; value: unknown }>) {
        if (message.data) {

            await this.settingsService.set(message.data.key, message.data.value as any);

            this.messagingService.sendMessage({ type: MessageType.ACTION_SUCCESS, correlationId: message.correlationId });

        }
    }

    private async getAndMergeLabels(labels: ICheckinLabel[]): Promise<IPrintJob[]> {

        const printerOverride = await this.settingsService.get(Setting.PRINTER_OVERRIDE, null);
        const cacheEnabled = await this.settingsService.get(Setting.ENABLE_LABEL_CACHING, true);
        const cacheTime = await this.settingsService.get(Setting.CACHE_DURATION, 1800);

        const printJobs: IPrintJob[] = [];

        for (const label of labels) {

            const labelContent = await this.getLabelContent(label, cacheEnabled, cacheTime);
            printJobs.push({
                address: printerOverride || label.PrinterAddress,
                printData: mergeLabelContent(labelContent, label.MergeFields)
            });

        }

        return printJobs;

    }

    private async getLabelContent(label: ICheckinLabel, cacheEnabled: boolean, cacheTime: number): Promise<string> {


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

    private async fetchLabel(url: string) {
        return await (await fetch(url)).text();
    }

}



