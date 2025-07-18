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
