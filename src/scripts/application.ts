
import { MainApp } from "./lib/MainApp";

window.addEventListener('DOMContentLoaded', () => {
    const spaRoot = document.getElementById("spaRoot");
    spaRoot && new MainApp(spaRoot);
});
