'use strict';

import { Setting } from "./lib/SettingsService";
import { AppApi } from "./lib/MainApp";
import * as Comlink from 'comlink';

const appSettingMap: Record<string, Setting> = {
    "checkin_address": Setting.CHECKIN_ADDRESS
};

export class Client {

    public appApi?: Comlink.Remote<AppApi>;


    constructor() {

        window.addEventListener('message', this.handleWindowMessage.bind(this));

    }

    private handleWindowMessage(event: MessageEvent) {

        console.log("Recieved Message:");
        console.log(event.data);

        // Make sure it's a valid message
        if (event.data) {

            // Check if it's an init message
            if(event.data === "NP_CHECKIN_INIT_API") {


                this.appApi = Comlink.wrap<AppApi>(Comlink.windowEndpoint(event.source as Window, undefined, event.origin));

            }

        }

    }

}

(() => {

    // Gaurd in case we're injected more than once
    if (window.hasRockCheckinClientAPI) return;
    window.hasRockCheckinClientAPI = true;

    // Create a new messenger
    const client = new Client();

    (window as any).client = client;

    // Set up the API

    // Windows client compatability shim
    if (!window.external) (window as any).external = {};
    window.external.PrintLabels = (labelsJson) => {

        client.appApi?.printLabels(JSON.parse(labelsJson));

    };

    // iOS client compatability shim
    if (!window.Cordova) window.Cordova = {};
    window.Cordova.exec = (success, fail, classname, method, args) => {

        if (classname === "ZebraPrint" && method === "printTags") {

            client.appApi?.printLabels(JSON.parse(args[0])).then(success, fail);

        }
        else if (classname === "ApplicationPreferences") {

            if (method === "getSetting") {

                const key = appSettingMap[args[0].key];

                if(key) client.appApi?.getAppSetting( key ).then(success, fail);

            }
            else if (method === "setSetting") {


                const key = appSettingMap[args[0].key];
                const value = args[0].value;

                if(key)  client.appApi?.setAppSetting( key, value ).then(success, fail);

            }

        }

    };

    // ZebraPrintPlugin compatability shim
    if (!window.ZebraPrintPlugin) window.ZebraPrintPlugin = {};
    window.ZebraPrintPlugin.printTags = (labelJson, success, fail) => {

        client.appApi?.printLabels(JSON.parse(labelJson)).then(success, fail);

    };

    // Check if the label data already exists, in which case we got injected after the printing code and need to repeat it ourselves
    if (window.labelData && window.onDeviceReady) {
        window.onDeviceReady();
        window.onDeviceReady = () => { };
    }

})();
