import { NextRequest, NextResponse } from 'next/server';
import { testWhatsAppConfiguration, sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET() {
  try {
    const testResult = await testWhatsAppConfiguration();
    
    return NextResponse.json({
      success: testResult.success,
      configured: testResult.configured,
      message: testResult.success 
        ? 'WhatsApp integration is working correctly!' 
        : 'WhatsApp integration test failed',
      error: testResult.error || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error testing WhatsApp configuration:', error);
    return NextResponse.json({
      success: false,
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    if (!to || !message) {
      return NextResponse.json({
        success: false,
        error: 'Both "to" and "message" parameters are required',
      }, { status: 400 });
    }

    const result = await sendWhatsAppMessage({ to, message });
    
    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? 'Test message sent successfully!' 
        : 'Failed to send test message',
      error: result.error || null,
      messageSid: result.success ? result.messageSid : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending test WhatsApp message:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 