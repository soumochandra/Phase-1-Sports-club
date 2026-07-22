import {
  Image,
  FileText,
  UploadCloud,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

import { compressImage } from "../../utils/compressImage";

function DocumentUpload({ formData, setFormData, setError }) {
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    setError("");

    if (name === "profileImage") {
      const allowedImages = ["image/jpeg", "image/png"];

      if (!allowedImages.includes(file.type)) {
        setError("Profile image must be JPG or PNG");
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("Profile image must be 2MB or smaller before compression");
        e.target.value = "";
        return;
      }

      try {
        const compressedFile = await compressImage(file, {
          quality: 0.8,
          maxWidth: 1024,
        });

        setError("Your image has been optimized for faster upload");
        setFormData((previousData) => ({
          ...previousData,
          [name]: compressedFile,
        }));
        return;
      } catch (compressionError) {
        console.error(compressionError);
        setError("Image compression failed. Please try again.");
        e.target.value = "";
        return;
      }
    }

    if (name === "birthCertificate" || name === "identityDocument" || name === "schoolBonafideCertificate" || name === "insuranceDocument") {
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setError("Only PDF or image files are allowed for these documents");
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("File must not exceed 2MB");
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
      <label className={`upload-box ${file ? "file-selected" : ""}`}>
        <input type="file" name={name} accept={accept} onChange={handleFileChange} hidden />

        <div className="upload-icon">
          {file ? <CheckCircle size={25} /> : <Icon size={25} />}
        </div>

        <div className="upload-info">
          <h3>{title}</h3>
          <p>{file ? file.name : description}</p>
        </div>

        {!file && <UploadCloud size={21} className="upload-action-icon" />}
      </label>
    );
  };

  return (
    <div className="form-step">
      <h2>Document Uploads</h2>

      <p className="form-description">Upload all mandatory athlete documents and supporting records.</p>

      <div className="upload-grid">
        <UploadBox name="profileImage" title="Profile Image" description="JPG or PNG • Auto compressed to max 1MB" accept="image/jpeg,image/png" icon={Image} />

        <UploadBox name="birthCertificate" title="Birth Certificate" description="PDF • Maximum 2MB" accept="application/pdf" icon={FileText} />

        <UploadBox name="identityDocument" title="Identity Document" description="PDF • Maximum 2MB" accept="application/pdf" icon={FileText} />

        <UploadBox name="schoolBonafideCertificate" title="School Bonafide" description="PDF • Optional but recommended" accept="application/pdf" icon={FileText} />

        <UploadBox name="insuranceDocument" title="Insurance Document" description="PDF or Image • Optional" accept="application/pdf,image/jpeg,image/png" icon={ShieldCheck} />
      </div>
    </div>
  );
}

export default DocumentUpload;