import { MainApp } from "./lib/MainApp";

// When the app window is loaded
window.addEventListener('DOMContentLoaded', () => {

    // Get the root
    const spaRoot = document.getElementById("spaRoot");

    // Init the Checkin App
    spaRoot && new MainApp(spaRoot);

});
