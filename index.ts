import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'price_alert' | 'trade_confirmation' | 'portfolio_update' | 'news';
}

function validateNotificationRequest(data: any): { valid: boolean; error?: string; data?: NotificationRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { userId, title, message, type } = data;

  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'userId is required and must be a string' };
  }

  if (userId.length > 100) {
    return { valid: false, error: 'userId too long' };
  }

  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'title is required and must be a string' };
  }

  if (title.length > 200) {
    return { valid: false, error: 'title too long (max 200 characters)' };
  }

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'message is required and must be a string' };
  }

  if (message.length > 1000) {
    return { valid: false, error: 'message too long (max 1000 characters)' };
  }

  const validTypes = ['price_alert', 'trade_confirmation', 'portfolio_update', 'news'];
  if (!type || !validTypes.includes(type)) {
    return { valid: false, error: `type must be one of: ${validTypes.join(', ')}` };
  }

  return { valid: true, data: { userId, title, message, type } };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with anon key for auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const requestData = await req.json();
    const validation = validateNotificationRequest(requestData);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notification = validation.data!;

    // Verify user can only send notifications to themselves (unless admin)
    if (notification.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You can only send notifications to yourself' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log notification (in production, send via push notification service)
    console.log('Sending notification:', notification);

    // Here you would integrate with:
    // 1. Firebase Cloud Messaging for push notifications
    // 2. Twilio for SMS
    // 3. SendGrid/Resend for email

    // For now, we'll just log it
    // Example with Firebase: 
    // const fcmToken = await getFCMToken(notification.userId);
    // await sendPushNotification(fcmToken, notification);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while sending notification' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});