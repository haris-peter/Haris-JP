# Environment Variables Setup

Add these environment variables to your `.env.local` file:

```env
# Resend API Key (for contact form emails)
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Contact Email (where form submissions are sent)
CONTACT_EMAIL=harisjosinpeter@gmail.com
```

## Getting Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to `.env.local`

**Note:** The free tier allows 100 emails per day, which should be sufficient for a portfolio contact form.
