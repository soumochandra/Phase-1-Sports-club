import { Shield } from "lucide-react";

function ClubStateDetails({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <Shield size={20} />
        </div>

        <div>
          <h2>Club & State Details</h2>

          <p className="form-description">
            Tell us about your sports representation.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <input
          type="text"
          name="clubName"
          placeholder="Club Name"
          value={formData.clubName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="representingState"
          placeholder="Representing State"
          value={formData.representingState}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default ClubStateDetails;