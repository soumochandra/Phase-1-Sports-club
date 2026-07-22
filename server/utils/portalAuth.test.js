const test = require("node:test");
const assert = require("node:assert/strict");

const { generatePortalCredentials, verifyPassword } = require("./portalAuth");

test("generatePortalCredentials creates role-specific IDs and a five-digit password", () => {
  const credentials = generatePortalCredentials("athlete", "Asha");

  assert.match(credentials.userId, /^ATH-/);
  assert.match(credentials.password, /^\d{5}$/);
});

test("verifyPassword validates the generated password", () => {
  const credentials = generatePortalCredentials("coach", "Ravi");
  assert.equal(verifyPassword(credentials.password, credentials.passwordHash), true);
});
