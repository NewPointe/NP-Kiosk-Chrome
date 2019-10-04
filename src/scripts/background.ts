/// <references path="./chrome.d.ts" />


class BackgroundService {

    private mainWindow?: chrome.app.window.AppWindow | null;

    constructor() {

        // Bind the launch event
        chrome.app.runtime.onLaunched.addListener(this.handleAppLaunched.bind(this));

    }

    private handleAppLaunched() {

        // Keep the screen awake while the app window is open
        chrome.power.requestKeepAwake("display");

        // Create a new app window
        chrome.app.window.create(
            'application.html',
            { 'id': 'rockcheckin.mainwindow' },
            (createdWindow) => {

                this.mainWindow = createdWindow;
                this.mainWindow.onClosed.addListener(this.handleAppWindowClosed.bind(this));

            }
        );

    }

    private handleAppWindowClosed() {

        chrome.power.releaseKeepAwake();

    }

}

new BackgroundService();
