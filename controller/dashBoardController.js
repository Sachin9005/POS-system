 
    // ==================== CHART ====================
    let overviewChart;
    export function initChart() {
      const ctx = document.getElementById('overviewChart');
      if (overviewChart) overviewChart.destroy();

      overviewChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
          datasets: [{
            data: [18, 25, 55, 48, 52, 38, 58, 32, 38],
            borderColor: '#fb923c',
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
            tension: 0.4,
            borderWidth: 4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 10, max: 60, ticks: { color: '#94a3b8' } } }
        }
      });
    }

    // ==================== DATE ====================
    export function updateDate() {
      const dateEl = document.getElementById('currentDate');
      dateEl.textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    }