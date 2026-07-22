import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Send,
  AlertCircle,
} from "lucide-react";

import StepIndicator from "../components/registration/StepIndicator";
import PersonalDetails from "../components/registration/PersonalDetails";
import GuardianDetails from "../components/registration/GuardianDetails";
import AddressDetails from "../components/registration/AddressDetails";
import ClubStateDetails from "../components/registration/ClubStateDetails";
import CompetitionDetails from "../components/registration/CompetitionDetails";
import DocumentUpload from "../components/registration/DocumentUpload";
import DeclarationDetails from "../components/registration/DeclarationDetails";
import PaymentDetails from "../components/registration/PaymentDetails";

import api from "../services/api";
import { validateStep } from "../utils/validation";



import "../styles/registration.css";

function AthleteRegistration() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    ageGroup: "",
    gender: "",
    bloodGroup: "",
    mobile: "",
    email: "",

    guardianName: "",
    guardianMobile: "",
    guardianRelation: "",
    guardianEmail: "",

    addressLine: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",

    clubName: "",
    district: "",
    representingState: "",

    competitionApplied: "",
    category: "",
    eventLevel: "",

    profileImage: null,
    birthCertificate: null,
    identityDocument: null,
    schoolBonafideCertificate: null,
    insuranceDocument: null,

    declarationConfirmed: false,
    termsAccepted: false,
    parentConsent: false,

    paymentMethod: "",
    paymentStatus: "pending",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceValidTill: "",

    portalPassword: "",
    confirmPassword: "",
  });

  const nextStep = () => {
    const validationError = validateStep(
      currentStep,
      formData
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (currentStep < 8) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const previousStep = () => {
    setError("");

    if (currentStep > 1) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  const handleSubmit = async () => {
    const validationError = validateStep(8, formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const registrationData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
  if (
    key !== "age" &&
    key !== "ageGroup" &&
    key !== "confirmPassword" &&
    value !== null
  ) {
    registrationData.append(key, value);
  }
});

const response = await api.post(
  "/athletes/register",
  registrationData
);

alert(JSON.stringify(response.data, null, 2));

      const registration = response.data?.data ?? response.data;

      if (!registration?.portalUserId || !registration?.portalPassword) {
        throw new Error(
          "Registration succeeded, but portal credentials were not returned. Please contact the administrator."
        );
      }

      navigate("/registration-success", {
        state: {
          athleteId: registration.athleteId,
          portalUserId: registration.portalUserId,
          portalPassword: registration.portalPassword,
        },
      });
    } catch (submitError) {
      console.error(submitError);

      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 2:
        return (
          <GuardianDetails
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 3:
        return (
          <AddressDetails
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 4:
        return (
          <ClubStateDetails
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 5:
        return (
          <CompetitionDetails
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 6:
        return (
          <DocumentUpload
            formData={formData}
            setFormData={setFormData}
            setError={setError}
          />
        );

      case 7:
        return <DeclarationDetails formData={formData} setFormData={setFormData} />;

      case 8:
        return <PaymentDetails formData={formData} setFormData={setFormData} />;

      default:
        return null;
    }
  };

  return (
    <main className="registration-page">
      <div className="registration-container">
        <header className="registration-header animate-fade-up">
          <span className="registration-label">
            ATHLETE ONBOARDING
          </span>

          <h1>Register as an Athlete</h1>

          <p>
            Complete your athlete profile and competition
            registration.
          </p>
        </header>

        <div className="registration-card glass-card animate-fade-up">
          <StepIndicator currentStep={currentStep} />

          {error && (
            <div className="form-error">
              <AlertCircle size={19} />

              <span>{error}</span>
            </div>
          )}

          <div className="form-content" key={currentStep}>
            {renderStep()}
          </div>

          <div className="form-navigation">
            <button
              type="button"
              className="secondary-button"
              onClick={previousStep}
              disabled={
                currentStep === 1 || isSubmitting
              }
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <span className="step-counter">
              Step {currentStep} of 8
            </span>

            {currentStep < 8 ? (
              <button
                type="button"
                className="primary-button next-button"
                onClick={nextStep}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="primary-button submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="loading-icon"
                    />

                    Registering...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <Send size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AthleteRegistration;
