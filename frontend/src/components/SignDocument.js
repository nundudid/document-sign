import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SignDocument() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decisionLoading, setDecisionLoading] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [token]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${token}/file/`);
      setDocument({
        token,
        file_url: response.data.file_url,
      });
      console.log(response.data.file_url);
    } catch (err) {
      setError("Document not found or invalid token");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (status) => {
    if (!window.confirm(`Are you sure you want to ${status} this document?`)) {
      return;
    }

    setDecisionLoading(true);
    try {
      await axios.post(`/api/documents/${token}/decision/`, { status });
      alert(`Document ${status} successfully!`);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This document already has a final decision");
        navigate("/");
      } else {
        alert("Failed to submit decision. Please try again.");
      }
    } finally {
      setDecisionLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="sign-container">
      <div className="sign-header">
        <h2>Sign Document</h2>
        <p>Token: {token}</p>
      </div>

      {document && (
        <>
          <div className="pdf-viewer">
            <iframe
              src={document.file_url}
              title="PDF Document"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>

          <div className="decision-buttons">
            <button
              onClick={() => handleDecision("accepted")}
              className="btn btn-success"
              disabled={decisionLoading}
            >
              {decisionLoading ? "Processing..." : "Accept Document"}
            </button>
            <button
              onClick={() => handleDecision("rejected")}
              className="btn btn-danger"
              disabled={decisionLoading}
            >
              {decisionLoading ? "Processing..." : "Reject Document"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SignDocument;
