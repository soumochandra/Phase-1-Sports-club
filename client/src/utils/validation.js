export const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePinCode = (pinCode) => {
  return /^\d{6}$/.test(pinCode);
};

export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.dob ||
        !formData.gender
      ) {
        return "Please fill all personal details";
      }

      if (!validateMobile(formData.mobile)) {
        return "Enter a valid 10-digit mobile number";
      }

      if (!validateEmail(formData.email)) {
        return "Enter a valid email address";
      }

      return "";

    case 2:
      if (
        !formData.guardianName.trim() ||
        !formData.guardianRelation.trim()
      ) {
        return "Please fill all guardian details";
      }

      if (!validateMobile(formData.guardianMobile)) {
        return "Enter a valid guardian mobile number";
      }

      return "";

    case 3:
      if (
        !formData.addressLine.trim() ||
        !formData.city.trim() ||
        !formData.state.trim()
      ) {
        return "Please fill all address details";
      }

      if (!validatePinCode(formData.pinCode)) {
        return "Enter a valid 6-digit PIN code";
      }

      return "";

    case 4:
      return "";

    case 5:
      if (!formData.competitionApplied) {
        return "Please select a competition";
      }

      return "";

    case 6:
      if (
        !formData.profileImage ||
        !formData.birthCertificate ||
        !formData.identityDocument
      ) {
        return "Please upload all mandatory documents";
      }

      return "";

    default:
      return "";
  }
};