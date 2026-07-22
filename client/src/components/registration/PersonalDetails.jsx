import { User } from "lucide-react";
import {
  calculateAge,
  getAgeGroup,
} from "../../utils/ageCalculator";

function PersonalDetails({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "dob") {
      const age = calculateAge(value);

      updatedData.age = age;
      updatedData.ageGroup = getAgeGroup(age);
    }

    setFormData(updatedData);
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <User size={20} />
        </div>

        <div>
          <h2>Personal Details</h2>

          <p className="form-description">
            Enter your basic personal information.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          readOnly
        />

        <input
          type="text"
          placeholder="Age Group"
          value={formData.ageGroup}
          readOnly
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          type="tel"
          name="mobile"
          placeholder="10 Digit Mobile Number"
          maxLength="10"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default PersonalDetails;