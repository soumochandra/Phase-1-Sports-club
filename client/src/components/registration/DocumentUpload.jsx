import {
  Image,
  FileText,
  UploadCloud,
  CheckCircle,
} from "lucide-react";

function DocumentUpload({
  formData,
  setFormData,
  setError,
}) {
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    const file = files[0];

    if (!file) return;

    setError("");

    if (name === "profileImage") {
      const allowedImages = [
        "image/jpeg",
        "image/png",
      ];

      if (!allowedImages.includes(file.type)) {
        setError("Profile image must be JPG or PNG");
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError(
          "Profile image must be 2MB or smaller before compression"
        );

        e.target.value = "";
        return;
      }
    }

    if (
      name === "birthCertificate" ||
      name === "identityDocument"
    ) {
      if (file.type !== "application/pdf") {
        setError("Documents must be PDF files");

        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("PDF file must not exceed 2MB");

        e.target.value = "";
        return;
      }
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: file,
    }));
  };

  const UploadBox = ({
    name,
    title,
    description,
    accept,
    icon: Icon,
  }) => {
    const file = formData[name];

    return (
      <label
        className={`upload-box ${
          file ? "file-selected" : ""
        }`}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          hidden
        />

        <div className="upload-icon">
          {file ? (
            <CheckCircle size={25} />
          ) : (
            <Icon size={25} />
          )}
        </div>

        <div className="upload-info">
          <h3>{title}</h3>

          <p>{file ? file.name : description}</p>
        </div>

        {!file && (
          <UploadCloud
            size={21}
            className="upload-action-icon"
          />
        )}
      </label>
    );
  };

  return (
    <div className="form-step">
      <h2>Document Uploads</h2>

      <p className="form-description">
        Upload all mandatory athlete documents.
      </p>

      <div className="upload-grid">
        <UploadBox
          name="profileImage"
          title="Profile Image"
          description="JPG or PNG • Auto compressed to max 1MB"
          accept="image/jpeg,image/png"
          icon={Image}
        />

        <UploadBox
          name="birthCertificate"
          title="Birth Certificate"
          description="PDF • Maximum 2MB"
          accept="application/pdf"
          icon={FileText}
        />

        <UploadBox
          name="identityDocument"
          title="Identity Document"
          description="PDF • Maximum 2MB"
          accept="application/pdf"
          icon={FileText}
        />
      </div>
    </div>
  );
}

export default DocumentUpload;