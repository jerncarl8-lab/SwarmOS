import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Example: Fetch data from Supabase
    // const { data, error } = await supabase.from('your_table').select('*');
    
    return NextResponse.json({ 
      message: 'SwarmOS API is running!',
      integrations: {
        supabase: 'Ready',
        openai: 'Ready',
        stripe: 'Ready',
        resend: 'Ready',
        twilio: 'Ready',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Example: Use OpenAI
    // const response = await getChatCompletion([{
    //   role: 'user',
    //   content: body.message
    // }]);
    
    return NextResponse.json({ 
      success: true,
      data: body 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
