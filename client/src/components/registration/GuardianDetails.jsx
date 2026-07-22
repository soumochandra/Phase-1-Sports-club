import { Users } from "lucide-react";

function GuardianDetails({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <Users size={20} />
        </div>

        <div>
          <h2>Guardian Details</h2>

          <p className="form-description">
            Enter your guardian or parent information.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <input
          type="text"
          name="guardianName"
          placeholder="Guardian Name"
          value={formData.guardianName}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="guardianMobile"
          placeholder="Guardian Mobile Number"
          maxLength="10"
          value={formData.guardianMobile}
          onChange={handleChange}
        />

        <input
          type="text"
          name="guardianRelation"
          placeholder="Relation"
          value={formData.guardianRelation}
          onChange={handleChange}
        />

        <input
          type="email"
          name="guardianEmail"
          placeholder="Guardian Email (Optional)"
          value={formData.guardianEmail}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default GuardianDetails;