import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";

import {
  getAthleteById,
  updateAthleteStatus,
} from "../services/adminApi";

import "../styles/admin.css";

const API_URL = "http://localhost:5002";

function AthleteProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAthleteById(id);

        setAthlete(data.athlete);
      } catch (fetchError) {
        console.error(
          "Fetch athlete error:",
          fetchError
        );

        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Failed to load athlete"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAthlete();
  }, [id]);

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `${API_URL}${filePath}`;
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusLoading(true);
      setError("");

      const data = await updateAthleteStatus(
        id,
        newStatus
      );

      setAthlete((previousAthlete) => ({
        ...previousAthlete,
        status: data.status,
      }));
    } catch (statusError) {
      console.error(
        "Status update error:",
        statusError
      );

      setError(
        statusError.response?.data?.message ||
          "Failed to update athlete status"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="athlete-profile-page">
        <div className="profile-loading">
          <LoaderCircle
            size={42}
            className="loading-icon"
          />

          <h2>Loading Athlete Profile</h2>

          <p>Fetching athlete information...</p>
        </div>
      </main>
    );
  }

  if (error && !athlete) {
    return (
      <main className="athlete-profile-page">
        <div className="profile-error glass-card">
          <AlertCircle size={42} />

          <h2>Unable to Load Athlete</h2>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="athlete-profile-page">
      <div className="athlete-profile-container">
        <button
          type="button"
          className="profile-back-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {error && (
          <div className="admin-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <section className="profile-hero glass-card">
          <div className="profile-image-wrapper">
            {athlete.profileImage ? (
              <img
                src={getFileUrl(
                  athlete.profileImage
                )}
                alt="Athlete"
                className="athlete-profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <User size={45} />
              </div>
            )}
          </div>

          <div className="profile-hero-info">
            <span className="registration-label">
              ATHLETE PROFILE
            </span>

            <h1>
              {athlete.firstName || "-"}{" "}
              {athlete.lastName || ""}
            </h1>

            <div className="profile-contact-list">
              <span>
                <Mail size={17} />
                {athlete.email || "-"}
              </span>

              <span>
                <Phone size={17} />
                {athlete.mobile || "-"}
              </span>

              <span>
                <CalendarDays size={17} />
                {athlete.ageGroup || "-"}
              </span>
            </div>
          </div>

          <span
            className={`status-badge status-${(
              athlete.status || "pending"
            ).toLowerCase()}`}
          >
            {athlete.status || "pending"}
          </span>
        </section>

        <section className="approval-card glass-card">
          <div className="approval-card-info">
            <span>REGISTRATION REVIEW</span>

            <h2>Approve or Reject Athlete</h2>

            <p>
              Review the athlete information and documents
              before changing the registration status.
            </p>
          </div>

          <div className="approval-actions">
            <button
              type="button"
              className="approve-athlete-button"
              onClick={() =>
                handleStatusUpdate("approved")
              }
              disabled={
                statusLoading ||
                athlete.status === "approved"
              }
            >
              {statusLoading ? (
                <LoaderCircle
                  size={19}
                  className="loading-icon"
                />
              ) : (
                <CheckCircle2 size={19} />
              )}

              Approve Athlete
            </button>

            <button
              type="button"
              className="reject-athlete-button"
              onClick={() =>
                handleStatusUpdate("rejected")
              }
              disabled={
                statusLoading ||
                athlete.status === "rejected"
              }
            >
              <XCircle size={19} />
              Reject Athlete
            </button>
          </div>
        </section>

        <div className="profile-details-grid">
          <ProfileSection
            icon={<User size={22} />}
            title="Personal Details"
          >
            <DetailItem
              label="First Name"
              value={athlete.firstName}
            />

            <DetailItem
              label="Last Name"
              value={athlete.lastName}
            />

            <DetailItem
              label="Date of Birth"
              value={athlete.dob}
            />

            <DetailItem
              label="Age"
              value={athlete.age}
            />

            <DetailItem
              label="Age Group"
              value={athlete.ageGroup}
            />

            <DetailItem
              label="Gender"
              value={athlete.gender}
            />

            <DetailItem
              label="Mobile"
              value={athlete.mobile}
            />

            <DetailItem
              label="Email"
              value={athlete.email}
            />
          </ProfileSection>

          <ProfileSection
            icon={<Users size={22} />}
            title="Guardian Details"
          >
            <DetailItem
              label="Guardian Name"
              value={athlete.guardianName}
            />

            <DetailItem
              label="Guardian Mobile"
              value={athlete.guardianMobile}
            />

            <DetailItem
              label="Relationship"
              value={athlete.guardianRelation}
            />
          </ProfileSection>

          <ProfileSection
            icon={<MapPin size={22} />}
            title="Address Details"
          >
            <DetailItem
              label="Address"
              value={athlete.addressLine}
            />

            <DetailItem
              label="City"
              value={athlete.city}
            />

            <DetailItem
              label="State"
              value={athlete.state}
            />

            <DetailItem
              label="PIN Code"
              value={athlete.pinCode}
            />
          </ProfileSection>

          <ProfileSection
            icon={<Building2 size={22} />}
            title="Club & State"
          >
            <DetailItem
              label="Club Name"
              value={athlete.clubName}
            />

            <DetailItem
              label="Representing State"
              value={athlete.representingState}
            />
          </ProfileSection>

          <ProfileSection
            icon={<Trophy size={22} />}
            title="Competition Details"
          >
            <DetailItem
              label="Competition Applied"
              value={athlete.competitionApplied}
            />

            <DetailItem
              label="Registration Status"
              value={athlete.status}
            />
          </ProfileSection>

          <ProfileSection
            icon={<FileText size={22} />}
            title="Payment & Insurance"
          >
            <DetailItem
              label="Payment Method"
              value={athlete.paymentMethod || "-"}
            />

            <DetailItem
              label="Payment Status"
              value={athlete.paymentStatus || "pending"}
            />

            <DetailItem
              label="Insurance Provider"
              value={athlete.insuranceProvider || "-"}
            />

            <DetailItem
              label="Insurance Policy"
              value={athlete.insurancePolicyNumber || "-"}
            />

            <DetailItem
              label="Insurance Valid Till"
              value={athlete.insuranceValidTill || "-"}
            />
          </ProfileSection>

          <section className="profile-section glass-card">
            <div className="profile-section-title">
              <FileText size={22} />
              <h2>Documents</h2>
            </div>

            <div className="document-list">
              <DocumentButton
                title="Birth Certificate"
                filePath={athlete.birthCertificate}
                getFileUrl={getFileUrl}
              />

              <DocumentButton
                title="Identity Document"
                filePath={athlete.identityDocument}
                getFileUrl={getFileUrl}
              />

              <DocumentButton
                title="School Bonafide"
                filePath={athlete.schoolBonafideCertificate}
                getFileUrl={getFileUrl}
              />

              <DocumentButton
                title="Insurance Document"
                filePath={athlete.insuranceDocument}
                getFileUrl={getFileUrl}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileSection({
  icon,
  title,
  children,
}) {
  return (
    <section className="profile-section glass-card">
      <div className="profile-section-title">
        {icon}
        <h2>{title}</h2>
      </div>

      <div className="profile-information-grid">
        {children}
      </div>
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="profile-detail-item">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function DocumentButton({
  title,
  filePath,
  getFileUrl,
}) {
  if (!filePath) {
    return (
      <div className="document-card document-missing">
        <FileText size={24} />

        <div>
          <strong>{title}</strong>
          <span>Document unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={getFileUrl(filePath)}
      target="_blank"
      rel="noopener noreferrer"
      className="document-card"
    >
      <FileText size={24} />

      <div>
        <strong>{title}</strong>
        <span>Open document</span>
      </div>

      <ExternalLink size={18} />
    </a>
  );
}

export default AthleteProfile;