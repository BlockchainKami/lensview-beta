import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest(() => ({
  manifest_version: 3,
  name: "LensView",
  version: "1.0.1",
  description:
    "The omnipresent comment section to discuss, fact-check, and share your views about any web page",
  permissions: ["activeTab"],
  action: {
    default_title: "Share on LensView",
    default_icon: {
      "16": "images/icon-16.png",
      "24": "images/icon-24.png",
      "32": "images/icon-32.png",
      "64": "images/icon-64.png",
      "128": "images/icon-128.png",
      "512": "images/icon-512.png"
    },
    default_popup: "src/popup/index.html"
  },
  icons: {
    "16": "images/icon-16.png",
    "24": "images/icon-24.png",
    "32": "images/icon-32.png",
    "64": "images/icon-64.png",
    "128": "images/icon-128.png",
    "512": "images/icon-512.png"
  }
}));
