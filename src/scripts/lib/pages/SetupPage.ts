import { UrlInputControl, AlertControl, SubmitButtonControl } from "../controls";
import { MainApp } from "../MainApp";
import { IScreen } from "../spa";
import { Tag } from "../TagBuilder";
import { Setting } from "../SettingsService";
import { ensureUrlProtocol, removeHttps } from "../Util";

export class SetupPage implements IScreen {

    static typeId = "setup";

    public checkinAddress: string = "";

    constructor(private app: MainApp) { }

    async onload() {

        // Get the check-in address from settings
        this.checkinAddress = removeHttps(await this.app.settingsService.get(Setting.CHECKIN_ADDRESS, ""));



        // Make sure it's valid
        try {
            if (new URL(ensureUrlProtocol(this.checkinAddress))) {

                // Start checkin
                await this.app.navigateInPlace("checkin");

            }
        }
        catch (e) { }

    }

    onunload() { }

    render() {
        return Tag.div("flex-vertical-center").content(
            Tag.div("container").content(
                Tag.h1("Let's Get Started..."),
                Tag.p("Before we get started, let's configure the application to talk to your Rock server."),
                Tag.form().content(
                    new UrlInputControl({
                        label: "Check-in Address",
                        placeholder: "yourserver.com/checkin",
                        bind: [this, "checkinAddress"]
                    }),
                    new AlertControl({
                        type: "info",
                        title: "Just In Case."
                    }).content(
                        new Tag("br"),
                        "You can open the Kiosk settings later by pressing ",
                        new Tag("kbd").content(
                            new Tag("kbd").content("ctrl"),
                            " + ",
                            new Tag("kbd").content("shift"),
                            " + ",
                            new Tag("kbd").content(".")
                        ),
                        " (for laptop devices) or holding down 5 fingers on the screen (for tablet devices)."
                    ),
                    new SubmitButtonControl({
                        type: "primary",
                        label: "Save Settings"
                    })
                ).on("submit", this.onFormSubmit.bind(this))
            )
        ).get();
    }

    onFormSubmit(event: Event) {

        // Save the checkin address
        this.app.settingsService.set(Setting.CHECKIN_ADDRESS, ensureUrlProtocol(this.checkinAddress));

        // Start checkin
        this.app.navigateInPlace("checkin");

        event.preventDefault();

    }

}
