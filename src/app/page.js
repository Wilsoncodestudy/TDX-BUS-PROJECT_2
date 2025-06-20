
'use client';

import React, { useState, useEffect } from 'react';
import ModernCard from '../components/ModernCard';

const TRA_DESTINATIONS = [
  "基隆", "南港", "台北", "板橋", "桃園", "新竹", "苗栗", "台中", "彰化", "員林", "嘉義", "台南", "高雄", "屏東", "台東", "花蓮", "宜蘭"
];

const busScheduleBack101 = [
  "07:15", "09:00", "11:50", "12:30", "12:50", "13:15", "14:00", "14:30", "14:45", "15:40",
  "16:15", "16:45", "17:00", "18:15", "18:50"
];

const busScheduleBack201 = [
  "05:45", "06:30", "07:00", "07:35", "08:00", "08:35", "09:00", "09:35", "10:00", "10:35",
  "11:00", "11:35", "12:05", "13:05", "14:00", "14:35", "15:05", "16:00", "16:35", "17:00",
  "17:35", "18:00", "18:35", "19:00", "19:35", "20:00", "20:35", "21:00", "21:35", "22:00", "22:35"
];

const addMinutes = (timeStr, mins) => {
  const [hh, mm] = timeStr.split(':').map(Number);
  let total = hh * 60 + mm + mins;
  let h = Math.floor(total / 60) % 24;
  let m = total % 60;
  return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
};

const timeToMinutes = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};


const formatTravelTime = (startTime, endTime) => {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let startTotal = sh * 60 + sm;
  let endTotal = eh * 60 + em;

  if (endTotal < startTotal) endTotal += 24 * 60;

  const diff = endTotal - startTotal;
  const h = Math.floor(diff / 60);
  const m = diff % 60;

  return h + 'h ' + m + 'm';
};

const getColorBasedOnTimeDifference = (userTime, busDeparture) => {
  const [uh, um] = userTime.split(':').map(Number);
  const [bh, bm] = busDeparture.split(':').map(Number);
  let userTotal = uh * 60 + um;
  let busTotal = bh * 60 + bm;

  const diff = busTotal - userTotal;

  if (diff < 0) return 'red';
  if (diff <= 60) return 'green';
  if (diff <= 120) return 'orange';
  return 'red';
};

const filterSchedules = (inputTime, schedule) => {
  if (!inputTime) return [];
  return schedule.filter(t => t >= inputTime);
};

const calcStopTimes = (departure, route) => {
  if (route === '201') {
    return {
      arriveTrain: addMinutes(departure, 11),
      arriveHSR: addMinutes(departure, 53),
    };
  } else {
    return {
      arriveYunKe: addMinutes(departure, 7),
      arriveTrain: addMinutes(addMinutes(departure, 7), 15),
    };
  }
};

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transportRoute, setTransportRoute] = useState('bus-to-train');
  const [destination, setDestination] = useState('基隆');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [traData, setTraData] = useState({});
  const [hsrStations, setHsrStations] = useState([]);
  const [thsrTimetable, setThsrTimetable] = useState([]);

  const itemsPerPage = 15;

useEffect(() => {
  fetch('/data/tra.json')
    .then(res => res.json())
    .then(data => setTraData(data));

  (async () => {
    try {
      const [stationsRes, timetableRes] = await Promise.all([
        fetch('/api/thsrStations'),
        fetch('/api/thsrTimetable'),
      ]);

      if (!stationsRes.ok || !timetableRes.ok) throw new Error('API 錯誤');

      const stations = await stationsRes.json();
      const timetable = await timetableRes.json();

      if (!Array.isArray(stations)) {
        console.error('❌ 高鐵站資料格式錯誤', stations);
        return;
      }

      if (!Array.isArray(timetable)) {
        console.error('❌ 高鐵時刻表資料格式錯誤', timetable);
        return;
      }

      setHsrStations(stations);
      setThsrTimetable(timetable);

      console.log('✅ 高鐵站:', stations);
      console.log('✅ GeneralTimetable 條目數:', timetable.length);
    } catch (error) {
      console.error('載入高鐵資料失敗:', error);
    }
  })();
}, []);


  const findAllTrainsAfter = (arriveTrainTime, dest) => {
    const trains = traData[dest] || [];
    return trains.filter(train => train.DepartureTime >= arriveTrainTime);
  };

  const extractDepartureTimeFromTimetable = (stopTimes, stationName) => {
    const stop = stopTimes.find(s => s.StationName.Zh_tw === stationName);
    return stop?.DepartureTime || stop?.ArrivalTime || null;
  };

const onSearch = async () => {
  if (!time) {
    alert('請確定時間');
    return;
  }

  const filtered101 = filterSchedules(time, busScheduleBack101);
  const filtered201 = filterSchedules(time, busScheduleBack201);
  const formattedResults = [];

  // 🔹 公車 ➜ 火車邏輯
  if (transportRoute === 'bus-to-train') {
    filtered101.forEach(depTime => {
      const { arriveYunKe, arriveTrain } = calcStopTimes(depTime, '101');
      const trains = findAllTrainsAfter(arriveTrain, destination);
      if (trains.length > 0) {
        const train = trains[0];
        const color = getColorBasedOnTimeDifference(time, depTime);
        const travelTime = formatTravelTime(depTime, train.ArrivalTime);
        formattedResults.push(
          <li key={'101-' + depTime} style={{ color }}>
            101號公車 - 雲科大發車: {depTime}，抵達斗六火車站: {arriveTrain}<br />
            搭乘火車 {train.TrainNo}，發車: {train.DepartureTime}，抵達 {destination}: {train.ArrivalTime}，票價: {train.Price + 20} 元，車程: {travelTime}
          </li>
        );
      }
    });

    filtered201.forEach(depTime => {
      const { arriveTrain } = calcStopTimes(depTime, '201');
      const trains = findAllTrainsAfter(arriveTrain, destination);
      if (trains.length > 0) {
        const train = trains[0];
        const color = getColorBasedOnTimeDifference(time, depTime);
        const travelTime = formatTravelTime(depTime, train.ArrivalTime);
        formattedResults.push(
          <li key={'201-' + depTime} style={{ color }}>
            201號公車 - 雲科大發車: {depTime}，抵達斗六火車站: {arriveTrain}<br />
            搭乘火車 {train.TrainNo}，發車: {train.DepartureTime}，抵達 {destination}: {train.ArrivalTime}，票價: {train.Price + 20} 元，車程: {travelTime}
          </li>
        );
      }
    });

  // 🔹 公車 ➜ 高鐵邏輯
  } else if (transportRoute === 'bus-to-hsr') {
  filtered201.forEach(depTime => {
    const { arriveHSR } = calcStopTimes(depTime, '201');
    const arriveHSRMinutes = timeToMinutes(arriveHSR);

    const availableTrains = thsrTimetable.filter(train => {
      const stops = Array.isArray(train.GeneralTimetable?.StopTimes) ? train.GeneralTimetable.StopTimes : [];
      const yunlinIndex = stops.findIndex(s => s.StationName?.Zh_tw === '雲林');
      const destIndex = stops.findIndex(s => s.StationName?.Zh_tw === destination);

      if (yunlinIndex === -1 || destIndex === -1 || yunlinIndex >= destIndex) return false;

      const depFromYunlin = stops[yunlinIndex]?.DepartureTime;
      return depFromYunlin && timeToMinutes(depFromYunlin) >= arriveHSRMinutes;
    });

    if (availableTrains.length > 0) {
      const train = availableTrains[0]; // 最近可搭乘高鐵
      const stops = Array.isArray(train.GeneralTimetable?.StopTimes) ? train.GeneralTimetable.StopTimes : [];
      const yunlinStop = stops.find(s => s.StationName?.Zh_tw === '雲林');
      const destStop = stops.find(s => s.StationName?.Zh_tw === destination);

      const travelTime = formatTravelTime(depTime, destStop?.ArrivalTime ?? '-');
      const color = getColorBasedOnTimeDifference(time, depTime);
      const trainNo = train.GeneralTimetable?.GeneralTrainInfo?.TrainNo ?? '無資料';

      formattedResults.push(
        <li key={`hsr-${trainNo}-${depTime}`} style={{ color }}>
          201號公車 - 雲科大發車: {depTime}，抵達高鐵雲林站: {arriveHSR}<br />
          搭乘高鐵 {trainNo}，雲林出發: {yunlinStop?.DepartureTime ?? '無資料'}，抵達 {destination}: {destStop?.ArrivalTime ?? '無資料'}，車程: {travelTime}
        </li>
      );
    }
  });
}


  setResults(formattedResults.length > 0 ? formattedResults : [<li key="no-data">當日無後續車次</li>]);
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
          <label>日期：</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />

          <label>時間：</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />

          <label>路線：</label>
          <select value={transportRoute} onChange={e => setTransportRoute(e.target.value)}>
            <option value="bus-to-train">公車 → 火車</option>
            <option value="bus-to-hsr">公車 → 高鐵</option>
          </select>

          <label>車站：</label>
          <select value={destination} onChange={e => setDestination(e.target.value)}>
            {(transportRoute === 'bus-to-train' ? TRA_DESTINATIONS : hsrStations.map(s => s.StationName.Zh_tw)).map((item, i) => (
              <option key={i} value={item}>{item}</option>
            ))}
          </select>

          <button onClick={onSearch}>查詢</button>
        </div>
      </ModernCard>

      {results.length > 0 && (
        <ModernCard title="查詢結果" footer={'第 ' + currentPage + ' 頁，共 ' + totalPages + ' 頁'}>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {currentResults}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              上一頁
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              下一頁
            </button>
          </div>
        </ModernCard>
      )}
    </main>
  );
}


