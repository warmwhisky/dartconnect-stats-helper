// Ensure jQuery is available globally
try {
    importScripts("dist/jquery-3.6.0.min.js");
    console.log("✅ jQuery loaded successfully from background script!");
} catch (e) {
    console.error("❌ Failed to load jQuery:", e);
}
