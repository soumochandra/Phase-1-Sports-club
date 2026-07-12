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

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <Trophy size={20} />
        </div>

        <div>
          <h2>Competition Details</h2>

          <p className="form-description">
            Select the competition you want to apply for.
          </p>
        </div>
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
            onClick={() =>
              selectCompetition(competition)
            }
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