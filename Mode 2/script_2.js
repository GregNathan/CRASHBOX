let speedChart, forceChart;

// Store temporary values from sliders
let tempMass = 800, tempSpeed = 20, tempStop = 0.5;

function readSliderValues() {
  // Read sliders into temp variables
  tempMass = parseFloat(document.getElementById("mass").value);
  tempSpeed = parseFloat(document.getElementById("speed").value);
  tempStop = parseFloat(document.getElementById("stopping").value);

  // Live update display numbers ONLY
  document.getElementById("massVal").textContent = tempMass;
  document.getElementById("speedVal").textContent = tempSpeed;
  document.getElementById("stopVal").textContent = tempStop;
}

function updateCrash() {
  // Use the latest chosen values
  const mass = tempMass;
  const speed = tempSpeed;
  const stopDist = tempStop;

  // Physics calculations
  const initialKE = 0.5 * mass * speed ** 2;
  const impactForce = (mass * speed ** 2) / (2 * stopDist);
  const deceleration = speed ** 2 / (2 * stopDist);
  const collisionTime = speed / deceleration;

  // Speed vs Time data
  const steps = 40;
  const times = [];
  const speeds = [];
  for (let i = 0; i <= steps; i++) {
    const t = (collisionTime / steps) * i;
    const v = Math.max(speed - deceleration * t, 0);
    times.push(t.toFixed(2));
    speeds.push(v.toFixed(2));
  }

  // Force vs Time data
  const forces = speeds.map(v => (mass * (v - 0) / collisionTime).toFixed(2));

  // Create Speed graph
  const ctx1 = document.getElementById("speedGraph").getContext("2d");
  if (speedChart) speedChart.destroy();
  speedChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Speed vs Time",
        data: speeds,
        borderColor: "#00bfae",
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Time (s)" } },
        y: { title: { display: true, text: "Speed (m/s)" }, beginAtZero: true }
      }
    }
  });

  // Create Force graph
  const ctx2 = document.getElementById("forceGraph").getContext("2d");
  if (forceChart) forceChart.destroy();
  forceChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Force vs Time",
        data: forces,
        borderColor: "#ff5252",
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Time (s)" } },
        y: { title: { display: true, text: "Force (N)" }, beginAtZero: true }
      }
    }
  });

  // Update results
  document.getElementById("results").innerHTML = `
    <h2>📊 Crash Stats</h2>
    <p>Initial Kinetic Energy: <strong>${initialKE.toFixed(2)} J</strong></p>
    <p>Impact Force: <strong>${impactForce.toFixed(2)} N</strong></p>
    <p>Deceleration: <strong>${deceleration.toFixed(2)} m/s²</strong></p>
    <p>Collision Time: <strong>${collisionTime.toFixed(2)} s</strong></p>
  `;

  // Move car animation
  const trackWidth = document.getElementById("carTrack").offsetWidth - 40;
  document.getElementById("car").style.left = `${Math.min((speed / 50) * trackWidth, trackWidth)}px`;
}

function calibrate() {
  document.getElementById("mass").value = 800;
  document.getElementById("speed").value = 20;
  document.getElementById("stopping").value = 0.5;
  readSliderValues(); // Preview numbers instantly
  updateCrash(); // Apply right away
}

window.onload = () => {
  readSliderValues(); // Initial preview
  updateCrash(); // Initial graph

  // Sliders only update numbers (not graphs)
  ["mass", "speed", "stopping"].forEach(id =>
    document.getElementById(id).addEventListener("input", readSliderValues)
  );

  // Apply button updates graphs + results
  document.getElementById("applyBtn").addEventListener("click", updateCrash);
  document.getElementById("calibrateBtn").addEventListener("click", calibrate);
};
