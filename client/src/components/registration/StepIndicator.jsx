import {
  User,
  Users,
  MapPin,
  Shield,
  Trophy,
  FileUp,
  Check,
} from "lucide-react";

const steps = [
  { title: "Personal", icon: User },
  { title: "Guardian", icon: Users },
  { title: "Address", icon: MapPin },
  { title: "Club", icon: Shield },
  { title: "Competition", icon: Trophy },
  { title: "Documents", icon: FileUp },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const Icon = step.icon;

        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div className="step-wrapper" key={step.title}>
            <div
              className={`step-item ${
                isActive ? "active" : ""
              } ${isCompleted ? "completed" : ""}`}
            >
              <div className="step-circle">
                {isCompleted ? (
                  <Check size={19} />
                ) : (
                  <Icon size={19} />
                )}
              </div>

              <span>{step.title}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`step-line ${
                  isCompleted ? "completed" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;