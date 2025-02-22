console.log("✅ DartConnect Stats Helper script loaded!");
(function () {
    $(document).ready(function () {

        function updateStats() {
            let players = $(".text-red-800").map(function () {
                let player_name = $(this).closest(`.justify-between`).find(`.truncate`).text().trim();
                let player_flag = $(this).closest(`.justify-between`).find(`img`).attr("src") || "";

                // Remove the "B[number]" prefix
                player_name = player_name.replace(/^[A-Z]\d+/, '').trim();

                // Swap first and last names
                player_name = player_name.replace(/^(.+), (.+)$/, '$2 $1');

                let num = parseFloat($(this).text());

                // Check if this player is inside a "Live Darts!" parent
                let isPlayingLive = $(this).closest('.bg-white').prev().find("*:contains('Live Darts!')").length > 0;
                // console.log(isPlayingLive,$(this).closest('.bg-red-500').next());

                return isNaN(num) ? null : {
                    player_name,
                    nine_dart_average: num,
                    player_flag,
                    playing_live: isPlayingLive // 🎯 New property added!
                };
            }).get();


            // Sort by highest to lowest average
            players.sort((a, b) => b.nine_dart_average - a.nine_dart_average);

            // console.log("🎯 Sorted Players:", players);

            if (players.length > 0) {
                $("#highest-player").html(`${players[0].player_name} (${players[0].nine_dart_average})`);
                $("#lowest-player").html(`${players[players.length - 1].player_name} (${players[players.length - 1].nine_dart_average})`);

                // Calculate Tournament Average
                let totalAverage = players.reduce((sum, player) => sum + player.nine_dart_average, 0);
                let tournamentAverage = (totalAverage / players.length).toFixed(2);

                $("#tournament-avg").html(`${tournamentAverage}`);
                $("#games-count").html(`${players.length / 2}`);

                // Create a Set to store unique player names
                let uniquePlayers = new Set(players.map(p => p.player_name));

                $("#player-count").html(`${uniquePlayers.size}`);
            }


            // Count occurrences of each flag
            let flagCounts = {};
            players.forEach(player => {
                if (player.player_flag) {
                    flagCounts[player.player_flag] = (flagCounts[player.player_flag] || 0) + 1;
                }
            });

            // Convert to array and sort from highest to lowest
            let sortedFlags = Object.entries(flagCounts).sort((a, b) => b[1] - a[1]);

            // Generate HTML for flag counts in a grid
            let flagStatsHTML = sortedFlags.map(([flag, count]) => `
                <div class="flag_count grid grid-cols-2 items-center gap-2 border !border-pink-300 rounded-md cursor-pointer" data-flag="${flag}">
                    <img src="${flag}" class="w-6 h-6x rounded-md" alt="Flag">
                    <div class="text-gray-700 font-semibold text-center">${count}</div>
                </div>
            `).join("");

            // Update the stats panel with flag counts
            $("#flag-counts").html(flagStatsHTML);

            let playerList = players.map((p, index) => `  
                <div class="flex justify-between items-center border-b border-pink-300 pb-1 player_average_row" data-flag="${p.player_flag}">  
                    <div class="flex items-center space-x-2">  
                        <div class="font-semibold w-4">${index + 1}</div>
                         ${p.playing_live ? '🎯 ' : '<div class="w-[9px]"></div>'}
                        <img src="${p.player_flag}" class="w-4 border !border-pink-300 rounded-sm" alt="Flag">  <span class="text-pink-500 font-semibold">${p.player_name}</span>  
                    </div>  
                    <div class="text-gray-700 font-mono">${parseFloat(p.nine_dart_average).toFixed(2)}</div>  
                </div>  
            `).join("");

            $("#number-display-content").html(playerList);

            // get the tournament title
            $('#tournament_title').text($('h1.text-xl').text())
        }


        // Append floating panel with animation & soft glow ✨
        $("body").append(`
            <button id="toggle-display" 
                class="fixed bottom-5 right-5 !bg-pink-500 !text-white px-4 py-2 rounded-full shadow-lg 
                hover:bg-pink-600 transition-all">
                Show Stats
            </button>
        
            <div id="floating-panel" 
                class="fixed right-0 bg-white shadow-xl border border-pink-300 p-4 rounded-l-2xl w-96 
                hidden transform translate-y-10 opacity-0 transition-all duration-500 ease-in-out text-gray-800 
                shadow-soft-glow bg-gradient-to-br from-white to-pink-100 
                max-h-screen flex flex-col z-50">
        
                <!-- Header stays fixed -->
                <div class="flex justify-between items-center pb-2 border-b border-pink-300">
                    <h3 class="text-sm font-bold text-pink-600">📊 Stats Panel</h3>
                    <button id="close-panel" class="!text-gray-500 text-xs hover:!text-red-500">✖</button>
                </div>
        
                <!-- Stats Section (Fixed) -->
                <div id="stats-header" class="grid grid-cols-12 mt-2 text-xs pb-2 border-b border-pink-300">
                    <div class="text-pink-800 col-span-12 text-xl mb-4" id="tournament_title"></div>
                    <div class="text-pink-600 col-span-4">Highest Avg:</div> <div id="highest-player" class="col-span-8"></div>
                    <div class="text-pink-600 col-span-4">Lowest Avg:</div> <div id="lowest-player" class="col-span-8"></div>
                    <div class="text-pink-600 col-span-4">Tournament Avg:</div> <div id="tournament-avg" class="col-span-8"></div>
                    <div class="text-pink-600 col-span-4">Players count:</div> <div id="player-count" class="col-span-8"></div>
                    <div class="text-pink-600 col-span-4">Games count:</div> <div id="games-count" class="col-span-8"></div>
                </div>
        
                <!-- Flag Stats Section (New!) -->
                <div id="flag-stats" class="mt-2 text-xs pb-2 border-b border-pink-300">
                    <strong class="text-pink-600">🏳️ Country Count:</strong>
                    <div id="flag-counts" class="mt-1 flex flex-wrap gap-2 overflow-y-auto max-h-40"></div>
                </div>
        
                <!-- Scrollable Player List -->
                <div id="number-display-content" class="flex-1 overflow-y-auto text-xs mt-2"></div>
        
                <!-- Refresh Button (Fixed) -->
                <button id="refresh-stats" 
                    class="mt-3 !bg-pink-400 !text-white text-xs px-3 py-1 rounded-lg hover:!bg-pink-500 !transition-all">
                    Refresh
                </button>
            </div>
        `);

        // Show and refresh the panel
        $("#toggle-display, #refresh-stats").click(function () {
            // Click the "Show +" button
            $("span").filter(function () {
                return $(this).text().trim() === "Show +";
            }).closest("button").click();

            // Wait 500ms (0.5 seconds) before updating stats
            setTimeout(function () {
                $("#floating-panel").removeClass("hidden").addClass("translate-y-0 opacity-100");
                updateStats();
            }, 500);
        });

        // Close button with instant hiding after animation
        $("#close-panel").click(function () {
            $("#floating-panel").addClass("translate-y-72 opacity-0").delay(500).queue(function (next) {
                $(this).addClass("hidden").removeClass("translate-y-72 opacity-0");
                next();
            });
        });

        // Filter out players by flag
        $(document).on('click', '.flag_count', function () {
            if($(this).hasClass('flag_filtered bg-pink-500/30')) {
                $(this).removeClass('flag_filtered bg-pink-500/30');
                $('.player_average_row').show();
            } else {
                const flag = $(this).attr('data-flag');
                $('.player_average_row').hide();
                $(`.player_average_row[data-flag="${flag}"]`).show();
                $('.flag_count').removeClass('flag_filtered bg-pink-500/30');
                $(this).addClass('flag_filtered bg-pink-500/30');
            }

        });

        // Run updateStats initially
        updateStats();

        document.addEventListener("inertia:finish", () => {
            // console.log("🔄 Inertia page changed! Checking if we should inject the panel...");

            $("#floating-panel").addClass("hidden");
            if (location.href.includes("/event/")) {
                // console.log("🎯 We're on an event page! Showing button...");
                $("#toggle-display").removeClass("hidden");
            } else {
                // console.log("🚫 Not an event page. Hiding button...");
                $("#toggle-display").addClass("hidden");
            }
        });

    });
})();
