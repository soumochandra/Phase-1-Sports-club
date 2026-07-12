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
    mobile: "",
    email: "",

    guardianName: "",
    guardianMobile: "",
    guardianRelation: "",

    addressLine: "",
    city: "",
    state: "",
    pinCode: "",

    clubName: "",
    representingState: "",

    competitionApplied: "",

    profileImage: null,
    birthCertificate: null,
    identityDocument: null,
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

    if (currentStep < 6) {
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
    const validationError = validateStep(6, formData);

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
          value !== null
        ) {
          registrationData.append(key, value);
        }
      });

      const response = await api.post(
        "/athletes/register",
        registrationData
      );

      navigate("/registration-success", {
        state: {
          athleteId: response.data.athleteId,
        },
      });
    } catch (submitError) {
      console.error(submitError);

      setError(
        submitError.response?.data?.message ||
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
              Step {currentStep} of 6
            </span>

            {currentStep < 6 ? (
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