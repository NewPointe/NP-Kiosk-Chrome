import { UrlInputControl, ToggleSwitchControl, NumberInputControl, InputControl, AlertControl, SubmitButtonControl } from "../controls";
import { IScreen } from "../spa";
import { Tag } from "../TagBuilder";
import { IP_PORT_REGEX, removeHttps } from "../Util";
import { Setting } from "../SettingsService";
import { MainApp } from "../MainApp";

export class SettingsPage implements IScreen {

    static typeId = "settings";

    public checkinAddress = "";
    public enableLabelCaching = false;
    public cacheDuration: number | null = null;
    public printerOverride = "";
    public printerTimeout: number | null = null;
    public inappSettingsDelay: number | null = null;
    public inappSettingsPin = "";

    constructor(private app: MainApp) { }

    async onload() {

        this.checkinAddress = removeHttps(await this.app.settingsService.get(Setting.CHECKIN_ADDRESS, ""));
        this.enableLabelCaching = await this.app.settingsService.get(Setting.ENABLE_LABEL_CACHING, true);
        this.cacheDuration = await this.app.settingsService.get(Setting.CACHE_DURATION, null);
        this.printerOverride = await this.app.settingsService.get(Setting.PRINTER_OVERRIDE, "");
        this.printerTimeout = await this.app.settingsService.get(Setting.PRINTER_TIMEOUT, null);
        this.inappSettingsDelay = await this.app.settingsService.get(Setting.INAPP_SETTINGS_DELAY, null);
        this.inappSettingsPin = await this.app.settingsService.get(Setting.INAPP_SETTINGS_PIN, "");

    }

    onunload() { }

    render() {
        return Tag.div("flex-vertical-center").content(
            Tag.div("container").content(
                Tag.form().content(
                    new UrlInputControl({
                        label: "Check-in Address",
                        placeholder: "yourserver.com/checkin",
                        bind: [this, "checkinAddress"]
                    }),
                    new ToggleSwitchControl({
                        label: "Enable Label Caching",
                        bind: [this, "enableLabelCaching"]
                    }),
                    new NumberInputControl({
                        label: "Cache Duration",
                        placeholder: "1800",
                        minimum: 0,
                        suffix: "seconds",
                        bind: [this, "cacheDuration"]
                    }),
                    new InputControl({
                        type: "text",
                        label: "Printer Override",
                        validationPattern: IP_PORT_REGEX,
                        validationMessage: "Printer Override Address must be in the format 0.0.0.0 or 0.0.0.0:9100",
                        placeholder: "0.0.0.0:9100",
                        bind: [this, "printerOverride"]
                    }),
                    // new NumberInputControl({
                    //     label: "Printer Timeout",
                    //     placeholder: "2",
                    //     minimum: -1,
                    //     suffix: "seconds",
                    //     bind: [this, "printerTimeout"]
                    // }),
                    Tag.div("form-group").content(
                        Tag.label("", "Bluetooth Printing"),
                        new AlertControl({
                            type: "light",
                            message: "Bluetooth printing is not available in this version of the app."
                        })
                    ),
                    new NumberInputControl({
                        label: "In-Application Settings Delay",
                        placeholder: "2",
                        minimum: 0,
                        suffix: "seconds",
                        bind: [this, "inappSettingsDelay"]
                    }),
                    // new InputControl({
                    //     type: "text",
                    //     label: "In-Application Settings Pin",
                    //     placeholder: "01234"
                    // }),
                    new SubmitButtonControl({
                        type: "primary",
                        label: "Save Settings"
                    })
                ).on("submit", this.onFormSubmit.bind(this))
            )
        ).get();
    }

    onFormSubmit(event: Event) {

        this.saveSettings().then(
            () => this.app.navigateInPlace("checkin"),
            error => console.log(error)
        );

        event.preventDefault();
    }

    private async saveSettings() {

        await this.app.settingsService.set(Setting.CHECKIN_ADDRESS, this.checkinAddress);
        await this.app.settingsService.set(Setting.ENABLE_LABEL_CACHING, this.enableLabelCaching);
        await this.app.settingsService.set(Setting.CACHE_DURATION, this.cacheDuration);
        await this.app.settingsService.set(Setting.PRINTER_OVERRIDE, this.printerOverride);
        await this.app.settingsService.set(Setting.PRINTER_TIMEOUT, this.printerTimeout);
        await this.app.settingsService.set(Setting.INAPP_SETTINGS_DELAY, this.inappSettingsDelay);
        await this.app.settingsService.set(Setting.INAPP_SETTINGS_PIN, this.inappSettingsPin);

    }
}
