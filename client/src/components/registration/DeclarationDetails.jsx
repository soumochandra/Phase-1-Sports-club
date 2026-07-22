import { ShieldCheck, AlertTriangle } from "lucide-react";

function DeclarationDetails({ formData, setFormData }) {
  const handleChange = (event) => {
    const { name, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : event.target.value,
    }));
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <h2>Declaration & Consent</h2>
          <p className="form-description">Confirm the details and consent required for registration.</p>
        </div>
      </div>

      <div className="consent-card">
        <label className="checkbox-row">
          <input type="checkbox" name="declarationConfirmed" checked={Boolean(formData.declarationConfirmed)} onChange={handleChange} />
          <span>I confirm that all details provided are correct.</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="termsAccepted" checked={Boolean(formData.termsAccepted)} onChange={handleChange} />
          <span>I agree with the terms and conditions.</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="parentConsent" checked={Boolean(formData.parentConsent)} onChange={handleChange} />
          <span>Parent/guardian consent is provided for minors.</span>
        </label>
      </div>

      <div className="info-banner">
        <AlertTriangle size={18} />
        <span>Minors must provide guardian consent before their registration is accepted.</span>
      </div>
    </div>
  );
}

export default DeclarationDetails;
