# Email Configuration Guide for TradeShift

## Problem: Emails Not Being Sent

If you're not receiving emails (password reset, verification, etc.), this is likely due to Supabase email configuration.

## Quick Fixes

### 1. Check Supabase Dashboard Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `vbdjyhinenyfiorohxle`
3. Navigate to **Authentication** → **Email Templates**
4. Make sure email sending is enabled

### 2. Enable Email Confirmation (if needed)

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, check:
   - ✅ "Enable email confirmations" (if you want email verification)
   - ✅ "Enable email change confirmations"

### 3. Configure Custom SMTP (Recommended for Production)

For production use, configure a custom SMTP provider:

#### Option A: Using Resend (Recommended)
1. Sign up at https://resend.com
2. Get your API key
3. In Supabase Dashboard → **Project Settings** → **Auth** → **SMTP Settings**
4. Configure:
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: `resend`
   - **Password**: Your Resend API key
   - **Sender email**: Your verified domain email

#### Option B: Using SendGrid
1. Sign up at https://sendgrid.com
2. Create an API key
3. In Supabase Dashboard → **Project Settings** → **Auth** → **SMTP Settings**
4. Configure:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key
   - **Sender email**: Your verified sender email

#### Option C: Using Gmail (Development Only)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. In Supabase Dashboard → **Project Settings** → **Auth** → **SMTP Settings**
4. Configure:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: Your Gmail address
   - **Password**: Your App Password (not your regular password)
   - **Sender email**: Your Gmail address

### 4. Check Email Templates

1. Go to **Authentication** → **Email Templates**
2. Verify templates are configured:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**
3. Customize templates if needed

### 5. Test Email Sending

1. Go to **Authentication** → **Users**
2. Try sending a test email or use the password reset function
3. Check the **Logs** section for any errors

## Development Mode

In development, Supabase's default email service has limitations:
- May have rate limits
- Emails might go to spam
- May not work reliably

**For development/testing:**
1. Use a test email service like Mailtrap
2. Or configure Gmail SMTP (see above)
3. Check spam/junk folders
4. Monitor Supabase logs for email sending status

## Troubleshooting

### Emails going to spam?
- Configure SPF/DKIM records for your domain
- Use a reputable email service (Resend, SendGrid)
- Avoid spam trigger words in email content

### Rate limit errors?
- The app now has client-side rate limiting (60 seconds)
- Check Supabase dashboard for server-side rate limits
- Consider upgrading your Supabase plan if needed

### Still not working?
1. Check Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for email sending errors
3. Verify SMTP credentials are correct
4. Test SMTP connection in Supabase settings

## Current Configuration

- **Supabase URL**: `https://gjbatphjnptkvnaidkge.supabase.co`
- **Email redirect URL**: `${window.location.origin}/dashboard` (for signup)
- **Password reset URL**: `${window.location.origin}/reset-password`

## Next Steps

1. ✅ Configure SMTP in Supabase Dashboard
2. ✅ Test email sending
3. ✅ Verify email templates
4. ✅ Check spam folders
5. ✅ Monitor logs for errors

For more help, visit: https://supabase.com/docs/guides/auth/auth-smtp

