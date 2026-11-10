import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ============================================================
// 📊 BLOOD PRESSURE DATA ARRAY — 2 YEARS (weekly readings)
// 104 entries · 2023-01-02 → 2024-12-23
// ============================================================
const bpData = [
  // -------- 2023 --------
  { date: '2023-01-02', systolic: 132, diastolic: 84 },
  { date: '2023-01-09', systolic: 128, diastolic: 82 },
  { date: '2023-01-16', systolic: 126, diastolic: 81 },
  { date: '2023-01-23', systolic: 129, diastolic: 83 },
  { date: '2023-01-30', systolic: 131, diastolic: 84 },
  { date: '2023-02-06', systolic: 127, diastolic: 80 },
  { date: '2023-02-13', systolic: 124, diastolic: 79 },
  { date: '2023-02-20', systolic: 122, diastolic: 78 },
  { date: '2023-02-27', systolic: 125, diastolic: 79 },
  { date: '2023-03-06', systolic: 121, diastolic: 77 },
  { date: '2023-03-13', systolic: 119, diastolic: 76 },
  { date: '2023-03-20', systolic: 122, diastolic: 78 },
  { date: '2023-03-27', systolic: 118, diastolic: 75 },
  { date: '2023-04-03', systolic: 117, diastolic: 74 },
  { date: '2023-04-10', systolic: 119, diastolic: 76 },
  { date: '2023-04-17', systolic: 116, diastolic: 74 },
  { date: '2023-04-24', systolic: 118, diastolic: 75 },
  { date: '2023-05-01', systolic: 115, diastolic: 73 },
  { date: '2023-05-08', systolic: 114, diastolic: 72 },
  { date: '2023-05-15', systolic: 116, diastolic: 74 },
  { date: '2023-05-22', systolic: 113, diastolic: 72 },
  { date: '2023-05-29', systolic: 115, diastolic: 73 },
  { date: '2023-06-05', systolic: 112, diastolic: 71 },
  { date: '2023-06-12', systolic: 114, diastolic: 72 },
  { date: '2023-06-19', systolic: 111, diastolic: 70 },
  { date: '2023-06-26', systolic: 113, diastolic: 71 },
  { date: '2023-07-03', systolic: 110, diastolic: 70 },
  { date: '2023-07-10', systolic: 112, diastolic: 71 },
  { date: '2023-07-17', systolic: 114, diastolic: 73 },
  { date: '2023-07-24', systolic: 111, diastolic: 71 },
  { date: '2023-07-31', systolic: 113, diastolic: 72 },
  { date: '2023-08-07', systolic: 116, diastolic: 74 },
  { date: '2023-08-14', systolic: 118, diastolic: 76 },
  { date: '2023-08-21', systolic: 117, diastolic: 75 },
  { date: '2023-08-28', systolic: 119, diastolic: 77 },
  { date: '2023-09-04', systolic: 121, diastolic: 78 },
  { date: '2023-09-11', systolic: 123, diastolic: 79 },
  { date: '2023-09-18', systolic: 120, diastolic: 77 },
  { date: '2023-09-25', systolic: 122, diastolic: 78 },
  { date: '2023-10-02', systolic: 125, diastolic: 80 },
  { date: '2023-10-09', systolic: 127, diastolic: 81 },
  { date: '2023-10-16', systolic: 124, diastolic: 79 },
  { date: '2023-10-23', systolic: 126, diastolic: 81 },
  { date: '2023-10-30', systolic: 129, diastolic: 82 },
  { date: '2023-11-06', systolic: 131, diastolic: 84 },
  { date: '2023-11-13', systolic: 128, diastolic: 82 },
  { date: '2023-11-20', systolic: 130, diastolic: 83 },
  { date: '2023-11-27', systolic: 133, diastolic: 85 },
  { date: '2023-12-04', systolic: 135, diastolic: 86 },
  { date: '2023-12-11', systolic: 132, diastolic: 84 },
  { date: '2023-12-18', systolic: 134, diastolic: 85 },
  { date: '2023-12-25', systolic: 136, diastolic: 87 },

  // -------- 2024 --------
  { date: '2024-01-01', systolic: 138, diastolic: 88 },
  { date: '2024-01-08', systolic: 135, diastolic: 86 },
  { date: '2024-01-15', systolic: 133, diastolic: 85 },
  { date: '2024-01-22', systolic: 136, diastolic: 87 },
  { date: '2024-01-29', systolic: 139, diastolic: 88 },
  { date: '2024-02-05', systolic: 134, diastolic: 85 },
  { date: '2024-02-12', systolic: 131, diastolic: 84 },
  { date: '2024-02-19', systolic: 129, diastolic: 82 },
  { date: '2024-02-26', systolic: 132, diastolic: 84 },
  { date: '2024-03-04', systolic: 128, diastolic: 81 },
  { date: '2024-03-11', systolic: 126, diastolic: 80 },
  { date: '2024-03-18', systolic: 129, diastolic: 82 },
  { date: '2024-03-25', systolic: 125, diastolic: 79 },
  { date: '2024-04-01', systolic: 123, diastolic: 78 },
  { date: '2024-04-08', systolic: 125, diastolic: 79 },
  { date: '2024-04-15', systolic: 122, diastolic: 78 },
  { date: '2024-04-22', systolic: 124, diastolic: 79 },
  { date: '2024-04-29', systolic: 121, diastolic: 77 },
  { date: '2024-05-06', systolic: 120, diastolic: 76 },
  { date: '2024-05-13', systolic: 122, diastolic: 78 },
  { date: '2024-05-20', systolic: 119, diastolic: 76 },
  { date: '2024-05-27', systolic: 121, diastolic: 77 },
  { date: '2024-06-03', systolic: 118, diastolic: 75 },
  { date: '2024-06-10', systolic: 120, diastolic: 76 },
  { date: '2024-06-17', systolic: 117, diastolic: 74 },
  { date: '2024-06-24', systolic: 119, diastolic: 76 },
  { date: '2024-07-01', systolic: 116, diastolic: 74 },
  { date: '2024-07-08', systolic: 118, diastolic: 75 },
  { date: '2024-07-15', systolic: 120, diastolic: 77 },
  { date: '2024-07-22', systolic: 117, diastolic: 75 },
  { date: '2024-07-29', systolic: 119, diastolic: 76 },
  { date: '2024-08-05', systolic: 122, diastolic: 78 },
  { date: '2024-08-12', systolic: 124, diastolic: 79 },
  { date: '2024-08-19', systolic: 123, diastolic: 79 },
  { date: '2024-08-26', systolic: 125, diastolic: 80 },
  { date: '2024-09-02', systolic: 127, diastolic: 81 },
  { date: '2024-09-09', systolic: 129, diastolic: 82 },
  { date: '2024-09-16', systolic: 126, diastolic: 80 },
  { date: '2024-09-23', systolic: 128, diastolic: 82 },
  { date: '2024-09-30', systolic: 131, diastolic: 83 },
  { date: '2024-10-07', systolic: 133, diastolic: 85 },
  { date: '2024-10-14', systolic: 130, diastolic: 83 },
  { date: '2024-10-21', systolic: 132, diastolic: 84 },
  { date: '2024-10-28', systolic: 135, diastolic: 86 },
  { date: '2024-11-04', systolic: 137, diastolic: 87 },
  { date: '2024-11-11', systolic: 134, diastolic: 85 },
  { date: '2024-11-18', systolic: 136, diastolic: 87 },
  { date: '2024-11-25', systolic: 139, diastolic: 88 },
  { date: '2024-12-02', systolic: 141, diastolic: 90 },
  { date: '2024-12-09', systolic: 138, diastolic: 88 },
  { date: '2024-12-16', systolic: 140, diastolic: 89 },
  { date: '2024-12-23', systolic: 142, diastolic: 90 },
];

const formatShortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });

// Presets updated for 2-year data
const PRESETS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '1 year', value: 365 },
  { label: 'All (2 yrs)', value: 'all' },
];

export default function BloodPressureGraph({ readings = bpData }) {
  const dataMin = readings[0]?.date;
  const dataMax = readings[readings.length - 1]?.date;

  const [preset, setPreset] = useState(90); // default: last 90 days
  const [startDate, setStartDate] = useState(() => {
    // default start = 90 days before last entry
    const end = new Date(dataMax);
    end.setDate(end.getDate() - 90);
    return end.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(dataMax);

  const applyPreset = (value) => {
    setPreset(value);
    if (value === 'all') {
      setStartDate(dataMin);
      setEndDate(dataMax);
    } else {
      const end = new Date(dataMax);
      const start = new Date(end);
      start.setDate(end.getDate() - value);
      setStartDate(start.toISOString().slice(0, 10));
      setEndDate(dataMax);
    }
  };

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    setPreset('custom');
  };
  const handleEndChange = (e) => {
    setEndDate(e.target.value);
    setPreset('custom');
  };

  const filteredData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return readings.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
  }, [readings, startDate, endDate]);

  const chartData = useMemo(
    () => ({
      labels: filteredData.map((item) => formatShortDate(item.date)),
      datasets: [
        {
          label: 'Systolic (mmHg)',
          data: filteredData.map((item) => item.systolic),
          borderColor: '#d94f4f',
          backgroundColor: 'rgba(217, 79, 79, 0.08)',
          pointBackgroundColor: '#d94f4f',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: filteredData.length > 40 ? 0 : filteredData.length > 15 ? 2 : 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Diastolic (mmHg)',
          data: filteredData.map((item) => item.diastolic),
          borderColor: '#2a7faa',
          backgroundColor: 'rgba(42, 127, 170, 0.06)',
          pointBackgroundColor: '#2a7faa',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: filteredData.length > 40 ? 0 : filteredData.length > 15 ? 2 : 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
        },
      ],
    }),
    [filteredData]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#1f4a6b',
            font: { size: 13, weight: '600' },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 18,
          },
        },
        tooltip: {
          backgroundColor: '#0b2b3f',
          titleColor: '#e0f0ff',
          bodyColor: '#d4e9fa',
          borderColor: '#2a7faa',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            title: (items) => {
              const idx = items[0].dataIndex;
              return filteredData[idx]?.date ?? '';
            },
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} mmHg`,
          },
        },
      },
      scales: {
        y: {
          min: 60,
          max: 150,               // 👈 raised max for higher systolic values
          grid: { color: '#e2edf5' },
          title: {
            display: true,
            text: 'Pressure (mmHg)',
            color: '#3a5d77',
            font: { size: 12, weight: '500' },
          },
          ticks: { stepSize: 10, color: '#2a4b64' },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: '#3a5d77',
            font: { size: 11, weight: '500' },
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 20,
          },
        },
      },
      interaction: { mode: 'index', intersect: false },
    }),
    [filteredData]
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          🩸 Blood Pressure Readings
          <span style={styles.badge}>
            {filteredData.length} / {readings.length} entries
          </span>
          <span style={styles.yearTag}>2-year history</span>
        </h2>

        <div style={styles.controls}>
          <div style={styles.row}>
            <span style={styles.label}>Quick range:</span>
            <div style={styles.presetGroup}>
              {PRESETS.map((opt) => {
                const isActive = preset === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    onClick={() => applyPreset(opt.value)}
                    style={{
                      ...styles.presetBtn,
                      ...(isActive ? styles.presetBtnActive : {}),
                    }}
                    aria-pressed={isActive}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Custom range:</span>
            <div style={styles.dateGroup}>
              <label style={styles.dateField}>
                <span style={styles.dateFieldLabel}>From</span>
                <input
                  type="date"
                  value={startDate}
                  min={dataMin}
                  max={endDate || dataMax}
                  onChange={handleStartChange}
                  style={styles.dateInput}
                />
              </label>
              <span style={styles.arrow}>→</span>
              <label style={styles.dateField}>
                <span style={styles.dateFieldLabel}>To</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || dataMin}
                  max={dataMax}
                  onChange={handleEndChange}
                  style={styles.dateInput}
                />
              </label>
              {preset === 'custom' && (
                <span style={styles.customTag}>custom</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.chartWrapper}>
          {filteredData.length === 0 ? (
            <div style={styles.empty}>
              No readings in this date range. Try widening the selection.
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        <div style={styles.summary}>
          <span>
            Showing <strong>{startDate}</strong> → <strong>{endDate}</strong>
          </span>
          <span style={styles.summaryDot}>•</span>
          <span>
            Avg sys:{' '}
            <strong>
              {filteredData.length
                ? Math.round(
                    filteredData.reduce((s, r) => s + r.systolic, 0) /
                      filteredData.length
                  )
                : '–'}{' '}
              mmHg
            </strong>
          </span>
          <span style={styles.summaryDot}>•</span>
          <span>
            Avg dia:{' '}
            <strong>
              {filteredData.length
                ? Math.round(
                    filteredData.reduce((s, r) => s + r.diastolic, 0) /
                      filteredData.length
                  )
                : '–'}{' '}
              mmHg
            </strong>
          </span>
          <span style={styles.summaryDot}>•</span>
          <span>
            Peak sys:{' '}
            <strong>
              {filteredData.length
                ? Math.max(...filteredData.map((r) => r.systolic))
                : '–'}{' '}
              mmHg
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ---- Inline styles ----
const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem 1.5rem',
    background: 'linear-gradient(145deg, #f8fafc 0%, #eef2f6 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '2rem 2.4rem',
    width: '100%',
    maxWidth: '1280px',
    boxShadow: '0 20px 40px -12px rgba(0, 40, 60, 0.15)',
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
    fontSize: '1.7rem',
    color: '#0b2b3f',
    flexWrap: 'wrap',
  },
  badge: {
    background: '#e5f0fa',
    color: '#165a7a',
    border: '1px solid #b9d4e8',
    borderRadius: '999px',
    fontSize: '0.8rem',
    padding: '4px 12px',
    fontWeight: 600,
  },
  yearTag: {
    background: '#fff4e5',
    border: '1px solid #ffd9a0',
    color: '#7a4a00',
    borderRadius: '999px',
    fontSize: '0.75rem',
    padding: '4px 12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  controls: {
    margin: '18px 0 22px 0',
    paddingBottom: '16px',
    borderBottom: '1px solid #dceaf2',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px 24px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  label: {
    color: '#506e85',
    fontSize: '0.88rem',
    fontWeight: 600,
    minWidth: '100px',
  },
  presetGroup: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  presetBtn: {
    background: '#f3f8fd',
    border: '1px solid #c9deef',
    color: '#1b4b68',
    borderRadius: '999px',
    padding: '6px 14px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  presetBtnActive: {
    background: '#2a7faa',
    borderColor: '#2a7faa',
    color: '#fff',
    boxShadow: '0 4px 10px -2px rgba(42, 127, 170, 0.5)',
  },
  dateGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  dateField: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#f3f8fd',
    border: '1px solid #c9deef',
    borderRadius: '10px',
    padding: '4px 10px',
  },
  dateFieldLabel: {
    fontSize: '0.78rem',
    color: '#506e85',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  dateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: '0.88rem',
    color: '#0b2b3f',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  arrow: {
    color: '#506e85',
    fontSize: '1rem',
    fontWeight: 700,
  },
  customTag: {
    background: '#fff4e5',
    border: '1px solid #ffd9a0',
    color: '#7a4a00',
    fontSize: '0.72rem',
    fontWeight: 700,
    borderRadius: '999px',
    padding: '3px 10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  chartWrapper: {
    position: 'relative',
    height: '460px',
    width: '100%',
  },
  empty: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7a93a8',
    fontSize: '0.95rem',
    background: '#f7fbfe',
    borderRadius: '16px',
    border: '1px dashed #c9deef',
  },
  summary: {
    marginTop: '22px',
    background: '#f3f8fd',
    border: '1px solid #c9deef',
    borderRadius: '14px',
    padding: '14px 18px',
    fontSize: '0.88rem',
    color: '#1b4b68',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  summaryDot: {
    color: '#9fb8cb',
  },
};