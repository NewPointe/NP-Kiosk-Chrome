interface Window {
    hasRockCheckinClientAPI?: boolean;
    injectedRockCheckinClientAPI?: boolean;
    Cordova?: {
        exec?: (success: (data: any) => void, fail: (error: Error) => void, classname: string, method: string, args: any[]) => void;
    };
    ZebraPrintPlugin: {
        printTags?: (labelJson: string, success: (data: any) => void, fail: (error: Error) => void) => void;
    };
    onDeviceReady?: () => void;
    labelData?: any;
}

interface External {
    PrintLabels?: (labelJson: string) => void;
}
