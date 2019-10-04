'use strict';

import { IMessage } from "./lib/messaging/IMessage";
import { MessageType } from "./lib/messaging/MessageType";
import { MessagingService } from "./lib/messaging/MessagingService";
import { ICheckinLabel } from "./lib/printing/ICheckinLabel";
import { generateGuid } from "./lib/Util";
import { Setting } from "./lib/SettingsService";

const appSettingMap: Record<string, Setting> = {
    "checkin_address": Setting.CHECKIN_ADDRESS
};

interface MessageCorrelationData<TReq = any, TRes = any> {
    message: IMessage<TReq>;
    resolve: (value?: TRes | PromiseLike<TRes>) => void;
    reject: (reason?: any) => void;
}

export class Client extends MessagingService {

    private messageCorrelations = new Map<string, MessageCorrelationData>();

    constructor() {

        super();

        this.on(MessageType.ACTION_SUCCESS, this.handleSuccessMessage.bind(this));
        this.on(MessageType.ACTION_ERROR, this.handleFailMessage.bind(this));

    }

    private handleSuccessMessage(message: IMessage) {

        if (message.correlationId) {

            // Get the correlated message
            const correlation = this.messageCorrelations.get(message.correlationId);

            // Resolve it
            if (correlation) correlation.resolve(message.data);

            // Remove it's correlation
            this.messageCorrelations.delete(message.correlationId);

        }

    }

    private handleFailMessage(message: IMessage) {

        if (message.correlationId) {

            // Get the correlated message
            const correlation = this.messageCorrelations.get(message.correlationId);

            // Reject it
            if (correlation) correlation.reject(new Error(message.data.message));

            // Remove it's correlation
            this.messageCorrelations.delete(message.correlationId);

        }

    }

    public async printLabels(data: ICheckinLabel[]): Promise<void> {
        return new Promise((resolve, reject) => {

            // Build the message
            const message = {
                type: MessageType.PRINT_LABEL,
                correlationId: generateGuid(),
                data
            };

            // Save the message data so we can track responses
            this.messageCorrelations.set(message.correlationId, { message, resolve, reject });

            // Send or queue the message
            this.sendMessage(message);

        });
    }

    public async getSetting(data: { key: Setting; }): Promise<void> {
        return new Promise((resolve, reject) => {

            // Build the message
            const message = {
                type: MessageType.GET_APP_SETTING,
                correlationId: generateGuid(),
                data
            };

            // Save the message data so we can track responses
            this.messageCorrelations.set(message.correlationId, { message, resolve, reject });

            // Send or queue the message
            this.sendMessage(message);

        });
    }

    public async setSetting(data: { key: Setting; value: unknown }): Promise<void> {
        return new Promise((resolve, reject) => {

            // Build the message
            const message = {
                type: MessageType.SET_APP_SETTING,
                correlationId: generateGuid(),
                data
            };

            // Save the message data so we can track responses
            this.messageCorrelations.set(message.correlationId, { message, resolve, reject });

            // Send or queue the message
            this.sendMessage(message);

        });
    }

}

(() => {

    // Gaurd in case we're injected more than once
    if (window.hasRockCheckinClientAPI) return;
    window.hasRockCheckinClientAPI = true;

    // Create a new messenger
    const RockAPIMessenger = new Client();

    // Set up the API

    // Windows client compatability shim
    if (!window.external) (window as any).external = {};
    window.external.PrintLabels = (labelsJson) => {

        RockAPIMessenger.printLabels(JSON.parse(labelsJson));

    };

    // iOS client compatability shim
    if (!window.Cordova) window.Cordova = {};
    window.Cordova.exec = (success, fail, classname, method, args) => {

        if (classname === "ZebraPrint" && method === "printTags") {

            RockAPIMessenger.printLabels(JSON.parse(args[0])).then(success, fail);

        }
        else if (classname === "ApplicationPreferences") {

            if (method === "getSetting") {

                const key = appSettingMap[args[0].key];

                if(key) RockAPIMessenger.getSetting({ key }).then(success, fail);

            }
            else if (method === "setSetting") {


                const key = appSettingMap[args[0].key];
                const value = args[0].value;

                if(key)  RockAPIMessenger.setSetting({ key, value }).then(success, fail);

            }

        }

    };

    // ZebraPrintPlugin compatability shim
    if (!window.ZebraPrintPlugin) window.ZebraPrintPlugin = {};
    window.ZebraPrintPlugin.printTags = (labelJson, success, fail) => {

        RockAPIMessenger.printLabels(JSON.parse(labelJson)).then(success, fail);

    };

    // Check if the label data already exists, in which case we got injected after the printing code and need to repeat it ourselves
    if (window.labelData && window.onDeviceReady) {
        window.onDeviceReady();
        window.onDeviceReady = () => { };
    }

})();
