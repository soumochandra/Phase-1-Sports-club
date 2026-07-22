const crypto = require("crypto");

const normalizeRole = (role) =>
  (role || "athlete").toLowerCase();

const slugify = (value) => {
  return String(value || "user")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 6);
};

const generatePortalUserId = (role, name) => {
  const normalizedRole = normalizeRole(role);

  const prefix =
    normalizedRole === "coach"
      ? "COA"
      : "ATH";

  const shortName = slugify(name);

  return `${prefix}-${shortName}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
};

const hashPassword = (password) => {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
};

const verifyPassword = (password, passwordHash) => {
  return (
    hashPassword(password) === passwordHash
  );
};

module.exports = {
  generatePortalUserId,
  hashPassword,
  verifyPassword,
};