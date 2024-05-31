import "../global.scss";
import "./popup.css";
import App from "./Popup.svelte";

const app = new App({
  target: document.getElementById("app")!
});

export default app;
