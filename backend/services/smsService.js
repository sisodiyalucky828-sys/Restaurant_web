/**
 * SMS Notification Service for Velvet Brew Cafe
 *
 * Sends SMS notifications to the cafe owner when new orders are placed.
 * Uses Twilio as the SMS provider. Designed to be provider-agnostic so
 * another SMS provider can be swapped in later.
 *
 * Environment Variables Required:
 *   SMS_ENABLED        - 'true' to send real SMS, 'false' to skip (log only)
 *   SMS_PROVIDER       - Currently supports 'twilio'
 *   TWILIO_ACCOUNT_SID - Twilio Account SID
 *   TWILIO_AUTH_TOKEN   - Twilio Auth Token
 *   TWILIO_PHONE_NUMBER - Twilio SMS-capable phone number (sender)
 *   OWNER_PHONE_NUMBER  - Cafe owner's phone number (recipient)
 */

/**
 * Validate that a phone number looks like an E.164 format
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // E.164: starts with +, followed by 7-15 digits
  return /^\+[1-9]\d{6,14}$/.test(phone.trim());
};

/**
 * Sanitize a string for safe inclusion in an SMS body.
 * Removes any control characters and trims to a max length.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
const sanitize = (str, maxLen = 100) => {
  if (!str || typeof str !== 'string') return '';
  // Remove control characters, trim whitespace
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, maxLen);
};

/**
 * Build a concise SMS body from an order document.
 * Kept under 160 characters when possible, but can extend for multi-part SMS.
 * @param {Object} order - Mongoose order document
 * @returns {string}
 */
const buildOrderSmsBody = (order) => {
  const orderId = order._id.toString().slice(-6).toUpperCase();
  const customerName = sanitize(order.customerDetails?.name, 30);
  const customerPhone = sanitize(order.customerDetails?.phone, 20);

  // Build items summary: "2x Cappuccino, 1x Burger"
  const itemsSummary = (order.items || [])
    .map((item) => `${item.quantity}x ${sanitize(item.name, 25)}`)
    .join(', ')
    .substring(0, 120);

  const total = order.total?.toFixed(2) || '0.00';

  // Map payment method to display label
  const paymentLabels = {
    cash_at_counter: 'Cash at Counter',
    cod: 'Cash on Delivery',
    card: 'Card Payment',
    upi: 'UPI Payment',
  };
  const payment = paymentLabels[order.paymentMethod] || order.paymentMethod || 'N/A';

  const orderType = (order.customerDetails?.orderType || 'dine-in').replace('-', ' ');

  const body = [
    `☕ New Cafe Order!`,
    ``,
    `Order: #${orderId}`,
    `Customer: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Type: ${orderType}`,
    `Items: ${itemsSummary}`,
    `Total: ₹${total}`,
    `Payment: ${payment}`,
    ``,
    `Check admin dashboard for details.`,
  ].join('\n');

  return body;
};

/**
 * Send an SMS using the Twilio provider.
 * @param {string} to - Recipient phone number
 * @param {string} body - SMS body text
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendViaTwilio = async (to, body) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      success: false,
      error: 'Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env',
    };
  }

  if (!isValidPhoneNumber(fromNumber)) {
    return {
      success: false,
      error: 'TWILIO_PHONE_NUMBER is not a valid E.164 phone number',
    };
  }

  try {
    // Lazy-load twilio to avoid import errors if not installed
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });

    console.log(`[SMS] Message sent successfully. SID: ${message.sid}, Status: ${message.status}`);

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    };
  } catch (error) {
    // Log error details without exposing credentials
    console.error(`[SMS] Failed to send via Twilio:`, {
      message: error.message,
      code: error.code,
      status: error.status,
      // Do NOT log accountSid or authToken
    });

    return {
      success: false,
      error: error.message || 'Unknown Twilio error',
    };
  }
};

/**
 * Main entry point: Send an order notification SMS to the cafe owner.
 *
 * @param {Object} order - The saved Mongoose order document
 * @returns {Promise<{success: boolean, status: string, messageId?: string, error?: string}>}
 *
 * Return status values:
 *   'sent'     - SMS was delivered to the provider successfully
 *   'failed'   - SMS delivery attempt failed
 *   'disabled' - SMS_ENABLED is false, message was logged only
 */
const sendOrderNotification = async (order) => {
  const smsEnabled = process.env.SMS_ENABLED === 'true';
  const ownerPhone = process.env.OWNER_PHONE_NUMBER;
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();

  // 1. Build the SMS body
  const smsBody = buildOrderSmsBody(order);

  // 2. If SMS is disabled, log and return
  if (!smsEnabled) {
    console.log(`[SMS] SMS_ENABLED=false. Skipping real SMS delivery.`);
    console.log(`[SMS] Would have sent to: ${ownerPhone || '(not configured)'}`);
    console.log(`[SMS] Message body:\n${smsBody}`);
    return {
      success: true,
      status: 'disabled',
    };
  }

  // 3. Validate owner phone number
  if (!isValidPhoneNumber(ownerPhone)) {
    console.error(`[SMS] Invalid or missing OWNER_PHONE_NUMBER: "${ownerPhone || ''}". SMS not sent.`);
    return {
      success: false,
      status: 'failed',
      error: 'OWNER_PHONE_NUMBER is not configured or is not a valid E.164 phone number',
    };
  }

  // 4. Send via the configured provider
  let result;

  switch (provider) {
    case 'twilio':
      result = await sendViaTwilio(ownerPhone, smsBody);
      break;
    default:
      console.error(`[SMS] Unknown SMS_PROVIDER: "${provider}". Supported: twilio`);
      return {
        success: false,
        status: 'failed',
        error: `Unsupported SMS provider: ${provider}`,
      };
  }

  // 5. Return normalized result
  if (result.success) {
    return {
      success: true,
      status: 'sent',
      messageId: result.messageId,
    };
  } else {
    return {
      success: false,
      status: 'failed',
      error: result.error,
    };
  }
};

module.exports = {
  sendOrderNotification,
  buildOrderSmsBody,
  isValidPhoneNumber,
  sanitize,
};
