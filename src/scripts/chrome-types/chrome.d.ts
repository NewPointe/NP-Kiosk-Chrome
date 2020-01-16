
//==============================//
//        webview Types         //
//==============================//

/**
 * Since Chrome 33.
 *
 * Options that determine what data should be cleared by `clearData`.
 */
interface ClearDataOptions {

    /**
     * Clear data accumulated on or after this date, represented in milliseconds since the epoch (accessible via the getTime method of the JavaScript `Date` object). If absent, defaults to 0 (which would remove all browsing data).
     */
    since?: number;

}

/**
 * Since Chrome 33.
 *
 * A set of data types. Missing properties are interpreted as `false`.
 */
interface ClearDataTypeSet {

    /**
     * Websites' appcaches.
     */
    appcache?: boolean;

    /**
     * The browser's cache. Note: when removing data, this clears the entire cache; it is not limited to the range you specify.
     */
    cache?: boolean;

    /**
     * The partition's cookies.
     */
    cookies?: boolean;

    /**
     * The partition's session cookies.
     */
    sessionCookies?: boolean;

    /**
     * The partition's persistent cookies.
     */
    persistentCookies?: boolean;

    /**
     * Websites' filesystems.
     */
    fileSystems?: boolean;

    /**
     * Websites' IndexedDB data.
     */
    indexedDB?: boolean;

    /**
     * Websites' local storage data.
     */
    localStorage?: boolean;

    /**
     * Websites' WebSQL data.
     */
    webSQL?: boolean;

}

/**
 * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts.
 */
type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "image" | "video" | "audio";

/**
 * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time.
 */
interface InjectDetails {

    /**
     * JavaScript or CSS code to inject.
     *
     * **Warning:** Be careful using the `code` parameter. Incorrect use of it may open your app to [cross site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
     */
    code?: string;

    /**
     *  JavaScript or CSS file to inject.
     */
    file?: string;

}

/**
 * Since Chrome 44.
 *
 * The type of injection item: code or a set of files.
 */
interface InjectionItems {

    /**
     * JavaScript code or CSS to be injected into matching pages.
     */
    code?: string;

    /**
     * The list of JavaScript or CSS files to be injected into matching pages. These are injected in the order they appear in this array.
     */
    files?: string[];

}

/**
 * Since Chrome 44.
 *
 * Details of the content script to inject. Refer to the [content scripts](https://developer.chrome.com/extensions/content_scripts) documentation for more details.
 */
interface ContentScriptDetails {

    /**
     * The name of the content script to inject.
     */
    name: string;

    /**
     * Specifies which pages this content script will be injected into.
     */
    matches: string[];

    /**
     * Excludes pages that this content script would otherwise be injected into.
     */
    exclude_matches?: string[];

    /**
     * Whether to insert the content script on about:blank and about:srcdoc. Content scripts will only be injected on pages when their inherit URL is matched by one of the declared patterns in the matches field. The inherit URL is the URL of the document that created the frame or window. Content scripts cannot be inserted in sandboxed frames.
     */
    match_about_blank?: boolean;

    /**
     * The CSS code or a list of CSS files to be injected into matching pages. These are injected in the order they appear, before any DOM is constructed or displayed for the page.
     */
    css?: InjectionItems;

    /**
     * The JavaScript code or a list of JavaScript files to be injected into matching pages. These are injected in the order they appear.
     */
    js?: InjectionItems;

    /**
     * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
     */
    run_at?: "document_start" | "document_end" | "document_idle";

    /**
     * If `all_frames` is `true`, this implies that the JavaScript or CSS should be injected into all frames of current page. By default, `all_frames` is `false` and the JavaScript or CSS is only injected into the top frame.
     */
    all_frames?: boolean;

    /**
     * Applied after matches to include only those URLs that also match this glob. Intended to emulate the @include Greasemonkey keyword.
     */
    include_globs?: string[];

    /**
     * Applied after matches to exclude URLs that match this glob. Intended to emulate the @exclude Greasemonkey keyword.
     */
    exclude_globs?: string[];

}

interface _ContextMenuCreatePropertiesOnClickCallbackInfo {

    /**
     * The ID of the menu item that was clicked.
     */
    menuItemId: number | string;

    /**
     * The parent ID, if any, for the item clicked.
     */
    parentMenuItemId?: number | string;

    /**
     * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
     */
    mediaType?: string;

    /**
     * If the element is a link, the URL it points to.
     */
    linkUrl?: string;

    /**
     * Will be present for elements with a 'src' URL.
     */
    srcUrl?: string;

    /**
     * The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
     */
    pageUrl?: string;

    /**
     * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
     */
    frameUrl?: string;

    /**
     * The ID of the frame of the element where the context menu was clicked, if it was in a frame.
     */
    frameId?: number;

    /**
     * The text for the context selection, if any.
     */
    selectionText?: string;

    /**
     * A flag indicating whether the element is editable (text input, textarea, etc.).
     */
    editable: boolean;

    /**
     * A flag indicating the state of a checkbox or radio item before it was clicked.
     */
    wasChecked?: boolean;

    /**
     * A flag indicating the state of a checkbox or radio item after it is clicked.
     */
    checked?: boolean;

}

/**
 * Since Chrome 44.
 */
interface ContextMenuCreateProperties {

    /**
     * The type of menu item. Defaults to 'normal' if not specified.
     */
    type?: "normal" | "checkbox" | "radio" | "separator";

    /**
     * The unique ID to assign to this item. Mandatory for event pages. Cannot be the same as another ID for this extension.
     */
    id?: string;

    /**
     * The text to be displayed in the item; this is required unless type is 'separator'. When the context is 'selection', you can use %s within the string to show the selected text. For example, if this parameter's value is "Translate '%s' to Pig Latin" and the user selects the word "cool", the context menu item for the selection is "Translate 'cool' to Pig Latin".
     */
    title?: string;

    /**
     * The initial state of a checkbox or radio item: true for selected and false for unselected. Only one radio item can be selected at a time in a given group of radio items.
     */
    checked?: boolean;

    /**
     * List of contexts this menu item will appear in. Defaults to ['page'] if not specified.
     */
    contexts?: ContextType[];

    /**
     * A function that will be called back when the menu item is clicked.
     */
    onclick?: (info: _ContextMenuCreatePropertiesOnClickCallbackInfo) => void;

    /**
     * The ID of a parent menu item; this makes the item a child of a previously added item.
     */
    parentId?: number | string;

    /**
     * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see [Match Patterns](https://developer.chrome.com/apps/tags/match_patterns).
     */
    documentUrlPatterns?: string[];

    /**
     * Similar to documentUrlPatterns, but lets you filter based on the `src` attribute of img/audio/video tags and the `href` of anchor tags.
     */
    targetUrlPatterns?: string[];

    /**
     * Whether this context menu item is enabled or disabled. Defaults to true.
     */
    enabled?: boolean;

}

interface ContextMenuUpdateProperties {

    /**
     * The type of menu item. Defaults to 'normal' if not specified.
     */
    type?: "normal" | "checkbox" | "radio" | "separator";

    /**
     * The text to be displayed in the item; this is required unless type is 'separator'. When the context is 'selection', you can use %s within the string to show the selected text. For example, if this parameter's value is "Translate '%s' to Pig Latin" and the user selects the word "cool", the context menu item for the selection is "Translate 'cool' to Pig Latin".
     */
    title?: string;

    /**
     * The initial state of a checkbox or radio item: true for selected and false for unselected. Only one radio item can be selected at a time in a given group of radio items.
     */
    checked?: boolean;

    /**
     * List of contexts this menu item will appear in. Defaults to ['page'] if not specified.
     */
    contexts?: ContextType[];

    /**
     * A function that will be called back when the menu item is clicked.
     */
    onclick?: (info: _ContextMenuCreatePropertiesOnClickCallbackInfo) => void;

    /**
     * The ID of a parent menu item; this makes the item a child of a previously added item.
     */
    parentId?: number | string;

    /**
     * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see [Match Patterns](https://developer.chrome.com/apps/tags/match_patterns).
     */
    documentUrlPatterns?: string[];

    /**
     * Similar to documentUrlPatterns, but lets you filter based on the `src` attribute of img/audio/video tags and the `href` of anchor tags.
     */
    targetUrlPatterns?: string[];

    /**
     * Whether this context menu item is enabled or disabled. Defaults to true.
     */
    enabled?: boolean;

}

/**
 * Since Chrome 44.
 */
interface ContextMenus {

    /**
     * Fired before showing a context menu on this `webview`. Can be used to disable this context menu by calling `event.preventDefault()`.
     */
    onShow: {
        addListener(callback: (event: Event) => void): void;
    };

    /**
     * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in `chrome.runtime.lastError`).
     * @param createProperties The properties used to create the item
     * @param callback Called when the item has been created in the browser. If there were any problems creating the item, details will be available in `chrome.runtime.lastError`.
     */
    create(createProperties: ContextMenuCreateProperties, callback?: () => void): void;

    /**
     * Updates a previously created context menu item.
     * @param id The ID of the item to update.
     * @param updateProperties The properties to update. Accepts the same values as the create function.
     * @param callback Called when the context menu has been updated.
     */
    update(id: number | string, updateProperties: ContextMenuUpdateProperties, callback?: () => void): void;

    /**
     * Removes all context menu items added to this `webview`.
     * @param callback Called when removal is complete.
     */
    removeAll(callback?: () => void): void;


}

/**
 * Messaging handle to a guest window.
 */
interface ContentWindow extends Window {

    /**
     * Posts a message to the embedded web content as long as the embedded content is displaying a page from the target origin. This method is available once the page has completed loading. Listen for the [contentload](https://developer.chrome.com/apps/tags/webview#event-contentload) event and then call the method.
     *
     * The guest will be able to send replies to the embedder by posting message to `event.source` on the message event it receives.
     *
     * This API is identical to the [HTML5 postMessage API](https://developer.mozilla.org/en-US/docs/DOM/window.postMessage) for communication between web pages. The embedder may listen for replies by adding a `message` event listener to its own frame.
     * @param message Message object to send to the guest.
     * @param targetOrigin Specifies what the origin of the guest window must be for the event to be dispatched.
     */
    postMessage(message: any, targetOrigin: string): void;

}

/**
 * Since Chrome 33.
 *
 * Interface attached to `dialog` DOM events.
 */
interface DialogController {

    /**
     * Accept the dialog. Equivalent to clicking OK in an `alert`, `confirm`, or `prompt` dialog.
     * @param response The response string to provide to the guest when accepting a `prompt` dialog.
     */
    ok(response?: string): void;

    /**
     * Reject the dialog. Equivalent to clicking Cancel in a `confirm` or `prompt` dialog.
     */
    cancel(): void;

}

/**
 * Since Chrome 35.
 *
 * Contains all of the results of the find request.
 */
interface FindCallbackResults {

    /**
     * The number of times `searchText` was matched on the page.
     */
    numberOfMatches: number;

    /**
     * The ordinal number of the current match.
     */
    activeMatchOrdinal: number;

    /**
     * Describes a rectangle around the active match in screen coordinates.
     */
    selectionRect: SelectionRect;

    /**
     * Indicates whether this find request was canceled.
     */
    canceled: boolean;

}

/**
 * Since Chrome 35.
 *
 * Options for the find request.
 */
interface FindOptions {

    /**
     * Flag to find matches in reverse order. The default value is `false`.
     */
    backward?: boolean;

    /**
     * Flag to match with case-sensitivity. The default value is `false`.
     */
    matchCase?: boolean;

}

/**
 * Interface attached to `newwindow` DOM events.
 */
interface NewWindow {

    /**
     * Attach the requested target page to an existing webview element.
     * @param webview The `webview` element to which the target page should be attached.
     */
    attach(webview: object): void;

    /**
     * Cancel the new window request.
     */
    discard(): void;

}

/**
 * The type of `request` object which accompanies a `media` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface MediaPermissionRequest {

    /**
     * The URL of the frame requesting access to user media.
     */
    url: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request. This is the default behavior if `allow` is not called.
     */
    deny(): void;

}

/**
 * The type of `request` object which accompanies a `geolocation` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface GeolocationPermissionRequest {

    /**
     * The URL of the frame requesting access to geolocation data.
     */
    url: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request. This is the default behavior if `allow` is not called.
     */
    deny(): void;

}

/**
 * The type of `request` object which accompanies a `pointerLock` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface PointerLockPermissionRequest {

    /**
     * Whether or not pointer lock was requested as a result of a user input gesture.
     */
    userGesture: boolean;

    /**
     * Whether or not the requesting frame was the most recent client to hold pointer lock.
     */
    lastUnlockedBySelf: boolean;

    /**
     * The URL of the frame requesting pointer lock.
     */
    url: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request. This is the default behavior if `allow` is not called.
     */
    deny(): void;

}

/**
 * The type of `request` object which accompanies a `download` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface DownloadPermissionRequest {

    /**
     * The HTTP request type (e.g. `GET`) associated with the download request.
     */
    requestMethod: string;

    /**
     * The requested download URL.
     */
    url: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request. This is the default behavior if `allow` is not called.
     */
    deny(): void;

}

/**
 * Since Chrome 37.
 *
 * The type of `request` object which accompanies a `filesystem` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface FileSystemPermissionRequest {

    /**
     * The URL of the frame requesting access to local file system.
     */
    url: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request.
     */
    deny(): void;

}

/**
 * Since Chrome 43.
 *
 * The type of `request` object which accompanies a `fullscreen` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface FullscreenPermissionRequest {

    /**
     * The origin of the frame inside the webview that initiated the fullscreen request.
     */
    origin: string;

    /**
     * Allow the permission request.
     */
    allow(): void;

    /**
     * Deny the permission request.
     */
    deny(): void;

}

/**
 * Since Chrome 33.
 *
 * The type of `request` object which accompanies a `loadplugin` [permissionrequest](https://developer.chrome.com/apps/tags/webview#event-permissionrequest) DOM event.
 */
interface LoadPluginPermissionRequest {

    /**
     * The plugin's identifier string.
     */
    identifier: string;

    /**
     * The plugin's display name.
     */
    name: string;

    /**
     * Allow the permission request. This is the default behavior if `deny` is not called..
     */
    allow(): void;

    /**
     * Deny the permission request.
     */
    deny(): void;

}

/**
 * Since Chrome 35.
 *
 * Describes a rectangle in screen coordinates.
 *
 * The containment semantics are array-like; that is, the coordinate `(left, top)` is considered to be contained by the rectangle, but the coordinate `(left + width, top)` is not.
 */
interface SelectionRect {

    /**
     * Distance from the left edge of the screen to the left edge of the rectangle.
     */
    left: number;

    /**
     * Distance from the top edge of the screen to the top edge of the rectangle.
     */
    top: number;

    /**
     * Width of the rectangle.
     */
    width: number;

    /**
     * Height of the rectangle.
     */
    height: number;

}

/**
 * Since Chrome 33.
 */
interface WebRequestEventInterface {

}

/**
 * Defines the how zooming is handled in the `webview`.
 *
 * - `"per-origin"` - Zoom changes will persist in the zoomed page's origin, i.e. all other webviews in the same partition that are navigated to that same origin will be zoomed as well. Moreover, `per-origin` zoom changes are saved with the origin, meaning that when navigating to other pages in the same origin, they will all be zoomed to the same zoom factor.
 *
 * - `"per-view"` - Zoom changes only take effect in this webview, and zoom changes in other webviews will not affect the zooming of this webview. Also, `per-view` zoom changes are reset on navigation; navigating a webview will always load pages with their per-origin zoom factors (within the scope of the partition).
 *
 * - `"disabled"` - Disables all zooming in the webview. The content will revert to the default zoom level, and all attempted zoom changes will be ignored.
 */
type ZoomMode = "per-origin" | "per-view" | "disabled";

//==============================//
//        webview Events        //
//==============================//

/**
 * Fired when the guest window logs a console message.
 */
interface ConsoleMessageEvent extends Event {

    /**
     * The severity level of the log message. Ranges from -1 to 2. LOG_VERBOSE (console.debug) = -1, LOG_INFO (console.log, console.info) = 0, LOG_WARNING (console.warn) = 1, LOG_ERROR (console.error) = 2.
     */
    level: number;

    /**
     * The logged message contents.
     */
    message: string;

    /**
     * The line number of the message source.
     */
    line: number;

    /**
     * A string identifying the resource which logged the message.
     */
    sourceId: string;

}

/**
 * Fired when the guest window attempts to open a modal dialog via `window.alert`, `window.confirm`, or `window.prompt`.
 *
 * Handling this event will block the guest process until each event listener returns or the `dialog` object becomes unreachable (if `preventDefault()` was called.)
 *
 * The default behavior is to cancel the dialog.
 */
interface DialogEvent extends Event {

    /**
     * The type of modal dialog requested by the guest.
     */
    messageType: "alert" | "confirm" | "prompt";

    /**
     * The text the guest attempted to display in the modal dialog.
     */
    messageText: string;

    /**
     * An interface that can be used to respond to the guest's modal request.
     */
    dialog: DialogController;

}

/**
 * Fired when the process rendering the guest web content has exited.
 */
interface ExitEvent extends Event {

    /**
     * Chrome's internal ID of the process that exited.
     */
    processID: number;

    /**
     * String indicating the reason for the exit.
     */
    reason: "normal" | "abnormal" | "crash" | "kill";

}

/**
 * Fired when new find results are available for an active find request. This might happen multiple times for a single find request as matches are found.
 */
interface FindUpdateEvent extends Event {

    /**
     * The string that is being searched for in the page.
     */
    searchText: string;

    /**
     * The number of matches found for searchText on the page so far.
     */
    numberOfMatches: number;

    /**
     * The ordinal number of the current active match, if it has been found. This will be 0 until then.
     */
    activeMatchOrdinal: number;

    /**
     * Describes a rectangle around the active match, if it has been found, in screen coordinates.
     */
    selectionRect: SelectionRect;

    /**
     * Indicates whether the find request was canceled.
     */
    canceled: boolean;

    /**
     * Indicates that all find requests have completed and that no more findupdate events will be fired until more find requests are made.
     */
    finalUpdate: string;

}

/**
 * Fired when a top-level load has aborted without committing. An error message will be printed to the console unless the event is default-prevented.
 *
 * **Note:** When a resource load is aborted, a `loadabort` event will eventually be followed by a `loadstop` event, even if all committed loads since the last `loadstop` event (if any) were aborted.
 *
 * **Note:** When the load of either an about URL or a JavaScript URL is aborted, `loadabort` will be fired and then the `webview` will be navigated to 'about:blank'.
 */
interface LoadAbortEvent extends Event {

    /**
     * Requested URL.
     */
    url: string;

    /**
     * Whether the load was top-level or in a subframe.
     */
    isTopLevel: boolean;

    /**
     * Unique integer ID for the type of abort. Note that this ID is *not* guaranteed to remain backwards compatible between releases. You must not act based upon this specific integer.
     */
    code: number;

    /**
     * String indicating what type of abort occurred. This string is *not* guaranteed to remain backwards compatible between releases. You must not parse and act based upon its content. It is also possible that, in some cases, an error not listed here could be reported.
     */
    reason: "ERR_ABORTED" | "ERR_INVALID_URL" | "ERR_DISALLOWED_URL_SCHEME" | "ERR_BLOCKED_BY_CLIENT" | "ERR_ADDRESS_UNREACHABLE" | "ERR_EMPTY_RESPONSE" | "ERR_FILE_NOT_FOUND" | "ERR_UNKNOWN_URL_SCHEME";

}

/**
 * Fired when a load has committed. This includes navigation within the current document as well as subframe document-level loads, but does *not* include asynchronous resource loads.
 */
interface LoadCommitEvent extends Event {

    /**
     * The URL that committed.
     */
    url: string;

    /**
     * Whether the load is top-level or in a subframe.
     */
    isTopLevel: boolean;

}

/**
 * Fired when a top-level load request has redirected to a different URL.
 */
interface LoadRedirectEvent extends Event {

    /**
     * The requested URL before the redirect.
     */
    oldUrl: string;

    /**
     * The new URL after the redirect.
     */
    newUrl: string;

    /**
     * Whether or not the redirect happened at top-level or in a subframe.
     */
    isTopLevel: boolean;

}

/**
 * Fired when a load has begun.
 */
interface LoadStartEvent extends Event {

    /**
     * Requested URL.
     */
    url: string;

    /**
     * Whether the load is top-level or in a subframe.
     */
    isTopLevel: boolean;

}

/**
 * Fired when all frame-level loads in a guest page (including all its subframes) have completed. This includes navigation within the current document as well as subframe document-level loads, but does not include asynchronous resource loads. This event fires every time the number of document-level loads transitions from one (or more) to zero. For example, if a page that has already finished loading (i.e., `loadstop` already fired once) creates a new iframe which loads a page, then a second `loadstop` will fire when the iframe page load completes. This pattern is commonly observed on pages that load ads.
 *
 * **Note:** When a committed load is aborted, a `loadstop` event will eventually follow a `loadabort` event, even if all committed loads since the last `loadstop` event (if any) were aborted.
 */
interface LoadStopEvent extends Event {

}

/**
 * Fired when the guest page attempts to open a new browser window.
 */
interface NewWindowEvent extends Event {

    /**
     * An interface that can be used to either attach the requested target page to an existing webview element or explicitly discard the request.
     */
    window: NewWindow;

    /**
     * The target URL requested for the new window.
     */
    targetUrl: string;

    /**
     * The initial width requested for the new window.
     */
    initialWidth: number;

    /**
     * The initial height requested for the new window.
     */
    initialHeight: number;

    /**
     * The requested name of the new window.
     */
    name: string;

    /**
     * The requested disposition of the new window.
     */
    windowOpenDisposition: "ignore" | "save_to_disk" | "current_tab" | "new_background_tab" | "new_foreground_tab" | "new_window" | "new_popup";

}

interface _PermissionRequestTypeMap {
    "media": MediaPermissionRequest;
    "geolocation": GeolocationPermissionRequest;
    "pointerLock": PointerLockPermissionRequest;
    "download": DownloadPermissionRequest;
    "loadplugin": LoadPluginPermissionRequest;
    "filesystem": FileSystemPermissionRequest;
    "fullscreen": FullscreenPermissionRequest;
}

/**
 * Fired when the guest page needs to request special permission from the embedder.
 */
interface PermissionRequestEvent<T extends keyof _PermissionRequestTypeMap = keyof _PermissionRequestTypeMap> extends Event {

    /**
     * The type of permission being requested.
     */
    permission: T;

    /**
     * An object which holds details of the requested permission.
     */
    request: _PermissionRequestTypeMap[T];

}

/**
 * Fired when the process rendering the guest web content has become responsive again after being unresponsive.
 */
interface ResponsiveEvent extends Event {

    /**
     * Chrome's internal ID of the process that became responsive.
     */
    processID: number;

}

/**
 * Fired when the embedded web content has been resized via `autosize`. Only fires if `autosize` is enabled.
 */
interface SizeChangedEvent extends Event {

    /**
     * Old width of embedded web content.
     */
    oldWidth: number;

    /**
     * Old height of embedded web content.
     */
    oldHeight: number;

    /**
     * New width of embedded web content.
     */
    newWidth: number;

    /**
     * New height of embedded web content.
     */
    newHeight: number;

}

/**
 * Fired when the process rendering the guest web content has become unresponsive. This event will be generated once with a matching responsive event if the guest begins to respond again.
 */
interface UnresponsiveEvent extends Event {

    /**
     * Chrome's internal ID of the process that became responsive.
     */
    processID: number;

}

/**
 * Fired when the page's zoom changes.
 */
interface ZoomChangeEvent extends Event {

    /**
     * The page's previous zoom factor.
     */
    oldZoomFactor: number;

    /**
     * The new zoom factor that the page was zoomed to.
     */
    newZoomFactor: number;

}


interface HTMLWebviewElementEventMap extends HTMLElementEventMap {
    "consolemessage": ConsoleMessageEvent;
    "contentload": Event;
    "dialog": DialogEvent;
    "exit": ExitEvent;
    "findupdate": FindUpdateEvent;
    "loadabort": LoadAbortEvent;
    "loadcommit": LoadCommitEvent;
    "loadredirect": LoadRedirectEvent;
    "loadstart": LoadStartEvent;
    "loadstop": LoadStopEvent;
    "newwindow": NewWindowEvent;
    "permissionrequest": PermissionRequestEvent;
    "responsive": ResponsiveEvent;
    "sizechanged": SizeChangedEvent;
    "unresponsive": UnresponsiveEvent;
    "zoomchange": ZoomChangeEvent;
}

//==============================//
//       webview Element        //
//==============================//

/**
 * Use the `webview` tag to actively load live content from the web over the network and embed it in your Chrome App. Your app can control the appearance of the `webview` and interact with the web content, initiate navigations in an embedded web page, react to error events that happen within it, and more (see [Usage](https://developer.chrome.com/apps/tags/webview#usage)).
 */
declare class HTMLWebviewElement extends HTMLElement {

    /**
     * Object reference which can be used to post messages into the guest page.
     */
    contentWindow: ContentWindow;

    /**
     * Interface which provides access to webRequest events on the guest page.
     */
    request: WebRequestEventInterface;

    /**
     * Similar to [chrome's ContextMenus API](https://developer.chrome.com/apps/tags/contextMenus), but applies to `webview` instead of browser. Use the `webview.contextMenus` API to add items to `webview`'s context menu. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
     */
    contextMenus: ContextMenus;

    /**
     * Queries audio state.
     * @param callback
     */
    getAudioState(callback: (audible: boolean) => void): void;

    /**
     * Sets audio mute state of the webview.
     * @param mute Mute audio value
     */
    setAudioMuted(mute: boolean): void;

    /**
     * Queries whether audio is muted.
     * @param callback
     */
    isAudioMuted(callback: (audible: boolean) => void): void;

    /**
     * Captures the visible region of the webview.
     * @param options Details about the format and quality of an image.
     * @param callback
     */
    captureVisibleRegion(callback: (dataUrl: string) => void): void;
    captureVisibleRegion(options: { format?: "jpeg" | "png", quality?: number }, callback: (dataUrl: string) => void): void;

    /**
     * Adds content script injection rules to the `webview`. When the `webview` navigates to a page matching one or more rules, the associated scripts will be injected. You can programmatically add rules or update existing rules.
     * @param contentScriptList Details of the content scripts to add.
     */
    addContentScripts(contentScriptList: ContentScriptDetails[]): void;

    /**
     * Navigates backward one history entry if possible. Equivalent to `go(-1)`.
     * @param callback Called after the navigation has either failed or completed successfully.
     */
    back(callback?: (success: boolean) => void): void;

    /**
     * Indicates whether or not it is possible to navigate backward through history. The state of this function is cached, and updated before each `loadcommit`, so the best place to call it is on `loadcommit`.
     */
    canGoBack(): boolean;

    /**
     * Indicates whether or not it is possible to navigate forward through history. The state of this function is cached, and updated before each `loadcommit`, so the best place to call it is on `loadcommit`.
     */
    canGoForward(): boolean;

    /**
     * Clears browsing data for the `webview` partition.
     * @param options Options determining which data to clear.
     * @param types The types of data to be cleared.
     * @param callback Called after the data has been successfully cleared.
     */
    clearData(options: ClearDataOptions, types: ClearDataTypeSet, callback?: () => void): void;

    /**
     * Injects JavaScript code into the guest page.
     * @param details Details of the script to run.
     * @param callback Called after all the JavaScript has been executed.
     */
    executeScript(details: InjectDetails, callback?: (result: any[]) => void): void;

    /**
     * Initiates a find-in-page request.
     * @param searchText The string to find in the page.
     * @param options Options for the find request.
     * @param callback Called after all find results have been returned for this find request.
     */
    find(searchText: string, options?: FindOptions, callback?: (results: FindCallbackResults) => void): void;

    /**
     * Navigates forward one history entry if possible. Equivalent to `go(1)`.
     * @param callback Called after the navigation has either failed or completed successfully.
     */
    forward(callback?: (success: boolean) => void): void;

    /**
     * Returns Chrome's internal process ID for the guest web page's current process, allowing embedders to know how many guests would be affected by terminating the process. Two guests will share a process only if they belong to the same app and have the same [storage partition ID](https://developer.chrome.com/apps/tags/webview#partition). The call is synchronous and returns the embedder's cached notion of the current process ID. The process ID isn't the same as the operating system's process ID.
     */
    getProcessId(): number;

    /**
     * Returns the user agent string used by the `webview` for guest page requests.
     */
    getUserAgent(): string;

    /**
     * Gets the current zoom factor.
     * @param callback Called after the current zoom factor is retrieved.
     */
    getZoom(callback: (zoomFactor: number) => void): void;

    /**
     * Gets the current zoom mode.
     * @param callback Called with the `webview`'s current zoom mode.
     */
    getZoomMode(callback: (ZoomMode: ZoomMode) => void): void;

    /**
     * Navigates to a history entry using a history index relative to the current navigation. If the requested navigation is impossible, this method has no effect.
     * @param relativeIndex Relative history index to which the webview should be navigated. For example, a value of `2` will navigate forward 2 history entries if possible; a value of `-3` will navigate backward 3 entries.
     * @param callback Called after the navigation has either failed or completed successfully.
     */
    go(relativeIndex: number, callback?: (success: boolean) => void): void;

    /**
     * Injects CSS into the guest page.
     * @param details Details of the CSS to insert.
     * @param callback Called after the CSS has been inserted.
     */
    insertCSS(details: InjectDetails, callback?: () => void): void;

    /**
     * Indicates whether or not the `webview`'s user agent string has been overridden by [webviewTag.setUserAgentOverride](https://developer.chrome.com/apps/tags/webview#method-setUserAgentOverride).
     */
    isUserAgentOverridden(): boolean;

    /**
     * Prints the contents of the `webview`. This is equivalent to calling scripted print function from the `webview` itself.
     */
    print(): void;

    /**
     * Reloads the current top-level page.
     */
    reload(): void;

    /**
     * Removes content scripts from a `webview`.
     * @param scriptNameList A list of names of content scripts that will be removed. If the list is empty, all the content scripts added to the `webview` will be removed.
     */
    removeContentScripts(scriptNameList?: string[]): void;

    /**
     * Override the user agent string used by the `webview` for guest page requests.
     * @param userAgent The user agent string to use.
     */
    setUserAgentOverride(userAgent: string): void;

    /**
     * Changes the zoom factor of the page. The scope and persistence of this change are determined by the webview's current zoom mode (see [webviewTag.ZoomMode](https://developer.chrome.com/apps/tags/webview#type-ZoomMode)).
     * @param zoomFactor The new zoom factor.
     * @param callback Called after the page has been zoomed.
     */
    setZoom(zoomFactor: number, callback?: () => void): void;

    /**
     * Sets the zoom mode of the `webview`.
     * @param ZoomMode Defines how zooming is handled in the `webview`.
     * @param callback Called after the zoom mode has been changed.
     */
    setZoomMode(ZoomMode: ZoomMode, callback?: () => void): void;

    /**
     * Stops loading the current `webview` navigation if in progress.
     */
    stop(): void;

    /**
     * Ends the current find session (clearing all highlighting) and cancels all find requests in progress.
     * @param action Determines what to do with the active match after the find session has ended. `clear` will clear the highlighting over the active match; `keep` will keep the active match highlighted; `activate` will keep the active match highlighted and simulate a user click on that match. The default action is `keep`.
     */
    stopFinding(action?: "clear" | "keep" | "activate"): void;

    /**
     * Loads a data URL with a specified base URL used for relative links. Optionally, a virtual URL can be provided to be shown to the user instead of the data URL.
     * @param dataUrl The data URL to load.
     * @param baseUrl The base URL that will be used for relative links.
     * @param virtualUrl The URL that will be displayed to the user (in the address bar).
     */
    loadDataWithBaseUrl(dataUrl: string, baseUrl: string, virtualUrl?: string): void;

    /**
     * Sets spatial navigation state of the webview.
     * @param enabled Spatial navigation state value.
     */
    setSpatialNavigationEnabled(enabled: boolean): void;

    /**
     * Queries whether spatial navigation is enabled for the webview.
     * @param callback
     */
    isSpatialNavigationEnabled(callback: (enabled: boolean) => void): void;

    /**
     * Forcibly kills the guest web page's renderer process. This may affect multiple `webview` tags in the current app if they share the same process, but it will not affect `webview` tags in other apps.
     */
    terminate(): void;

    addEventListener<K extends keyof HTMLWebviewElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLWebviewElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof HTMLWebviewElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLWebviewElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    src: string;

}

interface HTMLElementTagNameMap {
    "webview": HTMLWebviewElement;
}

//==============================//
//      chrome.app.runtime      //
//==============================//

/**
 * Description: Use the `chrome.app.runtime` API to manage the app lifecycle. The app runtime manages app installation, controls the event page, and can shut down the app at anytime.
 * Availability: Since Chrome 32.
 */
declare namespace chrome.app.runtime {
}

/**
 * Since Chrome 38.
 *
 * Fired when an embedding app requests to embed this app. This event is only available on dev channel with the flag --enable-app-view.
 */
declare namespace chrome.app.runtime.onEmbedRequested {

    interface _EmbedRequest {

        embedderId: string;

        /**
         * Optional developer specified data that the app to be embedded can use when making an embedding decision.
         */
        data?: any;

        /**
         * Allows `embedderId` to embed this app in an <appview> element. The `url` specifies the content to embed.
         * @param url
         */
        allow(url: string): void;

        /**
         * Prevents `embedderId` from embedding this app in an <appview> element.
         */
        deny(): void;

    }

    export function addListener(callback: (request: _EmbedRequest) => void): void;

}

/**
 * Fired when an app is launched from the launcher.
 */
declare namespace chrome.app.runtime.onLaunched {

    enum _LaunchSource {
        untracked = "untracked",
        app_launcher = "app_launcher",
        new_tab_page = "new_tab_page",
        reload = "reload",
        restart = "restart",
        load_and_launch = "load_and_launch",
        command_line = "command_line",
        file_handler = "file_handler",
        url_handler = "url_handler",
        system_tray = "system_tray",
        about_page = "about_page",
        keyboard = "keyboard",
        extensions_page = "extensions_page",
        management_api = "management_api",
        ephemeral_app = "ephemeral_app",
        background = "background",
        kiosk = "kiosk",
        chrome_internal = "chrome_internal",
        test = "test",
        installed_notification = "installed_notification",
        context_menu = "context_menu",
        arc = "arc"
    }

    interface _LaunchData {

        /**
         * The ID of the file or URL handler that the app is being invoked with. Handler IDs are the top-level keys in the `file_handlers` and/or `url_handlers` dictionaries in the manifest.
         */
        id?: string;

        /**
         * The file entries for the `onLaunched` event triggered by a matching file handler in the `file_handlers` manifest key.
         */
        items?: Array<{

            /**
             * Entry for the item.
             */
            entry: object;

            /**
             * The MIME type of the file.
             */
            type?: string;

        }>;

        /**
         * The URL for the `onLaunched` event triggered by a matching URL handler in the `url_handlers` manifest key.
         */
        url?: string;

        /**
         * The referrer URL for the `onLaunched` event triggered by a matching URL handler in the `url_handlers` manifest key.
         */
        referrerUrl?: string;

        /**
         * Whether the app is being launched in a [Chrome OS kiosk session](https://support.google.com/chromebook/answer/3134673).
         */
        isKioskSession?: boolean;

        /**
         * Since Chrome 47.
         *
         * Whether the app is being launched in a [Chrome OS public session](https://support.google.com/chrome/a/answer/3017014).
         */
        isPublicSession?: boolean;

        /**
         * Where the app is launched from.
         */
        source?: _LaunchSource;

        /**
         * Since Chrome 54.
         *
         * Contains data that specifies the `ActionType` this app was launched with. This is null if the app was not launched with a specific action intent.
         */
        actionData?: {

            /**
             * The user wants to quickly take a new note.
             */
            actionType: "new_note";

        };
    }

    export function addListener(callback: (launchData: _LaunchData) => void): void;

}

/**
 * Fired at Chrome startup to apps that were running when Chrome last shut down, or when apps have been requested to restart from their previous state for other reasons (e.g. when the user revokes access to an app's retained files the runtime will restart the app). In these situations if apps do not have an `onRestarted` handler they will be sent an `onLaunched` event instead.
 */
declare namespace chrome.app.runtime.onRestarted {

    export function addListener(callback: () => void): void;

}

//==============================//
//      chrome.app.window       //
//==============================//

/**
 * Description: Use the `chrome.app.window` API to create windows. Windows have an optional frame with title bar and size controls. They are not associated with any Chrome browser windows. See the [Window State Sample](https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/window-state) for a demonstration of these options.
 * Availability: Since Chrome 32.
 */
declare namespace chrome.app.window {

    export enum State {
        FULLSCREEN = "fullscreen",
        MAXIMIZED = "maximized",
        MINIMIZED = "minimized",
        NORMAL = "normal"
    }

    export enum WindowType {
        PANEL = "panel",
        SHELL = "shell"
    }

    /**
     * Since Chrome 35.
     */
    export interface ContentBounds {
        left?: number;
        top?: number;
        width?: number;
        height?: number;
    }

    /**
     * Since Chrome 35.
     */
    export interface BoundsSpecification {

        /**
         * The X coordinate of the content or window.
         */
        left?: number;

        /**
         * The Y coordinate of the content or window.
         */
        top?: number;

        /**
         * The width of the content or window.
         */
        width?: number;

        /**
         * The height of the content or window.
         */
        height?: number;

        /**
         * The minimum width of the content or window.
         */
        minWidth?: number;

        /**
         * The minimum height of the content or window.
         */
        minHeight?: number;

        /**
         * The maximum width of the content or window.
         */
        maxWidth?: number;

        /**
         * The maximum height of the content or window.
         */
        maxHeight?: number;

    }

    export interface Bounds {

        /**
         * This property can be used to read or write the current X coordinate of the content or window.
         */
        left: number;

        /**
         * This property can be used to read or write the current Y coordinate of the content or window.
         */
        top: number;

        /**
         * This property can be used to read or write the current width of the content or window.
         */
        width: number;

        /**
         * This property can be used to read or write the current height of the content or window.
         */
        height: number;

        /**
         * Since Chrome 35.
         *
         * This property can be used to read or write the current minimum width of the content or window. A value of null indicates 'unspecified'.
         */
        minWidth?: number | null;

        /**
         * Since Chrome 35.
         *
         * This property can be used to read or write the current minimum height of the content or window. A value of null indicates 'unspecified'.
         */
        minHeight?: number | null;

        /**
         * Since Chrome 35.
         *
         * This property can be used to read or write the current maximum width of the content or window. A value of null indicates 'unspecified'.
         */
        maxWidth?: number | null;

        /**
         * Since Chrome 35.
         *
         * This property can be used to read or write the current maximum height of the content or window. A value of null indicates 'unspecified'.
         */
        maxHeight?: number | null;

        /**
         * Since Chrome 35.
         *
         * Set the left and top position of the content or window.
         */
        setPosition: (left: number, top: number) => void;

        /**
         * Since Chrome 35.
         *
         * Set the width and height of the content or window.
         */
        setSize: (width: number, height: number) => void;

        /**
         * Since Chrome 35.
         *
         * Set the minimum size constraints of the content or window. The minimum width or height can be set to `null` to remove the constraint. A value of `undefined` will leave a constraint unchanged.
         */
        setMinimumSize: (minWidth?: number | null, minHeight?: number | null) => void;

        /**
         * Since Chrome 35.
         *
         * Set the maximum size constraints of the content or window. The maximum width or height can be set to `null` to remove the constraint. A value of `undefined` will leave a constraint unchanged.
         */
        setMaximumSize: (maxWidth?: number | null, maxHeight?: number | null) => void;

    }

    /**
     * Since Chrome 35.
     */
    export interface FrameOptions {

        /**
         * Frame type: `none` or `chrome` (defaults to `chrome`).
         *
         * For `none`, the `-webkit-app-region` CSS property can be used to apply draggability to the app's window.
         *
         * `-webkit-app-region: drag` can be used to mark regions draggable. `no-drag` can be used to disable this style on nested elements.
         */
        type?: "none" | "chrome";

        /**
         * Since Chrome 36.
         *
         * Allows the frame color to be set.
         */
        color?: string;

        /**
         * Since Chrome 36.
         *
         * Allows the frame color of the window when active to be set.
         */
        activeColor?: string;

        /**
         * Since Chrome 36.
         *
         * Allows the frame color of the window when inactive to be set differently to the active color.
         */
        inactiveColor?: string;

    }

    export interface CreateWindowOptions {

        /**
         * Id to identify the window. This will be used to remember the size and position of the window and restore that geometry when a window with the same id is later opened. If a window with a given id is created while another window with the same id already exists, the currently opened window will be focused instead of creating a new window.
         */
        id?: string;


        /**
         * Since Chrome 35.
         *
         * Used to specify the initial position, initial size and constraints of the window's content (excluding window decorations). If an `id` is also specified and a window with a matching `id` has been shown before, the remembered bounds will be used instead.
         *
         * Note that the padding between the inner and outer bounds is determined by the OS. Therefore setting the same bounds property for both the `innerBounds` and `outerBounds` will result in an error.
         */
        innerBounds?: BoundsSpecification;

        /**
         * Since Chrome 35.
         *
         * Used to specify the initial position, initial size and constraints of the window (including window decorations such as the title bar and frame). If an `id` is also specified and a window with a matching `id` has been shown before, the remembered bounds will be used instead.
         *
         * Note that the padding between the inner and outer bounds is determined by the OS. Therefore setting the same bounds property for both the `innerBounds` and `outerBounds` will result in an error.
         */
        outerBounds?: BoundsSpecification;

        /**
         * Minimum width of the window.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        minWidth?: number;

        /**
         * Minimum height of the window.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        minHeight?: number;

        /**
         * Maximum width of the window.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        maxWidth?: number;

        /**
         * Maximum height of the window.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        maxHeight?: number;

        /**
         * Type of window to create.
         *  - shell - Default window type.
         *  - panel - OS managed window (Deprecated).
         * @deprecated since Chrome 69. All app windows use the 'shell' window type
         */
        type?: "shell" | "panel";

        /**
         * Since Chrome 54.
         *
         * If true, the window will have its own shelf icon. Otherwise the window will be grouped in the shelf with other windows that are associated with the app. Defaults to false. If showInShelf is set to true you need to specify an id for the window.
         */
        showInShelf?: boolean;

        /**
         * Since Chrome 54.
         *
         * URL of the window icon. A window can have its own icon when showInShelf is set to true. The URL should be a global or an extension local URL.
         */
        icon?: string;

        /**
         * Use of `FrameOptions` is new in M36.
         */
        frame?: "none" | "chrome" | FrameOptions;

        /**
         * Size and position of the content in the window (excluding the titlebar). If an id is also specified and a window with a matching id has been shown before, the remembered bounds of the window will be used instead.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        bounds?: ContentBounds;

        /**
         * The initial state of the window, allowing it to be created already fullscreen, maximized, or minimized. Defaults to 'normal'.
         */
        state?: "normal" | "fullscreen" | "maximized" | "minimized";

        /**
         * If true, the window will be created in a hidden state. Call show() on the window to show it once it has been created. Defaults to false.
         */
        hidden?: boolean;

        /**
         * If true, the window will be resizable by the user. Defaults to true.
         */
        resizable?: boolean;

        /**
         * By default if you specify an id for the window, the window will only be created if another window with the same id doesn't already exist. If a window with the same id already exists that window is activated instead. If you do want to create multiple windows with the same id, you can set this property to false.
         * @deprecated since Chrome 34. Multiple windows with the same id is no longer supported.
         */
        singleton?: boolean;

        /**
         * If true, the window will stay above most other windows. If there are multiple windows of this kind, the currently focused window will be in the foreground. Requires the `alwaysOnTopWindows` permission. Defaults to false.
         *
         * Call `setAlwaysOnTop()` on the window to change this property after creation.
         */
        alwaysOnTop?: boolean;

        /**
         * Since Chrome 33.
         *
         * If true, the window will be focused when created. Defaults to true.
         */
        focused?: boolean;

        /**
         * Since Chrome 39.
         *
         * If true, and supported by the platform, the window will be visible on all workspaces.
         */
        visibleOnAllWorkspaces?: boolean;

    }

    interface AppWindow {

        /**
         * Focus the window.
         */
        focus(): void;

        /**
         * Fullscreens the window.
         *
         * The user will be able to restore the window by pressing ESC. An application can prevent the fullscreen state to be left when ESC is pressed by requesting the `app.window.fullscreen.overrideEsc` permission and canceling the event by calling .preventDefault(), in the keydown and keyup handlers, like this:
         * ```
         * window.onkeydown = window.onkeyup = function(e) { if (e.keyCode == 27 ) { e.preventDefault(); } };
         * ```
         *
         * Note `window.fullscreen()` will cause the entire window to become fullscreen and does not require a user gesture. The HTML5 fullscreen API can also be used to enter fullscreen mode (see [Web APIs](http://developer.chrome.com/apps/api_other.html) for more details).
         */
        fullscreen(): void;

        /**
         * Is the window fullscreen? This will be true if the window has been created fullscreen or was made fullscreen via the AppWindow or HTML5 fullscreen APIs.
         */
        isFullscreen(): boolean;

        /**
         * Minimize the window.
         */
        minimize(): void;

        /**
         * Is the window minimized?
         */
        isMinimized(): boolean;

        /**
         * Maximize the window.
         */
        maximize(): void;

        /**
         * Is the window maximized?
         */
        isMaximized(): boolean;

        /**
         * Restore the window, exiting a maximized, minimized, or fullscreen state.
         */
        restore(): void;

        /**
         * Move the window to the position (|left|, |top|).
         * @deprecated since Chrome 43. Use outerBounds.
         * @param left
         * @param top
         */
        moveTo(left: number, top: number): void;


        /**
         * Resize the window to |width|x|height| pixels in size.
         * @deprecated since Chrome 43. Use outerBounds.
         * @param width
         * @param height
         */
        resizeTo(width: number, height: number): void;

        /**
         * Draw attention to the window.
         */
        drawAttention(): void;

        /**
         * Clear attention to the window.
         */
        clearAttention(): void;

        /**
         * Close the window.
         */
        close(): void;

        /**
         * Show the window. Does nothing if the window is already visible. Focus the window if |focused| is set to true or omitted.
         * @param focused Since Chrome 34.
         */
        show(focused?: boolean): void;

        /**
         * Hide the window. Does nothing if the window is already hidden.
         */
        hide(): void;

        /**
         * Get the window's inner bounds as a [ContentBounds](https://developer.chrome.com/apps/app.window#type-ContentBounds) object.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         */
        getBounds(): ContentBounds;

        /**
         * Set the window's inner bounds.
         * @deprecated since Chrome 36. Use innerBounds or outerBounds.
         * @param bounds
         */
        setBounds(bounds: ContentBounds): void;

        /**
         * Is the window always on top?
         */
        isAlwaysOnTop(): boolean;

        /**
         * Set whether the window should stay above most other windows. Requires the `alwaysOnTopWindows` permission.
         */
        setAlwaysOnTop(alwaysOnTop: boolean): void;

        /**
         * Since Chrome 39.
         *
         * Set whether the window is visible on all workspaces. (Only for platforms that support this).
         */
        setVisibleOnAllWorkspaces(alwaysVisible: boolean): void;

        /**
         * The JavaScript 'window' object for the created child.
         */
        contentWindow: Window;

        /**
         * Since Chrome 33.
         *
         * The id the window was created with.
         */
        id: string;

        /**
         * Since Chrome 35.
         *
         *  The position, size and constraints of the window's content, which does not include window decorations. This property is new in Chrome 36.
         */
        innerBounds: Bounds;

        /**
         * Since Chrome 35.
         *
         * The position, size and constraints of the window, which includes window decorations, such as the title bar and frame. This property is new in Chrome 36.
         */
        outerBounds: Bounds;

        /**
         * Fired when the window is resized.
         */
        onAlphaEnabledChanged: _EventHolder;

        /**
         * Fired when the window is resized.
         */
        onBoundsChanged: _EventHolder;

        /**
         * Fired when the window is closed. Note, this should be listened to from a window other than the window being closed, for example from the background page. This is because the window being closed will be in the process of being torn down when the event is fired, which means not all APIs in the window's script context will be functional.
         */
        onClosed: _EventHolder;

        /**
         * Fired when the window is fullscreened (either via the AppWindow or HTML5 APIs).
         */
        onFullscreened: _EventHolder;

        /**
         * Fired when the window is maximized.
         */
        onMaximized: _EventHolder;

        /**
         * Fired when the window is minimized.
         */
        onMinimized: _EventHolder;

        /**
         * Fired when the window is restored from being minimized or maximized.
         */
        onRestored: _EventHolder;

    }

    /**
     * @param url
     * @param options
     * @param callback Called in the creating window (parent) before the load event is called in the created window (child). The parent can set fields or functions on the child usable from onload.
     */
    export function create(url: string, options?: CreateWindowOptions, callback?: (createdWindow: AppWindow) => void): void;

    /**
     * Returns an [AppWindow](https://developer.chrome.com/apps/app.window#type-AppWindow) object for the current script context (ie JavaScript 'window' object). This can also be called on a handle to a script context for another page, for example: otherWindow.chrome.app.window.current().
     */
    export function current(): AppWindow;

    /**
     * Since Chrome 33.
     *
     * Gets an array of all currently created app windows. This method is new in Chrome 33.
     */
    export function getAll(): AppWindow[];

    /**
     * Since Chrome 33.
     *
     * Gets an [AppWindow](https://developer.chrome.com/apps/app.window#type-AppWindow) with the given id. If no window with the given id exists null is returned. This method is new in Chrome 33.
     * @param id
     */
    export function get(id: string): AppWindow;

    /**
     * Since Chrome 42.
     *
     * Whether the current platform supports windows being visible on all workspaces.
     */
    export function canSetVisibleOnAllWorkspaces(): boolean;


    export const onAlphaEnabledChanged: _EventHolder;

    /**
     * Fired when the window is resized.
     */
    export const onBoundsChanged: _EventHolder;

    /**
     * Fired when the window is closed. Note, this should be listened to from a window other than the window being closed, for example from the background page. This is because the window being closed will be in the process of being torn down when the event is fired, which means not all APIs in the window's script context will be functional.
     */
    export const onClosed: _EventHolder;

    /**
     * Fired when the window is fullscreened (either via the AppWindow or HTML5 APIs).
     */
    export const onFullscreened: _EventHolder;

    /**
     * Fired when the window is maximized.
     */
    export const onMaximized: _EventHolder;

    /**
     * Fired when the window is minimized.
     */
    export const onMinimized: _EventHolder;

    /**
     * Fired when the window is restored from being minimized or maximized.
     */
    export const onRestored: _EventHolder;

}

interface _EventHolder<TCallback = () => void> {
    addListener(callback: TCallback): void;
    dispatch: unknown;
    hasListener: unknown;
    hasListeners: unknown;
    removeListener(callback: TCallback): void;
}

//==============================//
//      chrome.sockets.tcp      //
//==============================//

/**
 * Description: Use the `chrome.sockets.tcp` API to send and receive data over the network using TCP connections. This API supersedes the TCP functionality previously found in the `chrome.socket` API.
 * Availability: Since Chrome 33.
 * Manifest: `"sockets": {...}`
 */
declare namespace chrome.sockets.tcp {

    export interface SocketProperties {

        /**
         * Flag indicating if the socket is left open when the event page of the application is unloaded (see [Manage App Lifecycle](http://developer.chrome.com/apps/app_lifecycle.html)). The default value is "false." When the application is loaded, any sockets previously opened with persistent=true can be fetched with `getSockets`.
         */
        persistent?: boolean;

        /**
         * An application-defined string associated with the socket.
         */
        name?: string;

        /**
         * The size of the buffer used to receive data. The default value is 4096.
         */
        bufferSize?: number;

    }

    export interface SocketInfo {

        /**
         * The socket identifier.
         */
        socketId: number;

        /**
         * Flag indicating whether the socket is left open when the application is suspended (see `SocketProperties.persistent`).
         */
        persistent: boolean;

        /**
         * Application-defined string associated with the socket.
         */
        name?: string;

        /**
         * The size of the buffer used to receive data. If no buffer size has been specified explictly, the value is not provided.
         */
        bufferSize?: number;

        /**
         * Flag indicating whether a connected socket blocks its peer from sending more data (see `setPaused`).
         */
        paused: boolean;

        /**
         * Flag indicating whether the socket is connected to a remote peer.
         */
        connected: boolean;

        /**
         * If the underlying socket is connected, contains its local IPv4/6 address.
         */
        localAddress?: string;

        /**
         * If the underlying socket is connected, contains its local port.
         */
        localPort?: number;

        /**
         * If the underlying socket is connected, contains the peer/ IPv4/6 address.
         */
        peerAddress?: string;

        /**
         * If the underlying socket is connected, contains the peer port.
         */
        peerPort?: number;

    }

    /**
    * The result of the socket creation.
    */
    interface CreateInfo {

        /**
        * The ID of the newly created server socket. Note that socket IDs created from this API are not compatible with socket IDs created from other APIs, such as the deprecated [socket](https://developer.chrome.com/apps/socket) API.
        */
        socketId: number;

    }

    /**
     * Creates a TCP socket.
     * @param callback Called when the socket has been created.
     */
    export function create(callback: (createInfo: CreateInfo) => void): void;

    /**
     * Creates a TCP socket.
     * @param properties The socket properties (optional).
     * @param callback Called when the socket has been created.
     */
    export function create(properties: SocketProperties, callback: (createInfo: CreateInfo) => void): void;

    /**
     * Updates the socket properties.
     * @param socketId The socket identifier.
     * @param properties The properties to update.
     * @param callback Called when the properties are updated.
     */
    export function update(socketId: number, properties: SocketProperties, callback?: () => void): void;

    /**
     * Enables or disables the application from receiving messages from its peer. The default value is "false". Pausing a socket is typically used by an application to throttle data sent by its peer. When a socket is paused, no `onReceive` event is raised. When a socket is connected and un-paused, `onReceive` events are raised again when messages are received.
     * @param socketId
     * @param paused
     * @param callback Callback from the `setPaused` method.
     */
    export function setPaused(socketId: number, paused: boolean, callback?: () => void): void

    /**
     * Enables or disables the keep-alive functionality for a TCP connection.
     * @param socketId The socket identifier.
     * @param enable If true, enable keep-alive functionality.
     * @param callback Called when the setKeepAlive attempt is complete.
     */
    export function setKeepAlive(socketId: number, enable: boolean, callback: (result: number) => void): void;

    /**
     * Enables or disables the keep-alive functionality for a TCP connection.
     * @param socketId The socket identifier.
     * @param enable If true, enable keep-alive functionality.
     * @param delay Set the delay seconds between the last data packet received and the first keepalive probe. Default is 0.
     * @param callback Called when the setKeepAlive attempt is complete.
     */
    export function setKeepAlive(socketId: number, enable: boolean, delay: number, callback: (result: number) => void): void;

    /**
     * Sets or clears `TCP_NODELAY` for a TCP connection. Nagle's algorithm will be disabled when `TCP_NODELAY` is set.
     * @param socketId The socket identifier.
     * @param noDelay If true, disables Nagle's algorithm.
     * @param callback Called when the setNoDelay attempt is complete.
     */
    export function setNoDelay(socketId: number, noDelay: boolean, callback: (result: number) => void): void;

    /**
     * Connects the socket to a remote machine. When the `connect` operation completes successfully, `onReceive` events are raised when data is received from the peer. If a network error occurs while the runtime is receiving packets, a `onReceiveError` event is raised, at which point no more `onReceive` event will be raised for this socket until the `resume` method is called.
     * @param socketId The socket identifier.
     * @param peerAddress The address of the remote machine. DNS name, IPv4 and IPv6 formats are supported.
     * @param peerPort The port of the remote machine.
     * @param callback Called when the connect attempt is complete.
     */
    export function connect(socketId: number, peerAddress: string, peerPort: number, callback: (result: number) => void): void;

    /**
     * Disconnects the socket.
     * @param socketId The socket identifier.
     * @param callback Called when the disconnect attempt is complete.
     */
    export function disconnect(socketId: number, callback?: () => void): void;

    interface SecureOptions {

        /**
         * The minimum and maximum acceptable versions of TLS.
         */
        tlsVersion: {
            min: "tls1" | "tls1.1" | "tls1.2" | "tls1.3";
            max: "tls1" | "tls1.1" | "tls1.2" | "tls1.3";
        };

    }

    /**
     * Since Chrome 38.
     *
     * Start a TLS client connection over the connected TCP client socket.
     * @param socketId The existing, connected socket to use.
     * @param callback Called when the connection attempt is complete.
     */
    export function secure(socketId: number, callback: (result: number) => void): void;

    /**
     * Since Chrome 38.
     *
     * Start a TLS client connection over the connected TCP client socket.
     * @param socketId The existing, connected socket to use.
     * @param options Constraints and parameters for the TLS connection.
     * @param callback Called when the connection attempt is complete.
     */
    export function secure(socketId: number, options: SecureOptions, callback: (result: number) => void): void;

    /**
     * Result of the send method.
     */
    interface SendInfo {

        /**
         * The result code returned from the underlying network call. A negative value indicates an error.
         */
        resultCode: number;

        /**
         * The number of bytes sent (if result == 0)
         */
        bytesSent?: number;
    }

    /**
     * Sends data on the given TCP socket.
     * @param socketId The socket identifier.
     * @param data The data to send.
     * @param callback Called when the send operation completes.
     */
    export function send(socketId: number, data: ArrayBuffer, callback: (sendInfo: SendInfo) => void): void;

    /**
     * Closes the socket and releases the address/port the socket is bound to. Each socket created should be closed after use. The socket id is no no longer valid as soon at the function is called. However, the socket is guaranteed to be closed only when the callback is invoked.
     * @param socketId The socket identifier.
     * @param callback Called when the `close` operation completes.
     */
    export function close(socketId: number, callback?: () => void): void;

    /**
     * Retrieves the state of the given socket.
     * @param socketId The socket identifier.
     * @param callback Called when the socket state is available.
     */
    export function getInfo(socketId: number, callback: (socketInfo: SocketInfo) => void): void;

    /**
     * Retrieves the list of currently opened sockets owned by the application.
     * @param callback Called when the list of sockets is available.
     */
    export function getSockets(callback: (socketInfos: SocketInfo[]) => void): void;

    /**
     * The event data.
     */
    interface OnReceiveInfo {

        /**
         * The socket identifier.
         */
        socketId: number;

        /**
         * The data received, with a maxium size of `bufferSize`.
         */
        data: ArrayBuffer;

    }

    /**
     * Event raised when data has been received for a given socket.
     */
    export const onReceive: _EventHolder<(info: OnReceiveInfo) => void>;

    /**
     * The event data.
     */
    interface OnReceiveErrorInfo {

        /**
         * The socket identifier.
         */
        socketId: number;

        /**
         * The result code returned from the underlying network call.
         */
        resultCode: number;

    }

    /**
     * Event raised when a network error occured while the runtime was waiting for data on the socket address and port. Once this event is raised, the socket is set to `paused` and no more `onReceive` events are raised for this socket.
     */
    export const onReceiveError: _EventHolder<(info: OnReceiveErrorInfo) => void>;

}


//==============================//
//   chrome.sockets.tcpServer   //
//==============================//

/**
 * Description: Use the `chrome.sockets.tcpServer` API to create server applications using TCP connections. This API supersedes the TCP functionality previously found in the `chrome.socket` API.
 * Availability: Since Chrome 33.
 * Manifest: `"sockets": {...}`
 */
declare namespace chrome.sockets.tcpServer {

    export interface SocketProperties {

        /**
         * Flag indicating if the socket is left open when the event page of the application is unloaded (see [Manage App Lifecycle](http://developer.chrome.com/apps/app_lifecycle.html)). The default value is "false." When the application is loaded, any sockets previously opened with persistent=true can be fetched with `getSockets`.
         */
        persistent?: boolean;

        /**
         * An application-defined string associated with the socket.
         */
        name?: string;

    }

    export interface SocketInfo {

        /**
         * The socket identifier.
         */
        socketId: number;

        /**
         * Flag indicating whether the socket is left open when the application is suspended (see `SocketProperties.persistent`).
         */
        persistent: boolean;

        /**
         * Application-defined string associated with the socket.
         */
        name?: string;

        /**
         * Flag indicating whether connection requests on a listening socket are dispatched through the `onAccept` event or queued up in the listen queue backlog. See `setPaused`. The default value is "false".
         */
        paused: boolean;

        /**
         * If the socket is listening, contains its local IPv4/6 address.
         */
        localAddress?: string;

        /**
         * If the socket is listening, contains its local port.
         */
        localPort?: number;

    }

    /**
     * The result of the socket creation.
     */
    interface CreateInfo {

        /**
         * The ID of the newly created server socket. Note that socket IDs created from this API are not compatible with socket IDs created from other APIs, such as the deprecated [socket](https://developer.chrome.com/apps/socket) API.
         */
        socketId: number;

    }

    /**
     * Creates a TCP server socket.
     * @param callback Called when the socket has been created.
     */
    export function create(callback: (createInfo: CreateInfo) => void): void;

    /**
     * Creates a TCP server socket.
     * @param properties The socket properties (optional).
     * @param callback Called when the socket has been created.
     */
    export function create(properties: SocketProperties, callback: (createInfo: CreateInfo) => void): void;

    /**
     * Updates the socket properties.
     * @param socketId The socket identifier.
     * @param properties The properties to update.
     * @param callback Called when the properties are updated.
     */
    export function update(socketId: number, properties: SocketProperties, callback?: () => void): void;

    /**
     * Enables or disables a listening socket from accepting new connections. When paused, a listening socket accepts new connections until its backlog (see `listen` function) is full then refuses additional connection requests. `onAccept` events are raised only when the socket is un-paused.
     * @param socketId
     * @param paused
     * @param callback Callback from the `setPaused` method.
     */
    export function setPaused(socketId: number, paused: boolean, callback?: () => void): void

    /**
     * Called when listen operation completes.
     * @callback listenCallback
     * @param result The result code returned from the underlying network call. A negative value indicates an error.
     */

    /**
     * Listens for connections on the specified port and address. If the port/address is in use, the callback indicates a failure.
     * @param socketId The socket identifier.
     * @param address The address of the local machine.
     * @param port The port of the local machine. When set to 0, a free port is chosen dynamically. The dynamically allocated port can be found by calling getInfo.
     * @param backlog Length of the socket's listen queue. The default value depends on the Operating System (SOMAXCONN), which ensures a reasonable queue length for most applications.
     * @param {listenCallback} callback Called when listen operation completes.
     */
    export function listen(socketId: number, address: string, port: number, backlog: number, callback: (result: number) => void): void;

    /**
     * Listens for connections on the specified port and address. If the port/address is in use, the callback indicates a failure.
     * @param socketId The socket identifier.
     * @param address The address of the local machine.
     * @param port The port of the local machine. When set to 0, a free port is chosen dynamically. The dynamically allocated port can be found by calling getInfo.
     * @param {listenCallback} callback Called when listen operation completes.
     */
    export function listen(socketId: number, address: string, port: number, callback: (result: number) => void): void;

    /**
     * Disconnects the listening socket, i.e. stops accepting new connections and releases the address/port the socket is bound to. The socket identifier remains valid, e.g. it can be used with `listen` to accept connections on a new port and address.
     * @param socketId The socket identifier.
     * @param callback Called when the disconnect attempt is complete.
     */
    export function disconnect(socketId: number, callback?: () => void): void;

    /**
     * Disconnects and destroys the socket. Each socket created should be closed after use. The socket id is no longer valid as soon at the function is called. However, the socket is guaranteed to be closed only when the callback is invoked.
     * @param socketId The socket identifier.
     * @param callback Called when the `close` operation completes.
     */
    export function close(socketId: number, callback?: () => void): void;

    /**
     * Retrieves the state of the given socket.
     * @param socketId The socket identifier.
     * @param callback Called when the socket state is available.
     */
    export function getInfo(socketId: number, callback: (socketInfo: SocketInfo) => void): void;

    /**
     * Retrieves the list of currently opened sockets owned by the application.
     * @param callback Called when the list of sockets is available.
     */
    export function getSockets(callback: (socketInfos: SocketInfo[]) => void): void;

    /**
     * The event data.
     */
    interface OnAcceptInfo {

        /**
         * The server socket identifier.
         */
        socketId: number;

        /**
         * The client socket identifier, i.e. the socket identifier of the newly established connection. This socket identifier should be used only with functions from the `chrome.sockets.tcp` namespace. Note the client socket is initially paused and must be explictly un-paused by the application to start receiving data.
         */
        clientSocketId: number;

    }

    /**
     * Event raised when a connection has been made to the server socket.
     */
    export const onAccept: _EventHolder<(info: OnAcceptInfo) => void>;

    /**
     * The event data.
     */
    interface OnAcceptErrorInfo {

        /**
         * The server socket identifier.
         */
        socketId: number;

        /**
         * The result code returned from the underlying network call.
         */
        resultCode: number;

    }

    /**
     * Event raised when a network error occured while the runtime was waiting for new connections on the socket address and port. Once this event is raised, the socket is set to `paused` and no more `onAccept` events are raised for this socket until the socket is resumed.
     */
    export const onAcceptError: _EventHolder<(info: OnAcceptErrorInfo) => void>;

}



//==============================//
//          chrome.usb          //
//==============================//

/**
 * Description: Use the `chrome.usb` API to interact with connected USB devices. This API provides access to USB operations from within the context of an app. Using this API, apps can function as drivers for hardware devices. Errors generated by this API are reported by setting [runtime.lastError](https://developer.chrome.com/apps/runtime#property-lastError) and executing the function's regular callback. The callback's regular parameters will be undefined in this case.
 * Availability: Since Chrome 33.
 * Permissions: "usb"
 * Learn More: [Accessing Hardware Devices](https://developer.chrome.com/apps/app_usb)
 */
declare namespace chrome.usb {

    /**
     * Direction, Recipient, RequestType, and TransferType all map to their namesakes within the USB specification.
     */
    export type Direction = "in" | "out";

    export interface Device {

        /**
         * An opaque ID for the USB device. It remains unchanged until the device is unplugged.
         */
        device: number;

        /**
        * The device vendor ID.
        */
        vendorId: number;

        /**
        * The product ID.
        */
        productId: number;

        /**
        * Since Chrome 51.
        *
        * The device version (bcdDevice field).
        */
        version: number;

        /**
        * Since Chrome 46.
        *
        * The iProduct string read from the device, if available.
        */
        productName: string;

        /**
        * Since Chrome 46.
        *
        * The iManufacturer string read from the device, if available.
        */
        manufacturerName: string;

        /**
        * Since Chrome 46.
        *
        * The iSerialNumber string read from the device, if available.
        */
        serialNumber: string;

    }

    export interface ConnectionHandle {

        /**
         * An opaque handle representing this connection to the USB device and all associated claimed interfaces and pending transfers. A new handle is created each time the device is opened. The connection handle is different from [Device.device](https://developer.chrome.com/apps/usb#property-Device-device).
         */
        handle: number;

        /**
         * The device vendor ID.
         */
        vendorId: number;

        /**
         * The product ID.
         */
        productId: number;

    }

    export interface EndpointDescriptor {

        /**
         * Endpoint address.
         */
        address: number;

        /**
         * Transfer type.
         */
        type: "control" | "interrupt" | "isochronous" | "bulk";

        /**
         * Transfer direction.
         */
        direction: Direction;

        /**
         * Maximum packet size.
         */
        maximumPacketSize: number;

        /**
         * Transfer synchronization mode (isochronous only).
         */
        synchronization?: "asynchronous" | "adaptive" | "synchronous";

        /**
         * Endpoint usage hint.
         */
        usage?: "data" | "feedback" | "explicitFeedback" | "periodic" | "notification";

        /**
         * Polling interval (interrupt and isochronous only).
         */
        pollingInterval?: number;

        /**
         * Since Chrome 39.
         *
         * Extra descriptor data associated with this endpoint.
         */
        extra_data: ArrayBuffer;

    }

    export interface InterfaceDescriptor {

        /**
         * The interface number.
         */
        interfaceNumber: number;

        /**
         * The interface alternate setting number (defaults to 0
         */
        alternateSetting: number;

        /**
         * The USB interface class.
         */
        interfaceClass: number;

        /**
         * The USB interface sub-class.
         */
        interfaceSubclass: number;

        /**
         * The USB interface protocol.
         */
        interfaceProtocol: number;

        /**
         * Description of the interface.
         */
        description?: string;

        /**
         * Available endpoints.
         */
        endpoints: EndpointDescriptor[];

        /**
         * Since Chrome 39.
         *
         * Extra descriptor data associated with this interface.
         */
        extra_data: ArrayBuffer;

    }

    /**
     * Since Chrome 39.
     */
    export interface ConfigDescriptor {

        /**
         * Is this the active configuration?
         */
        active: boolean;

        /**
         * The configuration number.
         */
        configurationValue: number;

        /**
         * Description of the configuration.
         */
        description: string;

        /**
         * The device is self-powered.
         */
        selfPowered: boolean;

        /**
         * The device supports remote wakeup.
         */
        remoteWakeup: boolean;

        /**
         * The maximum power needed by this device in milliamps (mA).
         */
        maxPower: number;

        /**
         * Available interfaces.
         */
        interfaces: InterfaceDescriptor[];

        /**
         * Extra descriptor data associated with this configuration.
         */
        extra_data: ArrayBuffer;

    }

    export interface GenericTransferInfo {

        /**
         * The transfer direction ("in" or "out").
         */
        direction: Direction;

        /**
         * The target endpoint address. The interface containing this endpoint must be claimed.
         */
        endpoint: number;

        /**
         * The maximum number of bytes to receive (required only by input transfers).
         */
        length?: number;

        /**
         * The data to transmit (required only by output transfers).
         */
        data?: ArrayBuffer;

        /**
         * Since Chrome 43.
         *
         * Request timeout (in milliseconds). The default value 0 indicates no timeout.
         */
        timeout?: number;

    }

    export interface TransferResultInfo {

        /**
         * A value of 0 indicates that the transfer was a success. Other values indicate failure.
         */
        resultCode?: number;

        /**
         * The data returned by an input transfer. undefined for output transfers.
         */
        data?: ArrayBuffer;

    }

    /**
     * Since Chrome 39.
     */
    export interface DeviceFilter {

        /**
         * Device vendor ID.
         */
        vendorId?: number;

        /**
         * Device product ID, checked only if the vendor ID matches.
         */
        productId?: number;

        /**
         * USB interface class, matches any interface on the device.
         */
        interfaceClass?: number;

        /**
         * USB interface sub-class, checked only if the interface class matches.
         */
        interfaceSubclass?: number;

        /**
         * USB interface protocol, checked only if the interface sub-class matches.
         */
        interfaceProtocol?: number;

    }

    interface _GetDevicesOptions {

        /**
         * Since Chrome 39.
         *
         * A device matching any given filter will be returned. An empty filter list will return all devices the app has permission for.
         */
        filters?: DeviceFilter[];

    }

    /**
     * Enumerates connected USB devices.
     * @param options The properties to search for on target devices.
     * @param callback
     */
    export function getDevices(options: _GetDevicesOptions, callback: (devices: Device[]) => void): void;

    interface _GetUserSelectedDevicesOptions {

        /**
         * Allow the user to select multiple devices.
         */
        multiple?: boolean;

        /**
         * Filter the list of devices presented to the user. If multiple filters are provided devices matching any filter will be displayed.
         */
        filters?: DeviceFilter[];

    }

    /**
     * Since Chrome 40.
     *
     * Presents a device picker to the user and returns the [Device](https://developer.chrome.com/apps/usb#type-Device)s selected. If the user cancels the picker devices will be empty. A user gesture is required for the dialog to display. Without a user gesture, the callback will run as though the user cancelled.
     * @param options Configuration of the device picker dialog box.
     * @param callback Invoked with a list of chosen [Device](https://developer.chrome.com/apps/usb#type-Device)s.
     */
    export function getUserSelectedDevices(options: _GetUserSelectedDevicesOptions, callback: (devices: Device[]) => void): void;

    /**
     * Since Chrome 47.
     *
     * Returns the full set of device configuration descriptors.
     * @param device The [Device](https://developer.chrome.com/apps/usb#type-Device) to fetch descriptors from.
     * @param callback
     */
    export function getConfigurations(device: Device, callback: (configs: ConfigDescriptor[]) => void): void;

    /**
     * Opens a USB device returned by [getDevices](https://developer.chrome.com/apps/usb#method-getDevices).
     * @param device The [Device](https://developer.chrome.com/apps/usb#type-Device) to open.
     * @param callback
     */
    export function openDevice(device: Device, callback: (handle: ConnectionHandle) => void): void;

    interface _FindDevicesOptions {

        /**
         * The device vendor ID.
         */
        vendorId: number;

        /**
         * The product ID.
         */
        productId: number;

        /**
         * The interface ID to request access to. Only available on Chrome OS. It has no effect on other platforms.
         */
        interfaceId?: number;

    }

    /**
     * Finds USB devices specified by the vendor, product and (optionally) interface IDs and if permissions allow opens them for use.
     *
     * If the access request is rejected or the device fails to be opened a connection handle will not be created or returned.
     *
     * Calling this method is equivalent to calling [getDevices](https://developer.chrome.com/apps/usb#method-getDevices) followed by [openDevice](https://developer.chrome.com/apps/usb#method-openDevice) for each device.
     * @param options The properties to search for on target devices.
     * @param callback
     */
    export function findDevices(options: _FindDevicesOptions, callback: (handle: ConnectionHandle[]) => void): void;

    /**
     * Closes a connection handle. Invoking operations on a handle after it has been closed is a safe operation but causes no action to be taken.
     * @param handle The [ConnectionHandle](https://developer.chrome.com/apps/usb#type-ConnectionHandle) to close.
     * @param callback
     */
    export function closeDevice(handle: ConnectionHandle, callback?: (handle: ConnectionHandle) => void): void;

    /**
     * Since Chrome 42.
     *
     * Select a device configuration.
     *
     * This function effectively resets the device by selecting one of the device's available configurations. Only configuration values greater than 0 are valid however some buggy devices have a working configuration 0 and so this value is allowed.
     * @param handle Since Chrome 41. An open connection to the device.
     * @param configurationValue Since Chrome 41.
     * @param callback
     */
    export function setConfiguration(handle: ConnectionHandle, configurationValue: number, callback: () => void): void;

    /**
     * Since Chrome 39.
     *
     * Gets the configuration descriptor for the currently selected configuration.
     * @param handle An open connection to the device.
     * @param callback
     */
    export function getConfiguration(handle: ConnectionHandle, callback: (config: ConfigDescriptor) => void): void;

    /**
     * Lists all interfaces on a USB device.
     * @param handle An open connection to the device.
     * @param interfaceNumber The interface to be claimed.
     * @param callback
     */
    export function listInterfaces(handle: ConnectionHandle, callback: (descriptors: InterfaceDescriptor[]) => void): void;

    /**
     * Claims an interface on a USB device. Before data can be transfered to an interface or associated endpoints the interface must be claimed. Only one connection handle can claim an interface at any given time. If the interface is already claimed, this call will fail.
     *
     * [releaseInterface](https://developer.chrome.com/apps/usb#method-releaseInterface) should be called when the interface is no longer needed.
     * @param handle An open connection to the device.
     * @param interfaceNumber The interface to be claimed.
     * @param callback
     */
    export function claimInterface(handle: ConnectionHandle, interfaceNumber: number, callback: () => void): void;

    /**
     * Releases a claimed interface.
     * @param handle An open connection to the device.
     * @param interfaceNumber The interface to be released.
     * @param callback
     */
    export function releaseInterface(handle: ConnectionHandle, interfaceNumber: number, callback: () => void): void;

    /**
     * Selects an alternate setting on a previously claimed interface.
     * @param handle An open connection to the device.
     * @param interfaceNumber The interface to configure.
     * @param alternateSetting The alternate setting to configure.
     * @param callback
     */
    export function setInterfaceAlternateSetting(handle: ConnectionHandle, interfaceNumber: number, alternateSetting: number, callback: () => void): void;

    interface _ControlTransferInfo_Common {


        /**
         * The transfer target. The target given by `index` must be claimed if `"interface"` or `"endpoint"`.
         */
        recipient: "device" | "interface" | "endpoint" | "other";

        /**
         * The request type.
         */
        requestType: "standard" | "class" | "vendor" | "reserved";

        /**
         * The `bRequest` field, see *Universal Serial Bus Specification Revision 1.1* § 9.3.
         */
        request: number;

        /**
         * The `wValue` field, see *Ibid*.
         */
        value: number;

        /**
         * The `wIndex` field, see *Ibid*.
         */
        index: number;

        /**
         * Since Chrome 43.
         *
         * Request timeout (in milliseconds). The default value `0` indicates no timeout.
         */
        timeout?: number;
    }

    interface _ControlTransferInfo_In extends _ControlTransferInfo_Common {

        /**
         * The transfer direction (`"in"` or `"out"`).
         */
        direction: "in";

        /**
         * The maximum number of bytes to receive (required only by input transfers).
         */
        length: number;

    }

    interface _ControlTransferInfo_Out extends _ControlTransferInfo_Common {

        /**
         * The transfer direction (`"in"` or `"out"`).
         */
        direction: "out";

        /**
         * The data to transmit (required only by output transfers).
         */
        data: ArrayBuffer;

    }

    type _ControlTransferInfo = _ControlTransferInfo_In | _ControlTransferInfo_Out;

    /**
     * Performs a control transfer on the specified device.
     *
     * Control transfers refer to either the device, an interface or an endpoint. Transfers to an interface or endpoint require the interface to be claimed.
     * @param handle An open connection to the device.
     * @param transferInfo
     * @param callback
     */
    export function controlTransfer(handle: ConnectionHandle, transferInfo: _ControlTransferInfo, callback: (info: TransferResultInfo) => void): void;

    /**
     * Performs a bulk transfer on the specified device.
     * @param handle An open connection to the device.
     * @param transferInfo The transfer parameters.
     * @param callback
     */
    export function bulkTransfer(handle: ConnectionHandle, transferInfo: GenericTransferInfo, callback: (info: TransferResultInfo) => void): void;

    /**
     * Performs a interrupt transfer on the specified device.
     * @param handle An open connection to the device.
     * @param transferInfo The transfer parameters.
     * @param callback
     */
    export function interruptTransfer(handle: ConnectionHandle, transferInfo: GenericTransferInfo, callback: (info: TransferResultInfo) => void): void;

    interface _IsochronousTransferInfo {

        /**
         * Transfer parameters. The transfer length or data buffer specified in this parameter block is split along `packetLength` boundaries to form the individual packets of the transfer.
         */
        transferInfo: GenericTransferInfo;

        /**
         * The total number of packets in this transfer.
         */
        packets: number;

        /**
         * The length of each of the packets in this transfer.
         */
        packetLength: number;

    }

    /**
     * Performs a isochronous transfer on the specified device.
     * @param handle An open connection to the device.
     * @param transferInfo The transfer parameters.
     * @param callback
     */
    export function isochronousTransfer(handle: ConnectionHandle, transferInfo: _IsochronousTransferInfo, callback: (info: TransferResultInfo) => void): void;

    /**
     * Tries to reset the USB device. If the reset fails, the given connection handle will be closed and the USB device will appear to be disconnected then reconnected. In this case `getDevices` or `findDevices` must be called again to acquire the device.
     * @param handle A connection handle to reset.
     * @param callback
     */
    export function resetDevice(handle: ConnectionHandle, callback: (success: boolean) => void): void;

    /**
     * Since Chrome 42.
     *
     * Event generated when a device is added to the system. Events are only broadcast to apps and extensions that have permission to access the device. Permission may have been granted at install time, when the user accepted an optional permission (see [permissions.request](https://developer.chrome.com/apps/permissions#method-request)), or through [getUserSelectedDevices](https://developer.chrome.com/apps/usb#method-getUserSelectedDevices).
     */
    export const onDeviceAdded: _EventHolder<(device: Device) => void>;

    /**
     * Since Chrome 42.
     *
     * Event generated when a device is removed from the system. See [onDeviceAdded](https://developer.chrome.com/apps/usb#event-onDeviceAdded) for which events are delivered.
     */
    export const onDeviceRemoved: _EventHolder<(device: Device) => void>;

}



//==============================//
//        chrome.serial         //
//==============================//

/**
 * Description: Use the `chrome.serial` API to read from and write to a device connected to a serial port.
 * Availability: Since Chrome 33.
 * Permissions: "serial"
 * Learn More: [Accessing Hardware Devices](https://developer.chrome.com/apps/app_usb)
 */
declare namespace chrome.serial {

    export type DataBits = "seven" | "eight";

    export type ParityBit = "no" | "odd" | "even";

    export type StopBits = "one" | "two";

    export interface ConnectionOptions {

        /**
         * Flag indicating whether or not the connection should be left open when the application is suspended (see [Manage App Lifecycle](https://developer.chrome.com/apps/app_lifecycle)). The default value is "false." When the application is loaded, any serial connections previously opened with persistent=true can be fetched with `getConnections`.
         */
        peristent?: boolean;

        /**
         * An application-defined string to associate with the connection.
         */
        name?: string;

        /**
         * The size of the buffer used to receive data. The default value is 4096.
         */
        bufferSize?: number;

        /**
         * The requested bitrate of the connection to be opened. For compatibility with the widest range of hardware, this number should match one of commonly-available bitrates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200. There is no guarantee, of course, that the device connected to the serial port will support the requested bitrate, even if the port itself supports that bitrate. 9600 will be passed by default.
         */
        bitrate?: number;

        /**
         * `"eight"` will be passed by default.
         */
        dataBits?: DataBits;

        /**
         * `"no"` will be passed by default.
         */
        parityBit?: ParityBit;

        /**
         * `"one"` will be passed by default.
         */
        stopBits?: StopBits;

        /**
         * Flag indicating whether or not to enable RTS/CTS hardware flow control. Defaults to false.
         */
        ctsFlowControl?: boolean;

        /**
         * The maximum amount of time (in milliseconds) to wait for new data before raising an `onReceiveError` event with a "timeout" error. If zero, receive timeout errors will not be raised for the connection. Defaults to 0.
         */
        receiveTimeout?: number;

        /**
         * The maximum amount of time (in milliseconds) to wait for a send operation to complete before calling the callback with a "timeout" error. If zero, send timeout errors will not be triggered. Defaults to 0.
         */
        sendTimeout?: number;

    }

    export interface ConnectionInfo {

        /**
         * The id of the serial port connection.
         */
        connectionId: number;

        /**
         * Flag indicating whether the connection is blocked from firing onReceive events.
         */
        paused: boolean;

        /**
         * See ConnectionOptions.persistent
         */
        persistent: boolean;

        /**
         * See ConnectionOptions.name
         */
        name: string;

        /**
         * See ConnectionOptions.bufferSize
         */
        bufferSize: number;

        /**
         * See ConnectionOptions.receiveTimeout
         */
        receiveTimeout: number;

        /**
         * See ConnectionOptions.sendTimeout
         */
        sendTimeout: number;

    }

    export interface DeviceInfo {

        /**
         * The device's system path. This should be passed as the path argument to chrome.serial.connect in order to connect to this device.
         */
        path: string;

        /**
         * A PCI or USB vendor ID if one can be determined for the underlying device.
         */
        vendorId?: number;

        /**
         * A USB product ID if one can be determined for the underlying device.
         */
        productId?: number;

        /**
         * A human-readable display name for the underlying device if one can be queried from the host driver.
         */
        displayName?: string;

    }
}
