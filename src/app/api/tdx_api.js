/*import axios from 'axios';

const TDX_CLIENT_ID = process.env.TDX_CLIENT_ID;
const TDX_CLIENT_SECRET = process.env.TDX_CLIENT_SECRET;

// ✅ 獲取訪問令牌（注意這裡的 URL 改為 TDXConnect）
const getAccessToken = async () => {
  const response = await axios.post(
    'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: TDX_CLIENT_ID,
      client_secret: TDX_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

// 🔹 取得高鐵車站資訊
export const getTHSRStations = async () => {
  const token = await getAccessToken();
  const response = await axios.get('https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.map(station => ({
    id: station.StationID,
    name: station.StationName.Zh_tw,
  }));
};

// 🔹 取得高鐵時刻表
export const getTHSRTimetable = async () => {
  const token = await getAccessToken();
  const response = await axios.get('https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/GeneralTimetable', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 查詢高鐵票價
export const getTHSRFare = async (originStationID, destinationStationID) => {
  const token = await getAccessToken();
  const response = await axios.get(
    `https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/ODFare/${originStationID}/to/${destinationStationID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// 🔹 測試用：查票價
export const testGetFare = async () => {
  try {
    const stations = await getTHSRStations();
    console.log('高鐵車站資料:', stations);

    if (stations.length >= 2) {
      const originStationID = stations[0].id;
      const destinationStationID = stations[1].id;

      const fare = await getTHSRFare(originStationID, destinationStationID);
      console.log(`從 ${stations[0].name} 到 ${stations[1].name} 的票價:`, fare);
    } else {
      console.log('車站數量不足');
    }
  } catch (err) {
    console.error('🚫 查詢錯誤:', err?.response?.data || err.message);
  }
};*/
import axios from 'axios';

const TDX_CLIENT_ID = process.env.TDX_CLIENT_ID;
const TDX_CLIENT_SECRET = process.env.TDX_CLIENT_SECRET;

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: TDX_CLIENT_ID,
        client_secret: TDX_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('取得存取權杖失敗:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getTHSRStations = async () => {
  const token = await getAccessToken();
  const response = await axios.get('https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getTHSRGeneralTimetable = async () => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(
      'https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/GeneralTimetable?$format=JSON',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("GeneralTimetable 資料量:", response.data.length);
    return response.data;
  } catch (error) {
    console.error("❌ GeneralTimetable 請求失敗:", error.response?.data || error.message);
    throw error;
  }
};

export { getTHSRStations, getTHSRGeneralTimetable };

