document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("open-panel").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || tabs.length === 0) {
                console.error("No active tab found!");
                return;
            }

            let activeTab = tabs[0];

            // Ensure the tab is a DartConnect page before sending a message
            if (!activeTab.url || !activeTab.url.includes("tv.dartconnect.com")) {
                console.error("Not on DartConnect. Cannot open panel.");
                return;
            }

            // Send the message directly to the tab where script.js is running
            chrome.tabs.sendMessage(activeTab.id, { action: "open_stats_panel" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message sending error:", chrome.runtime.lastError);
                }
                if (response && response.status === "failed") {
                    console.error("Failed to open panel:", response.message);
                }
            });
        });
    });
});
