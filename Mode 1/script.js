let fallChart, pathChart;

function updateFall() {
  const g = 9.81;
  const height = parseFloat(document.getElementById("height").value);
  const mass = parseFloat(document.getElementById("mass").value);
  const stopDist = parseFloat(document.getElementById("stopping").value);
  const initSpeed = parseFloat(document.getElementById("initSpeed").value);

  // Update display values
  document.getElementById("heightVal").textContent = height;
  document.getElementById("massVal").textContent = mass;
  document.getElementById("stopVal").textContent = stopDist;
  document.getElementById("initSpeedVal").textContent = initSpeed;

  // Velocity components
  const vX = initSpeed;
  const vY = Math.sqrt(2 * g * height);
  const totalVelocity = Math.sqrt(vX ** 2 + vY ** 2);

  // Physics calculations
  const timeToFall = (vY === 0) ? Math.sqrt((2 * height) / g) : (vY / g + Math.sqrt((vY / g) ** 2 + (2 * height) / g));
  const kineticEnergy = 0.5 * mass * totalVelocity ** 2;
  const impactForce = (mass * totalVelocity ** 2) / (2 * stopDist);

  // Data for Height vs Time graph
  const steps = 40;
  const times = [];
  const heights = [];
  for (let i = 0; i <= steps; i++) {
    const t = (timeToFall / steps) * i;
    const y = Math.max(height - 0.5 * g * t ** 2, 0);
    times.push(t.toFixed(2));
    heights.push(y.toFixed(2));
  }

  // Car path graph (projectile motion)
  const pathPoints = [];
  for (let t = 0; t <= timeToFall; t += timeToFall / steps) {
    const x = vX * t;
    const y = Math.max(height - 0.5 * g * t ** 2, 0);
    pathPoints.push({ x, y });
  }

  // Create Height vs Time chart
  const ctx1 = document.getElementById("fallGraph").getContext("2d");
  if (fallChart) fallChart.destroy();
  fallChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Height vs Time",
        data: heights,
        borderColor: "#1565c0",
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Time (s)" } },
        y: { title: { display: true, text: "Height (m)" }, beginAtZero: true }
      }
    }
  });

  // Create Path chart with car as a point
  const ctx2 = document.getElementById("fallPath").getContext("2d");
  if (pathChart) pathChart.destroy();
  pathChart = new Chart(ctx2, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Fall Path",
          data: pathPoints,
          borderColor: "#d81b60",
          showLine: true,
          fill: false
        },
        {
          label: "🚗 Car",
          data: [pathPoints[0]],
          pointBackgroundColor: "#000",
          pointRadius: 6,
          type: "scatter",
          showLine: false
        }
      ]
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Horizontal Distance (m)" } },
        y: { title: { display: true, text: "Height (m)" }, min: 0, max: height + 5 }
      }
    }
  });

  // Update results
  document.getElementById("results").innerHTML = `
    <h2>📊 Fall Stats</h2>
    <p>Time to Fall: <strong>${timeToFall.toFixed(2)} s</strong></p>
    <p>Total Velocity: <strong>${totalVelocity.toFixed(2)} m/s</strong></p>
    <p>Kinetic Energy: <strong>${kineticEnergy.toFixed(2)} J</strong></p>
    <p>Impact Force: <strong>${impactForce.toFixed(2)} N</strong></p>
  `;
}


function calibrate() {
  document.getElementById("height").value = 10;
  document.getElementById("mass").value = 1.0;
  document.getElementById("stopping").value = 0.5;
  updateFall();
}

// Initialize
window.onload = updateFall;
