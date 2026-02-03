import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DocumentForm from "./components/DocumentForm";
import SignDocument from "./components/SignDocument";
import DocumentList from "./components/DocumentList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Document Signing System
            </Link>
            <div className="nav-links">
              <Link to="/upload" className="nav-link">
                Upload Document
              </Link>
              <Link to="/sent" className="nav-link">
                Sent Documents
              </Link>
              <Link to="/received" className="nav-link">
                Received Documents
              </Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<DocumentForm />} />
            <Route path="/sign/:token" element={<SignDocument />} />
            <Route path="/sent" element={<DocumentList type="sent" />} />
            <Route
              path="/received"
              element={<DocumentList type="received" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Document Signing System</h1>
      <p>
        Upload documents, send them for signing, and manage your documents
        easily.
      </p>
      <div className="home-buttons">
        <Link to="/upload" className="btn btn-primary">
          Upload New Document
        </Link>
        <Link to="/sent" className="btn btn-secondary">
          View Sent Documents
        </Link>
        <Link to="/received" className="btn btn-secondary">
          View Received Documents
        </Link>
      </div>
    </div>
  );
}

export default App;
