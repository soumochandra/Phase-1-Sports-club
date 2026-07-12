const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const getAgeGroup = (age) => {
  if (age < 12) return "Under 12";
  if (age < 15) return "Under 15";
  if (age < 18) return "Under 18";

  return "Senior";
};

const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePinCode = (pinCode) => {
  return /^\d{6}$/.test(pinCode);
};

module.exports = {
  calculateAge,
  getAgeGroup,
  validateMobile,
  validateEmail,
  validatePinCode,
};