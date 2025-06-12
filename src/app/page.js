'use client';

import React, { useState, useEffect } from 'react';
import ModernCard from '../components/ModernCard';

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transportRoute, setTransportRoute] = useState('bus-to-hsr');
  const [destination, setDestination] = useState('');
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [results, setResults] = useState([]);

  const destinationsData = {
    'bus-to-hsr': [
      { label: '台北高鐵站', value: 'taipei-hsr' },
      { label: '台中高鐵站', value: 'taichung-hsr' },
      { label: '左營高鐵站', value: 'zuoying-hsr' },
    ],
    'bus-to-train': [
      { label: '台北火車站', value: 'taipei-train' },
      { label: '台中火車站', value: 'taichung-train' },
      { label: '高雄火車站', value: 'kaohsiung-train' },
    ],
  };

  useEffect(() => {
    setDestination('');
    setDestinationOptions(destinationsData[transportRoute]);
  }, [transportRoute]);

  const onSearch = () => {
    setResults([]);
    alert('這邊會呼叫API並顯示結果，請提供API與KEY');
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>雲科大交通路線規劃查詢</h1>

      <ModernCard title="查詢條件">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label htmlFor="date">選擇日期：</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          />

          <label htmlFor="time">選擇時間：</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          />

          <label htmlFor="route">交通路線：</label>
          <select
            id="route"
            value={transportRoute}
            onChange={e => setTransportRoute(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="bus-to-hsr">公車 → 高鐵站</option>
            <option value="bus-to-train">公車 → 火車站</option>
          </select>

          <label htmlFor="destination">目的地：</label>
          <select
            id="destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="">請選擇目的地</option>
            {destinationOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <button
            onClick={onSearch}
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: 8,
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            查詢
          </button>
        </div>
      </ModernCard>

      {results.length > 0 && (
        <ModernCard title="查詢結果" footer={`共 ${results.length} 筆`}>
          <ul>
            {results.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </ModernCard>
      )}
    </main>
  );
}
