import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import DoughnutChart from './components/DoughnutChart';
import PieChart from './components/PieChart';
import PolarAreaChart from './components/PolarAreaChart';
import RadarChart from './components/RadarChart';
import './App.css';

function App() {
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [doughnutChartData, setDoughnutChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [polarAreaChartData, setPolarAreaChartData] = useState(null);
  const [radarChartData, setRadarChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/data.json');
        const data = result.data;

        if (!Array.isArray(data)) {
          throw new Error('Data fetched is not an array');
        }

        const processedData = processAlertData(data);
        setLineChartData(processedData.lineChartData);
        setBarChartData(processedData.barChartData);
        setDoughnutChartData(processedData.doughnutChartData);
        setPieChartData(processedData.pieChartData);
        setPolarAreaChartData(processedData.polarAreaChartData);
        setRadarChartData(processedData.radarChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const processAlertData = (data) => {
    const categories = {};
    const severities = {};
    const protocols = {};
    const srcIps = {};
    const destIps = {};
    const timeSeries = {};

    data.forEach(alert => {
      const category = alert.alert.category;
      const severity = alert.alert.severity;
      const protocol = alert.proto;
      const srcIp = alert.src_ip;
      const destIp = alert.dest_ip;
      const timestamp = new Date(alert.timestamp).toLocaleDateString();

      if (!categories[category]) categories[category] = 0;
      if (!severities[severity]) severities[severity] = 0;
      if (!protocols[protocol]) protocols[protocol] = 0;
      if (!srcIps[srcIp]) srcIps[srcIp] = 0;
      if (!destIps[destIp]) destIps[destIp] = 0;
      if (!timeSeries[timestamp]) timeSeries[timestamp] = 0;

      categories[category]++;
      severities[severity]++;
      protocols[protocol]++;
      srcIps[srcIp]++;
      destIps[destIp]++;
      timeSeries[timestamp]++;
    });

    return {
      lineChartData: {
        labels: Object.keys(timeSeries),
        values: Object.values(timeSeries)
      },
      barChartData: {
        labels: Object.keys(categories),
        values: Object.values(categories)
      },
      doughnutChartData: {
        labels: Object.keys(severities),
        values: Object.values(severities)
      },
      pieChartData: {
        labels: Object.keys(srcIps),
        values: Object.values(srcIps)
      },
      polarAreaChartData: {
        labels: Object.keys(destIps),
        values: Object.values(destIps)
      },
      radarChartData: {
        labels: Object.keys(protocols),
        values: Object.values(protocols)
      }
    };
  };

  return (
    <div className="App">
      {lineChartData && barChartData && doughnutChartData && pieChartData && polarAreaChartData && radarChartData && (
        <>
          <h1>Dashboard</h1>
          <div className="chart-container">
            <div className="chart-wrapper">
              <h2>Line Chart</h2>
              <LineChart data={lineChartData} />
            </div>
            <div className="chart-wrapper">
              <h2>Bar Chart</h2>
              <BarChart data={barChartData} />
            </div>
            <div className="chart-wrapper">
              <h2>Doughnut Chart</h2>
              <DoughnutChart data={doughnutChartData} />
            </div>
            <div className="chart-wrapper">
              <h2>Pie Chart</h2>
              <PieChart data={pieChartData} />
            </div>
            <div className="chart-wrapper">
              <h2>Polar Area Chart</h2>
              <PolarAreaChart data={polarAreaChartData} />
            </div>
            <div className="chart-wrapper">
              <h2>Radar Chart</h2>
              <RadarChart data={radarChartData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
