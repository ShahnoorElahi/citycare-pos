import React, { useMemo, useState } from 'react';
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
// 📊 10 YEARS OF RECOVERY DATA (2016 - 2025)
// 120 monthly entries
// ============================================================
const recoveryData = [
  // 2016
  { date: '2016-01-01', month: 'Jan 2016', recovered: 22, notRecovered: 9 },
  { date: '2016-02-01', month: 'Feb 2016', recovered: 24, notRecovered: 8 },
  { date: '2016-03-01', month: 'Mar 2016', recovered: 25, notRecovered: 7 },
  { date: '2016-04-01', month: 'Apr 2016', recovered: 26, notRecovered: 7 },
  { date: '2016-05-01', month: 'May 2016', recovered: 27, notRecovered: 6 },
  { date: '2016-06-01', month: 'Jun 2016', recovered: 28, notRecovered: 6 },
  { date: '2016-07-01', month: 'Jul 2016', recovered: 26, notRecovered: 8 },
  { date: '2016-08-01', month: 'Aug 2016', recovered: 25, notRecovered: 8 },
  { date: '2016-09-01', month: 'Sep 2016', recovered: 24, notRecovered: 9 },
  { date: '2016-10-01', month: 'Oct 2016', recovered: 23, notRecovered: 9 },
  { date: '2016-11-01', month: 'Nov 2016', recovered: 22, notRecovered: 10 },
  { date: '2016-12-01', month: 'Dec 2016', recovered: 24, notRecovered: 8 },
  // 2017
  { date: '2017-01-01', month: 'Jan 2017', recovered: 25, notRecovered: 8 },
  { date: '2017-02-01', month: 'Feb 2017', recovered: 26, notRecovered: 7 },
  { date: '2017-03-01', month: 'Mar 2017', recovered: 27, notRecovered: 6 },
  { date: '2017-04-01', month: 'Apr 2017', recovered: 29, notRecovered: 5 },
  { date: '2017-05-01', month: 'May 2017', recovered: 30, notRecovered: 5 },
  { date: '2017-06-01', month: 'Jun 2017', recovered: 29, notRecovered: 6 },
  { date: '2017-07-01', month: 'Jul 2017', recovered: 28, notRecovered: 7 },
  { date: '2017-08-01', month: 'Aug 2017', recovered: 27, notRecovered: 8 },
  { date: '2017-09-01', month: 'Sep 2017', recovered: 26, notRecovered: 8 },
  { date: '2017-10-01', month: 'Oct 2017', recovered: 25, notRecovered: 9 },
  { date: '2017-11-01', month: 'Nov 2017', recovered: 24, notRecovered: 10 },
  { date: '2017-12-01', month: 'Dec 2017', recovered: 26, notRecovered: 8 },
  // 2018
  { date: '2018-01-01', month: 'Jan 2018', recovered: 27, notRecovered: 7 },
  { date: '2018-02-01', month: 'Feb 2018', recovered: 28, notRecovered: 6 },
  { date: '2018-03-01', month: 'Mar 2018', recovered: 30, notRecovered: 5 },
  { date: '2018-04-01', month: 'Apr 2018', recovered: 31, notRecovered: 4 },
  { date: '2018-05-01', month: 'May 2018', recovered: 32, notRecovered: 4 },
  { date: '2018-06-01', month: 'Jun 2018', recovered: 31, notRecovered: 5 },
  { date: '2018-07-01', month: 'Jul 2018', recovered: 30, notRecovered: 6 },
  { date: '2018-08-01', month: 'Aug 2018', recovered: 29, notRecovered: 7 },
  { date: '2018-09-01', month: 'Sep 2018', recovered: 28, notRecovered: 7 },
  { date: '2018-10-01', month: 'Oct 2018', recovered: 27, notRecovered: 8 },
  { date: '2018-11-01', month: 'Nov 2018', recovered: 26, notRecovered: 9 },
  { date: '2018-12-01', month: 'Dec 2018', recovered: 28, notRecovered: 7 },
  // 2019
  { date: '2019-01-01', month: 'Jan 2019', recovered: 29, notRecovered: 6 },
  { date: '2019-02-01', month: 'Feb 2019', recovered: 30, notRecovered: 5 },
  { date: '2019-03-01', month: 'Mar 2019', recovered: 32, notRecovered: 4 },
  { date: '2019-04-01', month: 'Apr 2019', recovered: 33, notRecovered: 3 },
  { date: '2019-05-01', month: 'May 2019', recovered: 34, notRecovered: 3 },
  { date: '2019-06-01', month: 'Jun 2019', recovered: 33, notRecovered: 4 },
  { date: '2019-07-01', month: 'Jul 2019', recovered: 32, notRecovered: 5 },
  { date: '2019-08-01', month: 'Aug 2019', recovered: 31, notRecovered: 6 },
  { date: '2019-09-01', month: 'Sep 2019', recovered: 30, notRecovered: 6 },
  { date: '2019-10-01', month: 'Oct 2019', recovered: 29, notRecovered: 7 },
  { date: '2019-11-01', month: 'Nov 2019', recovered: 28, notRecovered: 8 },
  { date: '2019-12-01', month: 'Dec 2019', recovered: 30, notRecovered: 6 },
  // 2020 (Dip due to pandemic)
  { date: '2020-01-01', month: 'Jan 2020', recovered: 25, notRecovered: 10 },
  { date: '2020-02-01', month: 'Feb 2020', recovered: 24, notRecovered: 11 },
  { date: '2020-03-01', month: 'Mar 2020', recovered: 21, notRecovered: 14 },
  { date: '2020-04-01', month: 'Apr 2020', recovered: 20, notRecovered: 15 },
  { date: '2020-05-01', month: 'May 2020', recovered: 22, notRecovered: 13 },
  { date: '2020-06-01', month: 'Jun 2020', recovered: 23, notRecovered: 12 },
  { date: '2020-07-01', month: 'Jul 2020', recovered: 24, notRecovered: 11 },
  { date: '2020-08-01', month: 'Aug 2020', recovered: 25, notRecovered: 10 },
  { date: '2020-09-01', month: 'Sep 2020', recovered: 26, notRecovered: 9 },
  { date: '2020-10-01', month: 'Oct 2020', recovered: 27, notRecovered: 8 },
  { date: '2020-11-01', month: 'Nov 2020', recovered: 26, notRecovered: 9 },
  { date: '2020-12-01', month: 'Dec 2020', recovered: 28, notRecovered: 7 },
  // 2021
  { date: '2021-01-01', month: 'Jan 2021', recovered: 29, notRecovered: 6 },
  { date: '2021-02-01', month: 'Feb 2021', recovered: 30, notRecovered: 5 },
  { date: '2021-03-01', month: 'Mar 2021', recovered: 31, notRecovered: 4 },
  { date: '2021-04-01', month: 'Apr 2021', recovered: 32, notRecovered: 4 },
  { date: '2021-05-01', month: 'May 2021', recovered: 33, notRecovered: 3 },
  { date: '2021-06-01', month: 'Jun 2021', recovered: 32, notRecovered: 4 },
  { date: '2021-07-01', month: 'Jul 2021', recovered: 31, notRecovered: 5 },
  { date: '2021-08-01', month: 'Aug 2021', recovered: 30, notRecovered: 6 },
  { date: '2021-09-01', month: 'Sep 2021', recovered: 29, notRecovered: 7 },
  { date: '2021-10-01', month: 'Oct 2021', recovered: 28, notRecovered: 8 },
  { date: '2021-11-01', month: 'Nov 2021', recovered: 27, notRecovered: 9 },
  { date: '2021-12-01', month: 'Dec 2021', recovered: 29, notRecovered: 7 },
  // 2022
  { date: '2022-01-01', month: 'Jan 2022', recovered: 30, notRecovered: 6 },
  { date: '2022-02-01', month: 'Feb 2022', recovered: 31, notRecovered: 5 },
  { date: '2022-03-01', month: 'Mar 2022', recovered: 32, notRecovered: 4 },
  { date: '2022-04-01', month: 'Apr 2022', recovered: 33, notRecovered: 4 },
  { date: '2022-05-01', month: 'May 2022', recovered: 34, notRecovered: 3 },
  { date: '2022-06-01', month: 'Jun 2022', recovered: 33, notRecovered: 4 },
  { date: '2022-07-01', month: 'Jul 2022', recovered: 32, notRecovered: 5 },
  { date: '2022-08-01', month: 'Aug 2022', recovered: 31, notRecovered: 6 },
  { date: '2022-09-01', month: 'Sep 2022', recovered: 30, notRecovered: 6 },
  { date: '2022-10-01', month: 'Oct 2022', recovered: 29, notRecovered: 7 },
  { date: '2022-11-01', month: 'Nov 2022', recovered: 28, notRecovered: 8 },
  { date: '2022-12-01', month: 'Dec 2022', recovered: 30, notRecovered: 6 },
  // 2023
  { date: '2023-01-01', month: 'Jan 2023', recovered: 31, notRecovered: 5 },
  { date: '2023-02-01', month: 'Feb 2023', recovered: 32, notRecovered: 4 },
  { date: '2023-03-01', month: 'Mar 2023', recovered: 33, notRecovered: 3 },
  { date: '2023-04-01', month: 'Apr 2023', recovered: 34, notRecovered: 3 },
  { date: '2023-05-01', month: 'May 2023', recovered: 35, notRecovered: 2 },
  { date: '2023-06-01', month: 'Jun 2023', recovered: 34, notRecovered: 3 },
  { date: '2023-07-01', month: 'Jul 2023', recovered: 33, notRecovered: 4 },
  { date: '2023-08-01', month: 'Aug 2023', recovered: 32, notRecovered: 5 },
  { date: '2023-09-01', month: 'Sep 2023', recovered: 31, notRecovered: 6 },
  { date: '2023-10-01', month: 'Oct 2023', recovered: 30, notRecovered: 7 },
  { date: '2023-11-01', month: 'Nov 2023', recovered: 29, notRecovered: 8 },
  { date: '2023-12-01', month: 'Dec 2023', recovered: 31, notRecovered: 6 },
  // 2024
  { date: '2024-01-01', month: 'Jan 2024', recovered: 32, notRecovered: 5 },
  { date: '2024-02-01', month: 'Feb 2024', recovered: 33, notRecovered: 4 },
  { date: '2024-03-01', month: 'Mar 2024', recovered: 34, notRecovered: 3 },
  { date: '2024-04-01', month: 'Apr 2024', recovered: 35, notRecovered: 3 },
  { date: '2024-05-01', month: 'May 2024', recovered: 36, notRecovered: 2 },
  { date: '2024-06-01', month: 'Jun 2024', recovered: 35, notRecovered: 3 },
  { date: '2024-07-01', month: 'Jul 2024', recovered: 34, notRecovered: 4 },
  { date: '2024-08-01', month: 'Aug 2024', recovered: 33, notRecovered: 5 },
  { date: '2024-09-01', month: 'Sep 2024', recovered: 32, notRecovered: 6 },
  { date: '2024-10-01', month: 'Oct 2024', recovered: 31, notRecovered: 7 },
  { date: '2024-11-01', month: 'Nov 2024', recovered: 30, notRecovered: 8 },
  { date: '2024-12-01', month: 'Dec 2024', recovered: 32, notRecovered: 6 },
  // 2025
  { date: '2025-01-01', month: 'Jan 2025', recovered: 33, notRecovered: 5 },
  { date: '2025-02-01', month: 'Feb 2025', recovered: 34, notRecovered: 4 },
  { date: '2025-03-01', month: 'Mar 2025', recovered: 35, notRecovered: 3 },
  { date: '2025-04-01', month: 'Apr 2025', recovered: 31, notRecovered: 6 },
  { date: '2025-05-01', month: 'May 2025', recovered: 31, notRecovered: 4 },
  { date: '2025-06-01', month: 'Jun 2025', recovered: 30, notRecovered: 5 },
  { date: '2025-07-01', month: 'Jul 2025', recovered: 31, notRecovered: 3 },
  { date: '2025-08-01', month: 'Aug 2025', recovered: 29, notRecovered: 6 },
  { date: '2025-09-01', month: 'Sep 2025', recovered: 27, notRecovered: 6 },
  { date: '2025-10-01', month: 'Oct 2025', recovered: 28, notRecovered: 4 },
];

// Custom Chart.js plugin to draw the percentage text above the bars
const topLabelsPlugin = {
  id: 'topLabels',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    ctx.save();
    
    // Only draw labels if we have 20 or fewer bars to avoid clutter
    if (data.labels.length > 24) return;

    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      const recovered = data.datasets[0].data[index];
      const notRecovered = data.datasets[1].data[index];
      const total = recovered + notRecovered;
      
      if (total === 0) return;
      const percentage = Math.round((recovered / total) * 100) + '%';
      
      const x = bar.x;
      const y = bar.y - 12; 

      ctx.fillStyle = '#1a1a4b'; 
      ctx.font = '600 14px system-ui, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(percentage, x, y);
    });
    
    ctx.restore();
  },
};

export default function RecoveryRateGraph({ readings = recoveryData }) {
  const dataMin = readings[0]?.date;
  const dataMax = readings[readings.length - 1]?.date;
  
  const [startDate, setStartDate] = useState(() => {
    // Default to last 12 months
    const end = new Date(dataMax);
    end.setFullYear(end.getFullYear() - 1);
    return end.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(dataMax);
  const [preset, setPreset] = useState('1yr');

  const applyPreset = (val) => {
    setPreset(val);
    const end = new Date(dataMax);
    
    if (val === 'all') {
      setStartDate(dataMin);
    } else {
      const start = new Date(end);
      start.setFullYear(end.getFullYear() - val);
      setStartDate(start.toISOString().slice(0, 10));
    }
    setEndDate(dataMax);
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

  const chartData = useMemo(() => {
    // Dynamically adjust bar width based on how many bars are visible
    const barWidth = filteredData.length > 60 ? 0.3 : filteredData.length > 30 ? 0.5 : 0.6;

    return {
      labels: filteredData.map((item) => item.month),
      datasets: [
        {
          label: 'Recovered',
          data: filteredData.map((item) => item.recovered),
          backgroundColor: '#2dce89', 
          barPercentage: barWidth,
          categoryPercentage: 0.8,
          borderRadius: filteredData.length > 60 ? 1 : 4,
        },
        {
          label: 'Not Recovered',
          data: filteredData.map((item) => item.notRecovered),
          backgroundColor: '#dce2f5', 
          barPercentage: barWidth,
          categoryPercentage: 0.8,
          borderRadius: filteredData.length > 60 ? 1 : 4,
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 30, right: 10, left: 10 }, 
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end', 
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded', 
            boxWidth: 12,
            boxHeight: 12,
            padding: 20,
            color: '#5a6a85',
            font: { size: 13, weight: '500' },
          },
        },
        tooltip: {
          backgroundColor: '#1a1a4b',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              let value = context.parsed.y;
              const index = context.dataIndex;
              const total = filteredData[index].recovered + filteredData[index].notRecovered;
              const pct = Math.round((value / total) * 100);
              return ` ${label}: ${value} (${pct}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true, 
          grid: { display: false, drawBorder: false },
          ticks: {
            color: '#4a5568',
            font: { size: 11, weight: '500' },
            padding: 8,
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,          // 👈 Automatically skips labels if crowded
            maxTicksLimit: 15,       // 👈 Keeps max 15 labels on the X-axis
          },
          border: { display: false },
        },
        y: {
          stacked: true, 
          beginAtZero: true,
          max: 50, 
          grid: {
            color: '#f0f3f8',
            drawBorder: false,
            lineWidth: 1,
          },
          ticks: {
            color: '#4a5568',
            font: { size: 12, weight: '500' },
            stepSize: 10,
            padding: 10,
          },
          border: { display: false, dash: [4, 4] },
        },
      },
    }),
    [filteredData]
  );

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Recovery Rate (10-Year History)</h2>
        
        <div style={styles.controls}>
          <div style={styles.presetGroup}>
            <button
              onClick={() => applyPreset(1)}
              style={{ ...styles.btn, ...(preset === 1 ? styles.btnActive : {}) }}
            >
              1 Yr
            </button>
            <button
              onClick={() => applyPreset(3)}
              style={{ ...styles.btn, ...(preset === 3 ? styles.btnActive : {}) }}
            >
              3 Yrs
            </button>
            <button
              onClick={() => applyPreset(5)}
              style={{ ...styles.btn, ...(preset === 5 ? styles.btnActive : {}) }}
            >
              5 Yrs
            </button>
            <button
              onClick={() => applyPreset('all')}
              style={{ ...styles.btn, ...(preset === 'all' ? styles.btnActive : {}) }}
            >
              All
            </button>
          </div>

          <div style={styles.dateGroup}>
            <input
              type="date"
              value={startDate}
              min={dataMin}
              max={endDate || dataMax}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPreset('custom');
              }}
              style={styles.dateInput}
            />
            <span style={styles.arrow}>→</span>
            <input
              type="date"
              value={endDate}
              min={startDate || dataMin}
              max={dataMax}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPreset('custom');
              }}
              style={styles.dateInput}
            />
          </div>
        </div>
      </div>

      <div style={styles.chartWrapper}>
        {filteredData.length === 0 ? (
          <div style={styles.empty}>
            No data available for this date range.
          </div>
        ) : (
          <Bar
            data={chartData}
            options={chartOptions}
            plugins={[topLabelsPlugin]} 
          />
        )}
      </div>
    </div>
  );
}

// ---- Inline styles ----
const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px 32px',
    width: '100%',
    maxWidth: '1000px',
    margin: '2rem auto',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    border: '1px solid #edf2f7',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  heading: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a1a4b',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  presetGroup: {
    display: 'flex',
    gap: '6px',
  },
  btn: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#475569',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnActive: {
    background: '#2dce89',
    borderColor: '#2dce89',
    color: '#fff',
  },
  dateGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '4px 8px',
  },
  dateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: '0.8rem',
    color: '#1e293b',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  arrow: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  chartWrapper: {
    position: 'relative',
    height: '400px',
    width: '100%',
  },
  empty: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '0.95rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
  },
};