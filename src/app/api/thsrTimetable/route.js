import { getTHSRTimetable } from '../tdx_api';

export async function GET() {
  try {
    const timetable = await getTHSRTimetable();
    return Response.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch timetable' }), { status: 500 });
  }
}
