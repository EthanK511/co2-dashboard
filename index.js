/**
 * Cloud Function: CO₂ Alert System
 * Sends SMS alerts when high CO₂ is detected
 * or when a device stops sending data.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

// ----- Twilio credentials (set via firebase functions:config:set) -----
const { sid, token, to, from } = functions.config().twilio;
const client = twilio(sid, token);

// ----- Configuration thresholds -----
const MAX_CO2 = 2000; // ppm
const OFFLINE_MS = 10 * 60 * 1000; // 10 minutes

// ----- Helper: send an SMS -----
async function sendAlert(message) {
  try {
    await client.messages.create({
      body: message,
      from,
      to,
    });
    console.log("✅ SMS sent:", message);
  } catch (err) {
    console.error("❌ SMS send failed:", err.message);
  }
}

// ----- Trigger: on new CO₂ reading -----
exports.alertOnHighCO2 = functions.database
  .ref("/readings/{deviceId}/{pushId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();
    const ppm = data.co2 || 0;
    const deviceId = context.params.deviceId;

    if (ppm > MAX_CO2) {
      await sendAlert(`🚨 High CO₂ (${ppm} PPM) from ${deviceId}`);
    }

    // update device last-seen timestamp
    await admin.database()
      .ref(`/devices/${deviceId}/lastSeen`)
      .set(Date.now());
  });

// ----- Scheduled check: offline devices -----
exports.checkOfflineDevices = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = Date.now();
    const snap = await admin.database().ref("/devices").once("value");

    snap.forEach((child) => {
      const id = child.key;
      const lastSeen = child.val().lastSeen || 0;
      if (now - lastSeen > OFFLINE_MS) {
        sendAlert(`⚠️ Device ${id} offline > 10 min`);
      }
    });

    return null;
  });