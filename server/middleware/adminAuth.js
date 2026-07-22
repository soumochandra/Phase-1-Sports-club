const { adminAuth, db } = require("../config/firebaseAdmin");

const verifyAdmin = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authorization.split(" ")[1];

   const decodedToken = await adminAuth.verifyIdToken(token);

    console.log("Logged in UID:", decodedToken.uid);
    console.log("Logged in email:", decodedToken.email);

    const adminDocument = await db
      .collection("admins")
      .doc(decodedToken.uid)
      .get();

    if (!adminDocument.exists) {
      console.log("Admin document not found");

      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    const adminData = adminDocument.data();

    if (adminData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    req.admin = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...adminData,
    };

    next();
  } catch (error) {
    console.error("Admin auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyAdmin;