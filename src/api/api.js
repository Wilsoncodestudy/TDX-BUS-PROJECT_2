import axios from 'axios';

// 獲取訪問令牌
const getAccessToken = async () => {
  const url = 'https://tdx.transportdata.tw/auth/realms/TDX/protocol/openid-connect/token';
  const params = new URLSearchParams();
  params.append('client_id', process.env.TDX_CLIENT_ID);
  params.append('client_secret', process.env.TDX_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(url, params);
    return response.data.access_token; // 返回訪問令牌
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

// 獲取車站資料
export const fetchStationData = async () => {
  const token = await getAccessToken();
  if (!token) return [];

  const url = 'https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station';

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // 返回車站資料
  } catch (error) {
    console.error('Error fetching station data:', error);
    return [];
  }
};

// 獲取票價資料
export const fetchFareData = async (fromStationID, toStationID) => {
  const token = await getAccessToken();
  if (!token) return null;

  const url = `https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/ODFare/${fromStationID}/to/${toStationID}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // 返回票價資料
  } catch (error) {
    console.error('Error fetching fare data:', error);
    return null;
  }
};

// 獲取時刻表資料
export const fetchTrainSchedule = async (date, fromStationID, toStationID) => {
  const token = await getAccessToken();
  if (!token) return [];

  const url = `https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/OD/${fromStationID}/to/${toStationID}/${date}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // 返回時刻表資料
  } catch (error) {
    console.error('Error fetching train schedule:', error);
    return [];
  }
};
