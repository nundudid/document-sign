import React, { useState } from "react";
import axios from "axios";

function DocumentForm() {
  const [formData, setFormData] = useState({
    sender_iin: "",
    receiver_iin: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.file || !formData.file.name.endsWith(".pdf")) {
      setError("Please select a PDF file");
      return;
    }

    const data = new FormData();
    data.append("sender_iin", formData.sender_iin);
    data.append("receiver_iin", formData.receiver_iin);
    data.append("file", formData.file);

    setLoading(true);
    try {
      const response = await axios.post("/api/bitrix/documents/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        `Document uploaded successfully! Sign URL: ${response.data.sign_url}`,
      );
      setFormData({ sender_iin: "", receiver_iin: "", file: null });

      // Reset file input
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload New Document</h2>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sender_iin">Sender IIN</label>
          <input
            type="text"
            id="sender_iin"
            name="sender_iin"
            className="form-control"
            value={formData.sender_iin}
            onChange={handleChange}
            required
            pattern="[0-9]{12}"
            title="IIN must be 12 digits"
          />
        </div>

        <div className="form-group">
          <label htmlFor="receiver_iin">Receiver IIN</label>
          <input
            type="text"
            id="receiver_iin"
            name="receiver_iin"
            className="form-control"
            value={formData.receiver_iin}
            onChange={handleChange}
            required
            pattern="[0-9]{12}"
            title="IIN must be 12 digits"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">PDF Document</label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control file-input"
            onChange={handleFileChange}
            accept=".pdf"
            required
          />
          <small>Only PDF files are accepted</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
}

export default DocumentForm;
