export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "";

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export function getAgeGroup(age) {
  const numericAge = Number(age);

  if (!Number.isFinite(numericAge)) {
    return "";
  }

  if (numericAge < 8) return "Under 8";
  if (numericAge < 10) return "8-9";
  if (numericAge < 12) return "10-11";
  if (numericAge < 14) return "12-13";
  if (numericAge < 16) return "14-15";
  if (numericAge < 18) return "16-17";

  return "18+";
}
