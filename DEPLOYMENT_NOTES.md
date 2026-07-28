# Supraja Hotels deployment notes

## Vercel environment variable

Set `NEXT_PUBLIC_SITE_URL` separately for each Vercel environment:

- Production: `https://suprajahotels.com`
- Preview: use the current Vercel preview URL only when testing social previews

After changing the variable, redeploy the website.

## Social preview refresh

After production deployment:

1. Open the Facebook Sharing Debugger.
2. Enter `https://suprajahotels.com`.
3. Select **Scrape Again**.
4. Share the production URL in a new WhatsApp message.

WhatsApp may continue showing an older preview for a previously shared URL until
its cache refreshes.

## Validation completed

- ESLint passed
- TypeScript passed
- Next.js production build passed
- All 15 routes generated successfully
