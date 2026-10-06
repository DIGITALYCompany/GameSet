# GameSet authentication setup

The login dialog and /auth share the same form. Google and Discord use Supabase OAuth. DIGITALY ID is a noninteractive placeholder for a future integration.

## Supabase URLs

Authentication > URL Configuration:
- Site URL: https://gameset.tech (use your actual production origin).
- Redirect URLs: https://gameset.tech/auth/callback
- Redirect URLs: https://gameset.tech/auth/reset-password
- For local development, add the same two paths under your actual local Vite origin.

Ensure the hosting server serves the SPA for /auth/callback and /auth/reset-password. Never cache private responses or log URL fragments containing auth tokens.

## Google

Create a Web application OAuth client in Google Cloud. Configure the consent screen and, in testing mode, permitted test users. Add the callback URL shown by Supabase's Google provider to Google's authorized redirect URIs (https://YOUR_PROJECT.supabase.co/auth/v1/callback). Enable Google in Supabase Authentication > Sign In / Providers, and enter the client ID and client secret there.

Official guide: https://supabase.com/docs/guides/auth/social-login/auth-google

## Discord

Create an application in the Discord Developer Portal. In OAuth2, add the callback URL shown by Supabase's Discord provider (https://YOUR_PROJECT.supabase.co/auth/v1/callback). Enable Discord in Supabase and enter the client ID and client secret there. No bot token is needed.

Official guide: https://supabase.com/docs/guides/auth/social-login/auth-discord

Do not put provider secrets in VITE_* variables. No additional frontend credentials are needed beyond the existing public Supabase configuration.

## Password recovery

Configure a working custom SMTP sender in Supabase Authentication > Emails. Disabling Confirm email does not remove the need to send recovery emails. Keep the default recovery template's confirmation link. The app requests a link redirecting to /auth/reset-password and uses Supabase updateUser to save the new password after authentication.

Official guides:
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/auth-smtp

## Manual validation after deployment

- Email signup with Confirm email disabled: authenticated session, profile exists.
- Email signup with confirmation enabled: confirmation message remains visible.
- Invalid password: error visible and form can be retried.
- Forgot password: generic confirmation, receive email, open link, matching new passwords save successfully, new password signs in.
- Expired reset link: error and route back to login.
- Google and Discord: authorize, return to /auth/callback, then /account; profile exists.
- Provider rejection/disabled provider: callback or Supabase error, no false success.
- Dialog: Escape closes, keyboard focus stays inside and returns to the opener.

Remote SMTP and OAuth flows require configured providers and cannot be validated solely by a local build.
