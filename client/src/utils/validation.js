export const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePinCode = (pinCode) => {
  return /^\d{6}$/.test(pinCode);
};

export const validateStep = (step, formData = {}) => {
  switch (step) {
    case 1:
      if (
        !String(formData.firstName || "").trim() ||
        !String(formData.lastName || "").trim() ||
        !formData.dob ||
        !formData.gender
      ) {
        return "Please fill all personal details";
      }

      if (!validateMobile(String(formData.mobile || ""))) {
        return "Enter a valid 10-digit mobile number";
      }

      if (!validateEmail(String(formData.email || ""))) {
        return "Enter a valid email address";
      }

      return "";

    case 2:
      if (
        !String(formData.guardianName || "").trim() ||
        !String(formData.guardianRelation || "").trim()
      ) {
        return "Please fill all guardian details";
      }

      if (!validateMobile(String(formData.guardianMobile || ""))) {
        return "Enter a valid guardian mobile number";
      }

      if (
        formData.guardianEmail &&
        !validateEmail(String(formData.guardianEmail))
      ) {
        return "Enter a valid guardian email address";
      }

      return "";

    case 3:
      if (
        !String(formData.addressLine || "").trim() ||
        !String(formData.city || "").trim() ||
        !String(formData.state || "").trim()
      ) {
        return "Please fill all address details";
      }

      if (!validatePinCode(String(formData.pinCode || ""))) {
        return "Enter a valid 6-digit PIN code";
      }

      return "";

    case 4:
      if (!String(formData.clubName || "").trim()) {
        return "Please provide your club name";
      }

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

    case 7:
      if (!formData.declarationConfirmed || !formData.termsAccepted) {
        return "Please confirm the declaration and consent terms";
      }

      if (Number(formData.age || 0) < 18 && !formData.parentConsent) {
        return "Parent/guardian consent is required for minors";
      }

      return "";

   case 8:
  if (!formData.paymentMethod) {
    return "Please complete the payment step";
  }

  if (!["paid", "pending"].includes(formData.paymentStatus)) {
    return "Please complete the payment step";
  }

  if (!/^\d{6}$/.test(formData.portalPassword || "")) {
    return "Portal password must be exactly 6 digits.";
  }

  if (formData.portalPassword !== formData.confirmPassword) {
    return "Password and Confirm Password do not match.";
  }

  return "";

    default:
      return "";
  }
};