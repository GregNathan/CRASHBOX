// script.js

// Function to handle the launch of the sandbox
function launchSandbox() {
    alert("Launching CrashLab: Physics Sandbox!"); // Alert message
    window.location.href = "Main_page.html"; // Redirect to the sandbox application
}

// Add event listener to the Launch Sandbox link
document.addEventListener("DOMContentLoaded", function() {
    const launchLink = document.querySelector('.nav-link[href="Main_page.html"]');
    if (launchLink) {
        launchLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            launchSandbox(); // Call the launch function
        });
    }
});
