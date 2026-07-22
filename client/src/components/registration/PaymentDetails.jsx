import { CreditCard, Receipt, Lock } from "lucide-react";

function PaymentDetails({ formData, setFormData }) {
  const paymentOptions = [
    { value: "upi", label: "UPI" },
    { value: "card", label: "Credit / Debit Card" },
    { value: "netbanking", label: "Net Banking" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "paymentMethod") {
      setFormData((previousData) => ({
        ...previousData,
        paymentMethod: value,
        paymentStatus: value ? "paid" : "pending",
      }));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  return (
    <div className="form-step">
      <div className="section-title">
        <div className="section-icon">
          <CreditCard size={20} />
        </div>

        <div>
          <h2>Payment & Portal Password</h2>
          <p className="form-description">
            Choose a payment method and create your portal password.
          </p>
        </div>
      </div>

      <div className="payment-summary">
        <div className="payment-box">
          <Receipt size={20} />
          <div>
            <strong>Registration Fee</strong>
            <span>₹ 500 per athlete</span>
          </div>
        </div>

        <label className="payment-method-group">
          <span>Preferred Payment Method</span>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select a method</option>

            {paymentOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="input-group">
          <label>
            <Lock size={16} /> Portal Password
          </label>

          <input
            type="password"
            name="portalPassword"
            placeholder="Enter 6 digit password"
            maxLength={6}
            value={formData.portalPassword}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>
            <Lock size={16} /> Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            maxLength={6}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;