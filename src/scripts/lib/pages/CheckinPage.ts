import { IScreen } from "../spa";
import { MainApp } from "../MainApp";
import { Setting } from "../SettingsService";
import { ensureUrlProtocol, checkOrigin, getOrigin } from "../Util";

export class CheckinPage implements IScreen {

    static typeId = "checkin";

    private webview: HTMLWebviewElement;

    private firstLoad: boolean = true;

    public checkinAddress: string = "";

    constructor(protected app: MainApp) {

        this.webview = document.createElement("webview");
        this.webview.setAttribute("partition", "persist:rockcheckin");
        this.webview.setZoomMode("disabled");
        this.webview.addEventListener("loadcommit", this.handleWebviewLoadCommit.bind(this));
        this.webview.addEventListener('contentload', this.handleWebviewContentLoad.bind(this));

    }

    async onload() {

        this.firstLoad = true;

        // Get the check-in address from settings
        this.checkinAddress = ensureUrlProtocol(await this.app.settingsService.get(Setting.CHECKIN_ADDRESS, ""));

        try {
            new URL(this.checkinAddress);
        }
        catch(e) {
            return this.app.navigateInPlace('setup');
        }

        this.webview.src = this.checkinAddress;
        this.app.showLoadingOverlay(`Loading Check-in from ${this.checkinAddress}`);

    }

    onunload() { }

    render() {
        return this.webview;
    }

    private handleWebviewLoadCommit(event: LoadCommitEvent) {

        // Check if the page is from the configured origin
        if (event.isTopLevel && checkOrigin(this.checkinAddress, event.url)) {

            // Inject the client-side messaging api
            this.webview.executeScript({ file: 'scripts/client-api-injector.js' });

        }

    }

    private async handleWebviewContentLoad() {

        // Hide the loading overlay
        if(this.firstLoad) {
            await this.app.hideLoadingOverlay();
            this.firstLoad = false;
        }

        // Bind the webview to the messaging service
        this.app.bindMessaging(this.webview.contentWindow, getOrigin(this.checkinAddress));

    }

}
