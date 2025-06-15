import { getTHSRStations, getTHSRFare } from '../tdx_api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fromName = searchParams.get('from');
  const toName = searchParams.get('to');

  if (!fromName || !toName) {
    return new Response(JSON.stringify({ error: '請提供 from 與 to 參數' }), { status: 400 });
  }

  try {
    const stations = await getTHSRStations();
    const from = stations.find(s => s.name === fromName);
    const to = stations.find(s => s.name === toName);

    if (!from || !to) {
      return new Response(JSON.stringify({ error: '找不到站點 ID' }), { status: 404 });
    }

    const fare = await getTHSRFare(from.id, to.id);
    return Response.json(fare);
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'API 發生錯誤' }), { status: 500 });
  }
}
