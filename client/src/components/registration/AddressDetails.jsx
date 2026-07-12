function AddressDetails({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="form-step">
      <h2>Address Details</h2>

      <p className="form-description">
        Enter your current residential address.
      </p>

      <div className="form-grid">
        <textarea
          name="addressLine"
          placeholder="Full Address"
          value={formData.addressLine}
          onChange={handleChange}
          rows="4"
          className="full-width"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />

        <input
          type="text"
          name="pinCode"
          placeholder="6 Digit PIN Code"
          maxLength="6"
          value={formData.pinCode}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default AddressDetails;