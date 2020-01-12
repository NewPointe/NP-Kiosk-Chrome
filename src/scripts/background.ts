/**
 * The background service that manages the app lifecycle
 */
class BackgroundService {

    /**
     * The main winfow of the app
     */
    private mainWindow?: chrome.app.window.AppWindow | null;

    /**
     * Creates a new background service
     */
    constructor() {

        // Bind the launch event
        chrome.app.runtime.onLaunched.addListener(this.handleAppLaunched.bind(this));

    }

    /**
     * Handles the app being launched
     */
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

    /**
     * Handles the app window being closed
     */
    private handleAppWindowClosed() {

        // Release the screen keepawake
        chrome.power.releaseKeepAwake();

    }

}

// Start the background service
new BackgroundService();
