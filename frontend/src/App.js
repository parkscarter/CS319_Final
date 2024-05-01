import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

function App() {
  const [currentView, setCurrentView] = useState("Home");
  const changeView = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "Home":
        return <div>This is the Home view.</div>;
      case "Events":
        return <div>This is the Events view.</div>;
      case "Wagers":
        return <div>This is the Wagers view.</div>;
      case "Profile":
        return <div>This is the Profile view.</div>;
      case "About":
        return <div>This is the About view.</div>;
      default:
        return <div>View not found.</div>;
    }
  };
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a
            className="navbar-brand"
            href="#home"
            onClick={() => changeView("Home")}
          >
            Rookies Playbook
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    currentView === "Events" ? "active" : ""
                  }`}
                  href="#events"
                  onClick={() => changeView("Events")}
                >
                  Events
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    currentView === "Wagers" ? "active" : ""
                  }`}
                  href="#wagers"
                  onClick={() => changeView("Wagers")}
                >
                  Wagers
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    currentView === "Profile" ? "active" : ""
                  }`}
                  href="#profile"
                  onClick={() => changeView("Profile")}
                >
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    currentView === "About" ? "active" : ""
                  }`}
                  href="#about"
                  onClick={() => changeView("About")}
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <h1>{currentView}</h1>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
