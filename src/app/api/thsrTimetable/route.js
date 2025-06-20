import { getTHSRGeneralTimetable } from '../tdx_api';  
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const timetable = await getTHSRGeneralTimetable(); // ✅ 正確的函式名稱
    return NextResponse.json(timetable); 
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  }
}
