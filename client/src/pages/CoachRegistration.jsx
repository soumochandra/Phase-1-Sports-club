import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, LoaderCircle, Send } from "lucide-react";

import api from "../services/api";
import "../styles/coachRegistration.css";

const initialForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  mobile: "",
  email: "",

  addressLine: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pinCode: "",

  sport: "",
  specialization: "",
  qualification: "",
  experience: "",
  coachLicenseNumber: "",

  portalPassword: "",
  confirmPassword: "",

  profileImage: null,
  identityDocument: null,
  coachingCertificate: null,
};

function CoachRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "mobile",
      "email",
      "addressLine",
      "city",
      "state",
      "pinCode",
      "sport",
      "qualification",
    ];

    const missingField = requiredFields.find(
      (field) => !String(formData[field] || "").trim()
    );

    if (missingField) {
      return "Please fill all required fields.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Enter a valid email address.";
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      return "Enter a valid 6-digit PIN code.";
    }

    if (!/^\d{6}$/.test(formData.portalPassword)) {
      return "Password must contain exactly 6 digits.";
    }

    if (formData.portalPassword !== formData.confirmPassword) {
      return "Password and confirm password do not match.";
    }

    if (
      !formData.profileImage ||
      !formData.identityDocument ||
      !formData.coachingCertificate
    ) {
      return "Upload your profile image, identity document, and coaching certificate.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const registrationData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "confirmPassword" && value !== null) {
          registrationData.append(key, value);
        }
      });

      const response = await api.post(
        "/coaches/register",
        registrationData
      );

      const registration = response.data?.data ?? response.data;

      navigate("/coach/login", {
        state: {
          coachId: registration.coachId,
          portalUserId: registration.portalUserId,
          portalPassword: registration.portalPassword,
        },
      });
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Coach registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="coach-registration-page">
      <section className="coach-registration-card">
        <div className="coach-registration-header">
          <span>COACH ONBOARDING</span>
          <h1>Coach Registration</h1>
          <p>Create your coach account and submit your professional details.</p>
        </div>

        {error && (
          <div className="coach-registration-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="coach-registration-form">
          <h2>Personal Details</h2>

          <div className="coach-form-grid">
            <Field label="First Name *">
              <input name="firstName" value={formData.firstName} onChange={handleChange} />
            </Field>

            <Field label="Last Name *">
              <input name="lastName" value={formData.lastName} onChange={handleChange} />
            </Field>

            <Field label="Date of Birth *">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </Field>

            <Field label="Gender *">
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Blood Group">
              <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            </Field>

            <Field label="Mobile Number *">
              <input name="mobile" inputMode="numeric" maxLength="10" value={formData.mobile} onChange={handleChange} />
            </Field>

            <Field label="Email Address *">
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </Field>
          </div>

          <h2>Address Details</h2>

          <div className="coach-form-grid">
            <Field label="Address *">
              <input name="addressLine" value={formData.addressLine} onChange={handleChange} />
            </Field>

            <Field label="City *">
              <input name="city" value={formData.city} onChange={handleChange} />
            </Field>

            <Field label="District">
              <input name="district" value={formData.district} onChange={handleChange} />
            </Field>

            <Field label="State *">
              <input name="state" value={formData.state} onChange={handleChange} />
            </Field>

            <Field label="Country">
              <input name="country" value={formData.country} onChange={handleChange} />
            </Field>

            <Field label="PIN Code *">
              <input name="pinCode" inputMode="numeric" maxLength="6" value={formData.pinCode} onChange={handleChange} />
            </Field>
          </div>

          <h2>Professional Details</h2>

          <div className="coach-form-grid">
            <Field label="Sport *">
              <input name="sport" placeholder="Example: Football" value={formData.sport} onChange={handleChange} />
            </Field>

            <Field label="Specialization">
              <input name="specialization" placeholder="Example: Goalkeeping" value={formData.specialization} onChange={handleChange} />
            </Field>

            <Field label="Qualification *">
              <input name="qualification" value={formData.qualification} onChange={handleChange} />
            </Field>

            <Field label="Experience">
              <input name="experience" placeholder="Example: 5 years" value={formData.experience} onChange={handleChange} />
            </Field>

            <Field label="Coaching License Number">
              <input name="coachLicenseNumber" value={formData.coachLicenseNumber} onChange={handleChange} />
            </Field>
          </div>

          <h2>Portal Password</h2>

          <div className="coach-form-grid">
            <Field label="Create 6-digit Password *">
              <input type="password" name="portalPassword" inputMode="numeric" maxLength="6" value={formData.portalPassword} onChange={handleChange} />
            </Field>

            <Field label="Confirm Password *">
              <input type="password" name="confirmPassword" inputMode="numeric" maxLength="6" value={formData.confirmPassword} onChange={handleChange} />
            </Field>
          </div>

          <h2>Required Documents</h2>

          <div className="coach-form-grid">
            <Field label="Profile Image (JPG/PNG) *">
              <input type="file" name="profileImage" accept=".jpg,.jpeg,.png" onChange={handleChange} />
            </Field>

            <Field label="Identity Document *">
              <input type="file" name="identityDocument" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
            </Field>

            <Field label="Coaching Certificate *">
              <input type="file" name="coachingCertificate" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
            </Field>
          </div>

          <button
            type="submit"
            className="coach-register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="loading-icon" size={18} />
                Registering...
              </>
            ) : (
              <>
                Submit Coach Registration
                <Send size={18} />
              </>
            )}
          </button>
        </form>

        <p className="coach-registration-login">
          Already registered? <Link to="/coach/login">Coach Login</Link>
        </p>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="coach-form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default CoachRegistration;