import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ============================================================
// 📊 DOSE FREQUENCY DATA ARRAY
// ============================================================
const doseData = [
  { label: 'TID', subLabel: '(3 times daily)', count: 32, color: '#4a8cf7' }, // Blue
  { label: 'BID', subLabel: '(2 times daily)', count: 24, color: '#2dce89' }, // Emerald
  { label: 'Once daily', subLabel: '', count: 18, color: '#a855f7' },         // Purple
  { label: 'As needed', subLabel: '', count: 8, color: '#f97316' },           // Orange
];

// Custom Chart.js plugin to draw the value badges above the bars
const valueBadgePlugin = {
  id: 'valueBadge',
  afterDatasetsDraw(chart) {
    const { ctx, data, chartArea } = chart;
    ctx.save();

    // Only apply if the dataset exists
    if (!data.datasets[0]) return;

    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      const value = data.datasets[0].data[index];
      
      const x = bar.x;
      const y = bar.y;

      // Badge dimensions and styles
      const badgeWidth = 44;
      const badgeHeight = 24;
      const radius = 6;
      const offset = 14; // Gap between top of the bar and the badge

      const badgeX = x - badgeWidth / 2;
      const badgeY = y - badgeHeight - offset;

      // 1. Draw the light background pill
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, radius);
      ctx.fillStyle = '#f0f4f8'; // Very light blue/grey background
      ctx.fill();

      // 2. Draw the text inside the pill
      ctx.fillStyle = '#1a1a4b'; // Dark navy text
      ctx.font = '700 13px system-ui, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value, x, badgeY + badgeHeight / 2 + 1); // +1 for optical centering
    });

    ctx.restore();
  },
};

export default function DoseFrequencyGraph({ readings = doseData }) {
  // ---- Build Chart Data ----
  const chartData = useMemo(() => {
    return {
      labels: readings.map((item) => 
        item.subLabel ? [item.label, item.subLabel] : item.label
      ),
      datasets: [
        {
          label: 'Prescriptions',
          data: readings.map((item) => item.count),
          backgroundColor: readings.map((item) => item.color),
          barPercentage: 0.6, // Controls bar width
          categoryPercentage: 0.8,
          borderRadius: 6,    // Rounded top corners
        },
      ],
    };
  }, [readings]);

  // ---- Chart Options ----
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 50, bottom: 10 }, // Extra top padding for badges
      },
      plugins: {
        legend: { display: false }, // Hide default legend
        tooltip: {
          backgroundColor: '#1a1a4b',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` Prescriptions: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: '#475569',
            font: (context) => {
              // Make the main label (TID) darker/bolder than the sub-label
              return { size: 13, weight: context.tick.label.includes('(') ? '500' : '600' };
            },
            padding: 8,
          },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          max: 40, // Matches the mockup's Y-axis
          grid: {
            color: '#f1f5f9', // Very faint horizontal lines
            drawBorder: false,
          },
          ticks: {
            color: '#64748b',
            font: { size: 12, weight: '500' },
            stepSize: 10,
            padding: 10,
          },
          border: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Dose Frequency</h2>

      <div style={styles.chartWrapper}>
        <Bar
          data={chartData}
          options={chartOptions}
          plugins={[valueBadgePlugin]} // 👈 Injects the custom value badges
        />
      </div>
    </div>
  );
}

// ---- Inline styles ----
const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px 32px',
    width: '100%',
    maxWidth: '650px',
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
    color: '#1a1a4b', // Deep navy matching the mockup
  },
  chartWrapper: {
    position: 'relative',
    height: '320px',
    width: '100%',
  },
};