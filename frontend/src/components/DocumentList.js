import React, { useState, useEffect } from "react";
import axios from "axios";

function DocumentList({ type }) {
  const [documents, setDocuments] = useState([]);
  const [iin, setIin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchDocuments = async () => {
    if (!iin || iin.length !== 12) {
      setError("Please enter a valid 12-digit IIN");
      return;
    }

    setLoading(true);
    setError("");
    setSearchPerformed(true);

    try {
      const endpoint = type === "sent" ? "sent" : "received";
      const paramName = type === "sent" ? "sender_iin" : "receiver_iin";
      const response = await axios.get(
        `http://localhost:8000/api/documents/${endpoint}/?${paramName}=${iin}`,
      );

      console.log("API Response:", response.data); // For debugging

      if (Array.isArray(response.data)) {
        setDocuments(response.data);
      } else {
        setError("Unexpected response format");
        setDocuments([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        `Failed to fetch documents: ${err.response?.data?.error || err.message}`,
      );
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="document-list">
      <h2>{type === "sent" ? "Sent Documents" : "Received Documents"}</h2>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="iin">
              Enter {type === "sent" ? "Sender" : "Receiver"} IIN (12 digits)
            </label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <input
                type="text"
                id="iin"
                className="form-control"
                value={iin}
                onChange={(e) => setIin(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter 12-digit IIN"
                pattern="[0-9]{12}"
                required
                style={{ flex: 1 }}
                maxLength="12"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !iin || iin.length !== 12}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div
          className="error"
          style={{ padding: "1.5rem", margin: "1rem", background: "#ffe6e6" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Loading documents...
        </div>
      ) : documents.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>{type === "sent" ? "Receiver IIN" : "Sender IIN"}</th>
                <th>Status</th>
                <th>Created</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.token}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.9em" }}>
                    {doc.token}
                  </td>
                  <td>{type === "sent" ? doc.receiver_iin : doc.sender_iin}</td>
                  <td>
                    <span className={`status status-${doc.status}`}>
                      {doc.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{formatDate(doc.created_at)}</td>
                  <td>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.8em" }}
                      >
                        View PDF
                      </a>
                    )}
                  </td>
                  <td>
                    {type === "received" && doc.status === "pending" && (
                      <a
                        href={`/sign/${doc.token}`}
                        className="btn btn-primary"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8em",
                          marginRight: "0.5rem",
                        }}
                      >
                        Sign Document
                      </a>
                    )}
                    <a
                      href={`/sign/${doc.token}`}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8em" }}
                    >
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchPerformed &&
        !loading &&
        !error && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#666",
              background: "#f9f9f9",
              margin: "1rem",
              borderRadius: "4px",
            }}
          >
            No documents found for this IIN
          </div>
        )
      )}

      {!searchPerformed && (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "#999",
            background: "#f5f5f5",
            margin: "1rem",
            borderRadius: "4px",
          }}
        >
          Enter an IIN above to search for documents
        </div>
      )}
    </div>
  );
}

export default DocumentList;
