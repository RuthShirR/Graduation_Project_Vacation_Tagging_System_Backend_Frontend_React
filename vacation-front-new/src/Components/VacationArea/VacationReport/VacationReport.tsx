import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveAs } from 'file-saver';
import './VacationReport.css';
import { RootState } from '../../../Redux/VacationsState';

function VacationReport(): JSX.Element {
  // Get vacations from Redux state
  const vacations = useSelector((state: RootState) => state.vacationsState.vacations);

  // Local state for the CSV data
  const [dataForCSV, setDataForCSV] = useState<string>('');

  useEffect(() => {
    // Create the data for the CSV file based on the vacations
    const csvData: string[] = ['Destination,Followers'];
    vacations.forEach((vacation) => {
      csvData.push(`${vacation.destination},${vacation.followersCount}`);
    });
    setDataForCSV(csvData.join('\n'));
  }, [vacations]);

  // Function to download the CSV data as a file
  const downloadCSV = () => {
    const blob = new Blob([dataForCSV], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'vacation_report.csv');
  };

  // Prepare data for the chart visualization
  const chartData = {
    labels: vacations.map((vacation) => vacation.destination),
    datasets: [
      {
        label: 'Followers',
        data: vacations.map((vacation) => vacation.followersCount),
        backgroundColor: '#2ebae5',
        borderColor: '#2ebae5',
        borderWidth: 1,
      },
    ],
  };

  // Configuration options for the chart display
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Followers',
        },
      },
    },
  };

 
  return (
    <div className="VacationReport">
      <h2>Vacation Followers Report</h2>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <button onClick={downloadCSV}> Download CSV ⬇️ </button>

      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Followers</th>
            </tr>
          </thead>
          <tbody>
            {vacations.map((vacation) => (
              <tr key={vacation.uuid}>
                <td>{vacation.destination}</td>
                <td>{vacation.followersCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VacationReport;



