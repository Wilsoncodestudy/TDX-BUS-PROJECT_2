/*'use client';

import React, { useState, useEffect } from 'react';
import ModernCard from '../components/ModernCard';

const TRA_DESTINATIONS = [
  "基隆", "南港", "台北", "板橋", "桃園", "新竹", "苗栗", "台中", "彰化", "員林", "嘉義", "台南", "高雄", "屏東", "台東", "花蓮", "宜蘭"
];

const HSR_DESTINATIONS = [
  "南港", "台北", "板橋", "桃園", "新竹", "苗栗", "台中", "彰化", "雲林", "嘉義", "台南", "左營"
];

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transportRoute, setTransportRoute] = useState('bus-to-train');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [traData, setTraData] = useState({});

  const itemsPerPage = 15;

  const busScheduleBack101 = [
    "07:15", "09:00", "11:50", "12:30", "12:50", "13:15", "14:00", "14:30", "14:45", "15:40",
    "16:15", "16:45", "17:00", "18:15", "18:50"
  ];

  const busScheduleBack201 = [
    "05:45", "06:30", "07:00", "07:35", "08:00", "08:35", "09:00", "09:35", "10:00", "10:35",
    "11:00", "11:35", "12:05", "13:05", "14:00", "14:35", "15:05", "16:00", "16:35", "17:00",
    "17:35", "18:00", "18:35", "19:00", "19:35", "20:00", "20:35", "21:00", "21:35", "22:00", "22:35"
  ];

  const busFare = 20;

  const addMinutes = (timeStr, mins) => {
    const [hh, mm] = timeStr.split(':').map(Number);
    let total = hh * 60 + mm + mins;
    let h = Math.floor(total / 60) % 24;
    let m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const calcStopTimes = (departure, route) => {
    if (route === '201') {
      return {
        arriveTrain: addMinutes(departure, 11),
        arriveHSR: addMinutes(departure, 53)
      };
    } else {
      return {
        arriveYunKe: addMinutes(departure, 7),
        arriveTrain: addMinutes(addMinutes(departure, 7), 15)
      };
    }
  };

  const filterSchedules = (inputTime, schedule) => {
    if (!inputTime) return [];
    return schedule.filter(t => t >= inputTime);
  };

  const findAllTrainsAfter = (arriveTrainTime, dest) => {
    const trains = traData[dest] || [];
    return trains.filter(train => train.DepartureTime >= arriveTrainTime);
  };

  useEffect(() => {
    fetch('/data/tra.json')
      .then(res => res.json())
      .then(data => setTraData(data))
      .catch(err => console.error('無法載入 tra.json:', err));
  }, []);

  const onSearch = () => {
    if (!time || !destination) {
      alert('請選擇時間與目的地');
      return;
    }

    const filtered101 = filterSchedules(time, busScheduleBack101);
    const filtered201 = filterSchedules(time, busScheduleBack201);

    const formattedResults = [];

    if (transportRoute === 'bus-to-train') {
      filtered101.forEach(depTime => {
        const { arriveYunKe, arriveTrain } = calcStopTimes(depTime, '101');
        const trains = findAllTrainsAfter(arriveTrain, destination);
        trains.forEach(train => {
          formattedResults.push(`101號公車 - 抵達雲林科技大學: ${arriveYunKe}，抵達斗六火車站: ${arriveTrain}，建議搭乘 ${train.TrainNo} 號車，出發時間: ${train.DepartureTime}，抵達 ${destination}火車站，票價: $${busFare + train.Price}`);
        });
      });

      filtered201.forEach(depTime => {
        const { arriveTrain } = calcStopTimes(depTime, '201');
        const trains = findAllTrainsAfter(arriveTrain, destination);
        trains.forEach(train => {
          formattedResults.push(`201號公車 - 抵達雲林科技大學: ${depTime}，抵達斗六火車站: ${arriveTrain}，建議搭乘 ${train.TrainNo} 號車，出發時間: ${train.DepartureTime}，抵達 ${destination}火車站，票價: $${busFare + train.Price}`);
        });
      });
    } else if (transportRoute === 'bus-to-hsr') {
      filtered201.forEach(depTime => {
        const { arriveHSR } = calcStopTimes(depTime, '201');
        formattedResults.push(`201號公車 - 發車時間: ${depTime}，抵達雲林高鐵站: ${arriveHSR}，票價: $${busFare}`);
      });
    }

    setResults(formattedResults.length > 0 ? formattedResults : ['當日無後續班次']);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'blue', fontWeight: 'bold', fontSize: '2rem' }}>
        雲科大交通路線規劃查詢
      </h1>
      <ModernCard title="查詢條件">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>選擇日期：</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />

          <label>選擇時間：</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />

          <label>交通路線：</label>
          <select value={transportRoute} onChange={e => setTransportRoute(e.target.value)}>
            <option value="bus-to-train">公車 → 火車站</option>
            <option value="bus-to-hsr">公車 → 高鐵站</option>
          </select>

          <label>站別：</label>
          <select value={destination} onChange={e => setDestination(e.target.value)}>
            {(transportRoute === 'bus-to-train' ? TRA_DESTINATIONS : HSR_DESTINATIONS).map((dest, i) => (
              <option key={i} value={dest}>{dest}</option>
            ))}
          </select>

          <button onClick={onSearch}>查詢</button>
        </div>
      </ModernCard>

      {results.length > 0 && (
        <ModernCard title="查詢結果" footer={`第 ${currentPage} 頁，共 ${totalPages} 頁`}>
          <ul>
            {currentResults.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>上一頁</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>下一頁</button>
          </div>
        </ModernCard>
      )}
    </main>
  );
}*/
'use client';

import React, { useState, useEffect } from 'react';
import ModernCard from '../components/ModernCard';

const TRA_DESTINATIONS = [
  "基隆", "南港", "台北", "板橋", "桃園", "新竹", "苗栗", "台中", "彰化", "員林", "嘉義", "台南", "高雄", "屏東", "台東", "花蓮", "宜蘭"
];

const HSR_DESTINATIONS = [
  "南港", "台北", "板橋", "桃園", "新竹", "苗栗", "台中", "彰化", "雲林", "嘉義", "台南", "左營"
];

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transportRoute, setTransportRoute] = useState('bus-to-train');
  const [destination, setDestination] = useState('基隆');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [traData, setTraData] = useState({});

  const itemsPerPage = 15;

  const busScheduleBack101 = [
    "07:15", "09:00", "11:50", "12:30", "12:50", "13:15", "14:00", "14:30", "14:45", "15:40",
    "16:15", "16:45", "17:00", "18:15", "18:50"
  ];

  const busScheduleBack201 = [
    "05:45", "06:30", "07:00", "07:35", "08:00", "08:35", "09:00", "09:35", "10:00", "10:35",
    "11:00", "11:35", "12:05", "13:05", "14:00", "14:35", "15:05", "16:00", "16:35", "17:00",
    "17:35", "18:00", "18:35", "19:00", "19:35", "20:00", "20:35", "21:00", "21:35", "22:00", "22:35"
  ];

  const busFare = 20;

  const addMinutes = (timeStr, mins) => {
    const [hh, mm] = timeStr.split(':').map(Number);
    let total = hh * 60 + mm + mins;
    let h = Math.floor(total / 60) % 24;
    let m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const calcStopTimes = (departure, route) => {
    if (route === '201') {
      return {
        arriveTrain: addMinutes(departure, 11),
        arriveHSR: addMinutes(departure, 53)
      };
    } else {
      return {
        arriveYunKe: addMinutes(departure, 7),
        arriveTrain: addMinutes(addMinutes(departure, 7), 15)
      };
    }
  };

  const filterSchedules = (inputTime, schedule) => {
    if (!inputTime) return [];
    return schedule.filter(t => t >= inputTime);
  };

  const findAllTrainsAfter = (arriveTrainTime, dest) => {
    const trains = traData[dest] || [];
    return trains.filter(train => train.DepartureTime >= arriveTrainTime);
  };

  useEffect(() => {
    fetch('/data/tra.json')
      .then(res => res.json())
      .then(data => setTraData(data))
      .catch(err => console.error('無法載入 tra.json:', err));
  }, []);

  const onSearch = () => {
    if (!time) {
      alert('請選擇時間');
      return;
    }

    const filtered101 = filterSchedules(time, busScheduleBack101);
    const filtered201 = filterSchedules(time, busScheduleBack201);

    const formattedResults = [];

    if (transportRoute === 'bus-to-train') {
      filtered101.forEach(depTime => {
        const { arriveYunKe, arriveTrain } = calcStopTimes(depTime, '101');
        const trains = findAllTrainsAfter(arriveTrain, destination);
        trains.forEach(train => {
          formattedResults.push(`101號公車 - 抵達雲林科技大學: ${arriveYunKe}，抵達斗六火車站: ${arriveTrain}，建議搭乘 ${train.TrainNo} 號車，出發時間: ${train.DepartureTime}，抵達 ${destination}火車站，票價: $${busFare + train.Price}`);
        });
      });

      filtered201.forEach(depTime => {
        const { arriveTrain } = calcStopTimes(depTime, '201');
        const trains = findAllTrainsAfter(arriveTrain, destination);
        trains.forEach(train => {
          formattedResults.push(`201號公車 - 抵達雲林科技大學: ${depTime}，抵達斗六火車站: ${arriveTrain}，建議搭乘 ${train.TrainNo} 號車，出發時間: ${train.DepartureTime}，抵達 ${destination}火車站，票價: $${busFare + train.Price}`);
        });
      });
    } else if (transportRoute === 'bus-to-hsr') {
      filtered201.forEach(depTime => {
        const { arriveHSR } = calcStopTimes(depTime, '201');
        formattedResults.push(`201號公車 - 發車時間: ${depTime}，抵達雲林高鐵站: ${arriveHSR}，票價: $${busFare}`);
      });
    }

    setResults(formattedResults.length > 0 ? formattedResults : ['當日無後續班次']);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'blue', fontWeight: 'bold', fontSize: '2rem' }}>
        雲科大交通路線規劃查詢
      </h1>
      <ModernCard title="查詢條件">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>選擇日期：</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />

          <label>選擇時間：</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />

          <label>交通路線：</label>
          <select value={transportRoute} onChange={e => setTransportRoute(e.target.value)}>
            <option value="bus-to-train">公車 → 火車站</option>
            <option value="bus-to-hsr">公車 → 高鐵站</option>
          </select>

          <label>站別：</label>
          <select value={destination} onChange={e => setDestination(e.target.value)}>
            {(transportRoute === 'bus-to-train' ? TRA_DESTINATIONS : HSR_DESTINATIONS).map((dest, i) => (
              <option key={i} value={dest}>{dest}</option>
            ))}
          </select>

          <button onClick={onSearch}>查詢</button>
        </div>
      </ModernCard>

      {results.length > 0 && (
        <ModernCard title="查詢結果" footer={`第 ${currentPage} 頁，共 ${totalPages} 頁`}>
          <ul>
            {currentResults.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>上一頁</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>下一頁</button>
          </div>
        </ModernCard>
      )}
    </main>
  );
}




