    let xxxs = [
            {
                id: 1,
                xxxNumber: "1234567890123456",
                pinCode: "1234",
                pukCode: "12345678",
                ownerName: "John Smith",
                idCard: "ID123456789",
                address: "123 Main Street, New York, NY 10001",
                reference: "REF001",
                walletBalance: 25.50,
                dataUsage: 2.3,
                createdDate: "2024-01-15",
                lastUsed: "2024-01-20"
            },
            {
                id: 2,
                xxxNumber: "9876543210987654",
                pinCode: "5678",
                pukCode: "87654321",
                ownerName: "Sarah Johnson",
                idCard: "ID987654321",
                address: "456 Oak Avenue, Los Angeles, CA 90210",
                reference: "REF002",
                walletBalance: 15.75,
                dataUsage: 1.8,
                createdDate: "2024-01-10",
                lastUsed: "2024-01-19"
            },
            {
                id: 3,
                xxxNumber: "5555444433332222",
                pinCode: "9999",
                pukCode: "11111111",
                ownerName: "Mike Davis",
                idCard: "ID555444333",
                address: "789 Pine Road, Chicago, IL 60601",
                reference: "REF003",
                walletBalance: 42.00,
                dataUsage: 4.2,
                createdDate: "2024-01-05",
                lastUsed: "2024-01-21"
            }
        ];

        let editingId = null;

        function renderxxxs(xxxsToRender = xxxs) {
            const grid = document.getElementById('xxxGrid');
            const noResults = document.getElementById('noResults');

            if (xxxsToRender.length === 0) {
                grid.innerHTML = '';
                noResults.classList.remove('hidden');
                return;
            }

            noResults.classList.add('hidden');

            grid.innerHTML = xxxsToRender.map(xxx => `
                <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 xxx-card cursor-pointer" onclick="showDetails(${xxx.id})">
                    <div class="card-gradient text-white p-4 rounded-t-xl">
                        <h3 class="font-bold text-lg">📱 ${xxx.xxxNumber}</h3>
                        <p class="text-sm opacity-90">Owner: ${xxx.ownerName}</p>
                    </div>
                    <div class="p-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-gray-600">Balance:</span>
                            <span class="font-semibold text-green-600">${xxx.walletBalance.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-gray-600">Data Used:</span>
                            <span class="font-semibold text-blue-600">${xxx.dataUsage} GB</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Last Used:</span>
                            <span class="text-sm text-gray-800">${xxx.lastUsed}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function searchxxxs() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filtered = xxxs.filter(xxx =>
                xxx.xxxNumber.toLowerCase().includes(query) ||
                xxx.ownerName.toLowerCase().includes(query) ||
                xxx.idCard.toLowerCase().includes(query)
            );
            renderxxxs(filtered);
        }

        function showDetails(id) {
            const xxx = xxxs.find(s => s.id === id);
            if (!xxx) return;

            const content = document.getElementById('detailsContent');
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="card-gradient text-white p-6 rounded-xl">
                        <h3 class="text-xl font-bold mb-4">📱 xxx Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm opacity-80">xxx Number</p>
                                <p class="font-semibold text-lg">${xxx.xxxNumber}</p>
                            </div>
                            <div>
                                <p class="text-sm opacity-80">PIN Code</p>
                                <p class="font-semibold text-lg">${xxx.pinCode}</p>
                            </div>
                            <div>
                                <p class="text-sm opacity-80">PUK Code</p>
                                <p class="font-semibold text-lg">${xxx.pukCode}</p>
                            </div>
                            <div>
                                <p class="text-sm opacity-80">Reference</p>
                                <p class="font-semibold text-lg">${xxx.reference || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Owner Information -->
                    <div class="owner-gradient text-white p-6 rounded-xl">
                        <h3 class="text-xl font-bold mb-4">👤 Owner Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm opacity-80">Full Name</p>
                                <p class="font-semibold text-lg">${xxx.ownerName}</p>
                            </div>
                            <div>
                                <p class="text-sm opacity-80">ID Card Number</p>
                                <p class="font-semibold text-lg">${xxx.idCard}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm opacity-80">Address</p>
                            <p class="font-semibold">${xxx.address}</p>
                        </div>
                    </div>
                    
                    <!-- Wallet Information -->
                    <div class="wallet-gradient text-white p-6 rounded-xl">
                        <h3 class="text-xl font-bold mb-4">💰 Wallet Information</h3>
                        <div class="text-center">
                            <p class="text-sm opacity-80">Current Balance</p>
                            <p class="font-bold text-3xl">$${xxx.walletBalance.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <!-- Usage Information -->
                    <div class="usage-gradient text-white p-6 rounded-xl">
                        <h3 class="text-xl font-bold mb-4">📊 Usage Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="text-center">
                                <p class="text-sm opacity-80">Data Used</p>
                                <p class="font-bold text-2xl">${xxx.dataUsage} GB</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm opacity-80">Created Date</p>
                                <p class="font-semibold">${xxx.createdDate}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm opacity-80">Last Used</p>
                                <p class="font-semibold">${xxx.lastUsed}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center space-x-4 pt-4">
                        <button onclick="editxxx(${xxx.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            ✏️ Edit
                        </button>
                        <button onclick="deletexxx(${xxx.id})" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            🗑️ Delete xxx
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('detailsModal').classList.remove('hidden');
        }

        function hideDetails() {
            document.getElementById('detailsModal').classList.add('hidden');
        }

        function showAddForm() {
            editingId = null;
            document.getElementById('formTitle').textContent = 'Add';
            document.getElementById('xxxForm').reset();
            document.getElementById('formModal').classList.remove('hidden');
        }

        function editxxx(id) {
            const xxx = xxxs.find(s => s.id === id);
            if (!xxx) return;

            editingId = id;
            document.getElementById('formTitle').textContent = '✏️ Edit xxx Card';

            // Populate form
            document.getElementById('xxxNumber').value = xxx.xxxNumber;
            document.getElementById('pinCode').value = xxx.pinCode;
            document.getElementById('pukCode').value = xxx.pukCode;
            document.getElementById('ownerName').value = xxx.ownerName;
            document.getElementById('idCard').value = xxx.idCard;
            document.getElementById('address').value = xxx.address;
            document.getElementById('reference').value = xxx.reference || '';
            document.getElementById('walletBalance').value = xxx.walletBalance;
            document.getElementById('dataUsage').value = xxx.dataUsage;

            hideDetails();
            document.getElementById('formModal').classList.remove('hidden');
        }

        function hideForm() {
            document.getElementById('formModal').classList.add('hidden');
            editingId = null;
        }

        function deletexxx(id) {
            if (confirm('Are you sure you want to delete this xxx card?')) {
                xxxs = xxxs.filter(s => s.id !== id);
                hideDetails();
                renderxxxs();
            }
        }

        document.getElementById('xxxForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                xxxNumber: document.getElementById('xxxNumber').value,
                pinCode: document.getElementById('pinCode').value,
                pukCode: document.getElementById('pukCode').value,
                ownerName: document.getElementById('ownerName').value,
                idCard: document.getElementById('idCard').value,
                address: document.getElementById('address').value,
                reference: document.getElementById('reference').value,
                walletBalance: parseFloat(document.getElementById('walletBalance').value) || 0,
                dataUsage: parseFloat(document.getElementById('dataUsage').value) || 0
            };

            if (editingId) {
                // Update existing xxx
                const index = xxxs.findIndex(s => s.id === editingId);
                if (index !== -1) {
                    xxxs[index] = { ...xxxs[index], ...formData };
                }
            } else {
                // Add new xxx
                const newxxx = {
                    id: Date.now(),
                    ...formData,
                    createdDate: new Date().toISOString().split('T')[0],
                    lastUsed: new Date().toISOString().split('T')[0]
                };
                xxxs.push(newxxx);
            }

            hideForm();
            renderxxxs();
            searchxxxs(); // Refresh search results
        });

        // Initialize the page
        renderxxxs();



// Get references to DOM elements
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const goTopBtn = document.getElementById("goTopBtn");
const goBottomBtn = document.getElementById("goBottomBtn");

// Function to open the sidebar
function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
  sidebar.classList.add("translate-x-0");
}

// Function to close the sidebar
function closeSidebar() {
  sidebar.classList.remove("translate-x-0");
  sidebar.classList.add("-translate-x-full");
}

// Toggle sidebar on button click
sidebarToggle.addEventListener("click", (event) => {
  // Stop propagation to prevent document click from immediately closing it
  event.stopPropagation();
  if (sidebar.classList.contains("-translate-x-full")) {
    openSidebar();
  } else {
    closeSidebar();
  }
});

// Auto-hide sidebar when clicking outside of it
document.addEventListener("click", (event) => {
  // Check if the click occurred outside the sidebar and not on the toggle button
  if (
    !sidebar.contains(event.target) &&
    !sidebarToggle.contains(event.target)
  ) {
    closeSidebar();
  }
});
