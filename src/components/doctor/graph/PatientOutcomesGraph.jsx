import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// ============================================================
// 📊 PATIENT OUTCOMES DATA ARRAY
// ============================================================
const outcomeData = [
  { label: 'Recovered', count: 87, color: '#2dce89' },     // Green
  { label: 'Not Recovered', count: 12, color: '#ff5c5c' }, // Red/Coral
  { label: 'Ongoing', count: 3, color: '#94a3b8' },        // Light Grey/Blue
];

// Plugin to draw the total count and "Patients" text in the center of the doughnut
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea: { top, bottom, left, right } } = chart;
    ctx.save();

    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    // Calculate total
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

    // Draw Total Number
    ctx.font = '700 28px system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#1a1a4b'; // Dark navy text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centerX, centerY - 10);

    // Draw "Patients" text
    ctx.font = '500 13px system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#7b8ba3'; // Light greyish text
    ctx.fillText('Patients', centerX, centerY + 18);

    ctx.restore();
  },
};

export default function PatientOutcomesGraph({ data = outcomeData }) {
  // Calculate total for percentage calculations
  const total = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);

  // Build data for Chart.js
  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: data.map((d) => d.color),
          borderWidth: 0, // Removes the white lines between segments
          hoverOffset: 4,
          cutout: '72%', // Creates the doughnut hole size
        },
      ],
    };
  }, [data]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // We build a custom HTML legend below
        },
        tooltip: {
          backgroundColor: '#1a1a4b',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              const pct = ((value / total) * 100).toFixed(1);
              return ` ${context.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    }),
    [total]
  );

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Patient Outcomes</h2>

      <div style={styles.contentWrapper}>
        {/* Chart Container */}
        <div style={styles.chartContainer}>
          <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
        </div>

        {/* Custom HTML Legend */}
        <div style={styles.legendContainer}>
          {data.map((item) => {
            const pct = ((item.count / total) * 100).toFixed(1);
            return (
              <div key={item.label} style={styles.legendRow}>
                <div style={styles.legendLeft}>
                  <span style={{ ...styles.dot, backgroundColor: item.color }}></span>
                  <span style={styles.legendLabel}>{item.label}</span>
                </div>
                <div style={styles.legendRight}>
                  <span style={styles.legendValue}>{item.count}</span>
                  <span style={styles.legendPct}>({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Inline styles ----
const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 32px',
    width: '100%',
    maxWidth: '650px', // Fits nicely on screen
    margin: '2rem auto',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    border: '1px solid #edf2f7',
    boxSizing: 'border-box',
  },
  heading: {
    margin: '0 0 24px 0',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a4b', // Deep navy
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    flexWrap: 'wrap', // Stacks on smaller screens
  },
  chartContainer: {
    position: 'relative',
    width: '220px',
    height: '220px',
    flexShrink: 0,
  },
  legendContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: '250px',
  },
  legendRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  legendLabel: {
    color: '#5a6a85', // Muted blue/grey
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  legendRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1a1a4b',
  },
  legendValue: {
    minWidth: '28px',
    textAlign: 'right',
  },
  legendPct: {
    color: '#5a6a85',
    fontWeight: 500,
  },
};