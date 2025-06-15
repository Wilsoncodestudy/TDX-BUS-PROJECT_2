import { getTHSRStations } from '../tdx_api'; 

export async function GET() {
  try {
    const stations = await getTHSRStations();
    console.log('🚆 車站資料：', stations);
    return Response.json(stations);
  } catch (error) {
    console.error('❌ API 錯誤：', error);
    return new Response(JSON.stringify({ error: "Failed to fetch stations data", detail: error.message }), { status: 500 });
  }
}
