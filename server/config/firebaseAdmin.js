const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
const dotenvPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(dotenvPath)) {
  dotenv.config({ path: dotenvPath });
} else {
  dotenv.config();
}

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");
let serviceAccount = null;

if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
} else {
  const requiredEnv = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });

  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

/**
 * Initialize Firebase Admin
 */
const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

/**
 * Firestore Database
 */
const db = getFirestore(firebaseApp);

db.settings({
  ignoreUndefinedProperties: true,
});

/**
 * Firebase Authentication
 */
const adminAuth = getAuth(firebaseApp);

module.exports = {
  admin,
  firebaseApp,
  db,
  adminAuth,
};