import { Trophy } from "lucide-react";

const competitions = [
  "Football",
  "Cricket",
  "Athletics",
  "Badminton",
  "Basketball",
  "Volleyball",
  "Swimming",
  "Table Tennis",
];

const categories = ["Beginner", "Intermediate", "Advanced"];

function CompetitionDetails({
  formData,
  setFormData,
}) {
  const selectCompetition = (competition) => {
    setFormData({
      ...formData,
      competitionApplied: competition,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <Trophy size={20} />
        </div>

        <div>
          <h2>Competition Details</h2>

          <p className="form-description">
            Select the competition you want to apply for and choose the category.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select name="eventLevel" value={formData.eventLevel} onChange={handleChange}>
          <option value="">Select level</option>
          <option value="U-14">U-14</option>
          <option value="U-18">U-18</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="competition-grid">
        {competitions.map((competition) => (
          <button
            key={competition}
            type="button"
            className={`competition-card ${
              formData.competitionApplied === competition
                ? "selected"
                : ""
            }`}
            onClick={() => selectCompetition(competition)}
          >
            <Trophy size={22} />

            <span>{competition}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompetitionDetails;