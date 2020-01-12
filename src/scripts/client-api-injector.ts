'use strict';

(() => {

    // Gaurd in case we're injected more than once
    if (!window.injectedRockCheckinClientAPI) {
        window.injectedRockCheckinClientAPI = true;

        // Inject a script element pointing to our client script
        var script = document.createElement('script');
        script.src = chrome.runtime.getURL('./scripts/client-api.js');
        script.onload = () => script.remove();
        (document.head || document.documentElement).appendChild(script);

    }

})();
