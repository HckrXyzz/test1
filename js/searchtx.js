   const SPREADSHEET_ID = "1l5fCjy9Y-thrDFGRU-0E4nlmVrlrdvXuOxIkziEp9uc";
      const SHEET_NAME = "tgAllJuly";
      const STORAGE_KEY = "transactionSearchHistory";
      const MAX_HISTORY_ITEMS = 100;

      // Strictly defined columns requested matching your Google Sheet structure
      const DEFINED_HEADERS = [
        "AGENT NAME",
        "USERNAME",
        "DEPOSIT ID",
        "REFERENCE NO",
        "CUSTOMER NUMBER",
        "AMOUNT",
        "DEPOSIT DATE",
        "AGENT NUMBER",
        "IMAGE LINK",
        "DATE POSTED",
        "SSP API STATUS",
        "DATE",
        "PAYMENT REMARKS",
        "SETTLED TRANSACTION ID",
        "STATUS",
        "Update by",
        "Extra",
        "Cashout Number",
        "Manual Input any remark ",
        "Credit time",
      ];

      // ===== LOCAL STORAGE MANAGEMENT =====
      class SearchHistoryManager {
        constructor(storageKey, maxItems) {
          this.storageKey = storageKey;
          this.maxItems = maxItems;
        }

        getHistory() {
          try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
          } catch (error) {
            console.error("Error reading search history:", error);
            return [];
          }
        }

        addSearch(transactionId) {
          const history = this.getHistory();
          const timestamp = new Date().toISOString();

          // Create search entry with ISO timestamp and formatted time
          const searchEntry = {
            id: transactionId,
            timestamp: timestamp,
            formattedTime: new Date(timestamp).toLocaleString(),
          };

          // Remove duplicate if exists (keep most recent)
          const filteredHistory = history.filter((item) => item.id !== transactionId);

          // Add new entry at the beginning
          const updatedHistory = [searchEntry, ...filteredHistory];

          // Keep only max items
          const limitedHistory = updatedHistory.slice(0, this.maxItems);

          try {
            localStorage.setItem(this.storageKey, JSON.stringify(limitedHistory));
            this.renderHistory();
            return true;
          } catch (error) {
            console.error("Error saving search history:", error);
            return false;
          }
        }

        clearHistory() {
          try {
            localStorage.removeItem(this.storageKey);
            this.renderHistory();
            return true;
          } catch (error) {
            console.error("Error clearing search history:", error);
            return false;
          }
        }

        renderHistory() {
          const history = this.getHistory();
          const recentSearchesSection = document.getElementById("recentSearchesSection");
          const recentSearchesList = document.getElementById("recentSearchesList");

          if (history.length === 0) {
            recentSearchesSection.classList.add("hidden");
            return;
          }

          recentSearchesSection.classList.remove("hidden");
          recentSearchesList.innerHTML = "";

          history.forEach((item) => {
            const badge = document.createElement("button");
            badge.type = "button";
            badge.className =
              "bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 group";
            badge.title = `Searched: ${item.formattedTime}`;
            
            const timeObj = new Date(item.timestamp);
            const timeStr = timeObj.toLocaleTimeString();
            
            badge.innerHTML = `
              <span class="font-medium">${item.id}</span>
              <span class="text-[10px] text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity">${timeStr}</span>
            `;
            
            badge.addEventListener("click", (e) => {
              e.preventDefault();
              document.getElementById("transactionId").value = item.id;
              document.getElementById("lookupForm").dispatchEvent(new Event("submit"));
            });

            recentSearchesList.appendChild(badge);
          });
        }

        exportHistory() {
          const history = this.getHistory();
          return {
            exportDate: new Date().toISOString(),
            totalSearches: history.length,
            searches: history,
          };
        }

        getHistoryJSON() {
          return JSON.stringify(this.getHistory(), null, 2);
        }
      }

      // Initialize history manager
      const historyManager = new SearchHistoryManager(STORAGE_KEY, MAX_HISTORY_ITEMS);

      // Render history on page load
      document.addEventListener("DOMContentLoaded", () => {
        historyManager.renderHistory();
      });

      // Export history button
      document.getElementById("exportHistoryBtn").addEventListener("click", () => {
        const exportData = historyManager.exportHistory();
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `search-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      });

      // Clear history button
      document.getElementById("clearHistoryBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear search history?")) {
          historyManager.clearHistory();
        }
      });

      // ===== MAIN SEARCH FUNCTIONALITY =====
      document
        .getElementById("lookupForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const txnId = document.getElementById("transactionId").value.trim();
          const loadingState = document.getElementById("loadingState");
          const errorDiv = document.getElementById("errorMessage");
          const resultContainer = document.getElementById("resultContainer");

          if (!txnId) {
            showError("Please enter a Transaction ID");
            return;
          }

          // Save to history
          historyManager.addSearch(txnId);

          loadingState.classList.remove("hidden");
          errorDiv.classList.add("hidden");
          resultContainer.innerHTML = "";

          // Column D (REFERENCE NO) as requested in your setup
          const query = encodeURIComponent(`SELECT * WHERE D = '${txnId}'`);
          const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tq=${query}&sheet=${SHEET_NAME}&gid=1498846480`;

          fetch(url)
            .then((response) => {
              if (!response.ok)
                throw new Error("Failed to connect to spreadsheet data feed.");
              return response.text();
            })
            .then((txt) => {
              const jsonString = txt.substring(
                txt.indexOf("{"),
                txt.lastIndexOf("}") + 1,
              );
              const data = JSON.parse(jsonString);

              loadingState.classList.add("hidden");

              if (data.status === "error") {
                throw new Error(
                  data.errors[0].detailed_message ||
                    "Error processing query parameters.",
                );
              }

              const tableData = data.table;

              if (!tableData.rows || tableData.rows.length === 0) {
                showError(
                  `No records found matching Agent Name / Transaction ID: "${txnId}"`,
                );
                return;
              }

              let html = "";

              // Loop through any matched rows
              tableData.rows.forEach((row, rowIndex) => {
                html += `
                            <div class="bg-gray-800 border border-gray-700/60 rounded-2xl shadow-xl overflow-hidden mb-6">
                                <div class="bg-gray-950/40 px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
                                    <div>
                                        <span class="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-0.5">Matched Entry</span>
                                        <h3 class="text-base font-bold text-white">${row.c[0] ? row.c[0].v || "Record" : "Record"}</h3>
                                    </div>
                                    <span class="inline-flex items-center rounded-md bg-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-300 border border-gray-600">
                                        Row Match #${rowIndex + 1}
                                    </span>
                                </div>
                                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        `;

                // Iterate dynamically over the 20 columns
                DEFINED_HEADERS.forEach((label, index) => {
                  const cell = row.c[index];
                  const rawValue = cell ? cell.f || cell.v || "" : "";

                  // Visual formatting updates based on column roles
                  const isImageColumn = label === "IMAGE LINK";
                  const isStatusColumn = label === "STATUS";
                  const isAmountColumn = label === "AMOUNT";
                  const isRefColumn = label === "REFERENCE NO";
                  // If it's an image link block, span full row width for better display room
                  const blockSpanClass = isImageColumn
                    ? "col-span-1 md:col-span-2 border-t border-gray-700/40 pt-4 mt-2"
                    : "";

                  html += `
                                <div class="flex flex-col space-y-1 ${blockSpanClass}">
                                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">${label}</span>
                                    <div class="text-sm font-medium text-gray-200 break-all text-left">
                            `;

                  if (
                    isImageColumn &&
                    rawValue &&
                    (rawValue.startsWith("http://") ||
                      rawValue.startsWith("https://"))
                  ) {
                    html += `
                                    <div class="mt-1">
                                        <a href="${rawValue}" target="_blank" class="group inline-block relative">
                                            <img src="${rawValue}" alt="Transaction Receipt" class="max-h-64 object-contain border border-gray-700 shadow-md group-hover:opacity-90 transition-opacity rounded-lg" />
                                            <span class="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-[10px] text-white px-2 py-1 rounded-md font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Full</span>
                                        </a>
                                    </div>`;
                  } else if (isStatusColumn && rawValue) {
                    const cleanVal = rawValue.toString().toLowerCase().trim();
                    const isApproved =
                      cleanVal === "approved" ||
                      cleanVal === "success" ||
                      cleanVal === "settled";
                    const badgeColorClass = isApproved
                      ? "text-green-400 bg-green-950/40 ring-green-800/60"
                      : "text-amber-400 bg-amber-950/40 ring-amber-800/60";
                    html += `<span class="${badgeColorClass} inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ring-1">${rawValue}</span>`;
                  } else if (isAmountColumn && rawValue) {
                    html += `<span class="text-emerald-400 font-bold font-mono text-base">${rawValue}</span>`;
                  } else {
                    html +=
                      rawValue ||
                      `<span class="text-gray-600 italic text-xs">Empty</span>`;
                  }

                  html += `
                                    </div>
                                </div>
                            `;
                });

                html += `
                                </div>
                            </div>
                        `;
              });

              resultContainer.innerHTML = html;
            })
            .catch((err) => {
              loadingState.classList.add("hidden");
              showError(err.message);
              console.error(err);
            });
        });

      function showError(message) {
        const errorDiv = document.getElementById("errorMessage");
        const errorText = document.getElementById("errorText");
        errorText.textContent = message;
        errorDiv.classList.remove("hidden");
      }

      // ===== DEVELOPER UTILITIES =====
      // Access in browser console:
      // View history: console.log(historyManager.getHistoryJSON())
      // Export history: historyManager.exportHistory()
      // Clear history: historyManager.clearHistory()
      window.searchHistoryManager = historyManager;
  
