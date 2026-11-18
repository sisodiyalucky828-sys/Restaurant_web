# SMS Notifications Setup Guide

This guide explains how to set up SMS notifications for the Lucky Cafe Cafe. When a customer places an order, an SMS is automatically sent to the cafe owner's phone number.

## Table of Contents

1. [Create a Twilio Account](#1-create-a-twilio-account)
2. [Get API Credentials](#2-get-api-credentials)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Set the Owner Phone Number](#4-set-the-owner-phone-number)
5. [Enable SMS](#5-enable-sms)
6. [Test the Feature](#6-test-the-feature)
7. [What Happens if SMS Fails](#7-what-happens-if-sms-fails)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Create a Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Verify your email address and phone number
4. Once logged in, you'll be taken to the Twilio Console

> **Note:** Free trial accounts come with a small credit balance (usually $15) and can only send SMS to **verified phone numbers**. You'll need to verify your cafe owner's phone number (see Step 4).

---

## 2. Get API Credentials

From the [Twilio Console](https://console.twilio.com/):

1. **Account SID**: Found on the main dashboard page. It looks like: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
2. **Auth Token**: Click "Show" next to the Auth Token on the dashboard. It looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **Phone Number**: 
   - Go to **Phone Numbers** → **Manage** → **Buy a Number**
   - Choose a number with **SMS capability** enabled
   - The number will look like: `+1XXXXXXXXXX` (US) or your local country format

> **Important:** Never share your Auth Token publicly. Keep it in your `.env` file only.

---

## 3. Configure Environment Variables

Open the file `backend/.env` and add or update these variables:

```env
# SMS Notification Configuration
SMS_ENABLED=false
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
OWNER_PHONE_NUMBER=+918839715938
```

### Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SMS_ENABLED` | `true` to send real SMS, `false` to skip (safe testing) | `false` |
| `SMS_PROVIDER` | SMS provider to use (currently only `twilio`) | `twilio` |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | `ACxxxx...` |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | `xxxxx...` |
| `TWILIO_PHONE_NUMBER` | Your Twilio SMS-capable phone number (sender) | `+14155551234` |
| `OWNER_PHONE_NUMBER` | Cafe owner's phone number (receiver) | `+918839715938` |

---

## 4. Set the Owner Phone Number

The `OWNER_PHONE_NUMBER` must be in **E.164 format**: `+[country code][number]`

Examples:
- India: `+918839715938`
- US: `+14155551234`
- UK: `+447911123456`

### For Twilio Trial Accounts

If you're on a free trial, you must **verify** the owner's phone number:

1. Go to [Twilio Console](https://console.twilio.com/) → **Phone Numbers** → **Verified Caller IDs**
2. Click **Add a new Caller ID**
3. Enter the owner's phone number (`+918839715938`)
4. Twilio will send a verification code via SMS or call
5. Enter the code to verify

> Once you upgrade to a paid Twilio account, you can send SMS to any phone number without verification.

---

## 5. Enable SMS

Once you have valid Twilio credentials and the owner phone is verified:

1. Open `backend/.env`
2. Change `SMS_ENABLED=false` to `SMS_ENABLED=true`
3. Restart the backend server

```bash
# Stop the current server, then:
cd backend
node server.js
```

---

## 6. Test the Feature

### Test Mode (SMS_ENABLED=false)

With `SMS_ENABLED=false`, placing an order will:
- ✅ Save the order to the database normally
- ✅ Log the SMS message body to the server console (so you can see what would be sent)
- ✅ Set the order's `notificationStatus` to `disabled`
- ❌ NOT send a real SMS

This is perfect for development and testing.

### Live Mode (SMS_ENABLED=true)

With `SMS_ENABLED=true` and valid credentials:
1. Go to the cafe website frontend
2. Browse the menu and add items to cart
3. Go to checkout, fill in customer details
4. Place the order
5. The backend will:
   - Save the order to MongoDB
   - Send an SMS to the owner's phone
   - Update the order with notification status
6. Check the **Admin Dashboard** → **SMS Notifications** section to see the status

### Sample SMS Message

```
☕ New Cafe Order!

Order: #A1B2C3
Customer: Rahul
Phone: +919876543210
Type: dine in
Items: 2x Cappuccino, 1x Classic Burger
Total: ₹450.00
Payment: Cash at Counter

Check admin dashboard for details.
```

---

## 7. What Happens if SMS Fails

The system is designed to **never break order placement** due to SMS issues:

| Scenario | Order Status | SMS Status | Customer Experience |
|----------|-------------|------------|-------------------|
| SMS sent successfully | ✅ Saved | `sent` | "Order placed successfully!" |
| SMS delivery fails | ✅ Saved | `failed` | "Order placed successfully!" |
| SMS disabled | ✅ Saved | `disabled` | "Order placed successfully!" |
| Twilio credentials invalid | ✅ Saved | `failed` | "Order placed successfully!" |
| Owner phone not verified | ✅ Saved | `failed` | "Order placed successfully!" |

**Key points:**
- The order is **always saved first**, then SMS is attempted
- If SMS fails, the error is logged on the server — the customer never sees it
- The customer always gets a success response
- You can check failed notifications in the Admin Dashboard

---

## 8. Troubleshooting

### "SMS not being sent"
- Check `SMS_ENABLED=true` in `.env`
- Verify Twilio credentials are correct
- Check the server console for `[SMS]` log messages

### "Twilio error: unverified number"
- If on a trial account, verify the owner's phone number in Twilio Console
- See [Step 4](#4-set-the-owner-phone-number)

### "Invalid phone number format"
- Ensure `OWNER_PHONE_NUMBER` starts with `+` followed by country code and number
- Example: `+918839715938` (not `8839715938` or `08839715938`)

### "SMS sent but not received"
- Check Twilio's [Message Logs](https://console.twilio.com/us1/monitor/logs/sms) for delivery status
- Some carriers may delay or filter messages
- Ensure the phone number can receive SMS (not a landline)

### "Admin dashboard doesn't show notification card"
- Make sure you're logged in as an admin
- Check the browser console for API errors
- The `/api/admin/notifications` endpoint requires admin authentication
