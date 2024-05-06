import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";

function App() {
  const [currentView, setCurrentView] = useState("Home");
  const [nbaData, setNbaData] = useState(null);
  const [mmaData, setMmaData] = useState(null);
  const [mlsData, setMlsData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [nbaResponse, mmaResponse, mlsResponse] = await Promise.all([
          fetch("http://localhost:8081/nba"),
          fetch("http://localhost:8081/mma"),
          fetch("http://localhost:8081/mls"),
        ]);

        if (!nbaResponse.ok || !mmaResponse.ok || !mlsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const nbaData = await nbaResponse.json();
        const mmaData = await mmaResponse.json();
        const mlsData = await mlsResponse.json();

        setNbaData(nbaData);
        setMmaData(mmaData);
        setMlsData(mlsData);
        console.log(mlsData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEventData();
  }, []);

  const changeView = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US");
    };

    switch (currentView) {
      case "Home":
        return <div>This is the Home view.</div>;
      case "Events":
        return (
          <div>
            <h2>NBA Events</h2>
            <div className="row">
              {nbaData &&
                nbaData.map((event, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-center">
                          {formatTime(event.commence_time)}
                        </h5>
                        <div className="row">
                          <div className="col">
                            <p className="card-text">
                              <strong>Teams:</strong>
                              <br />
                              {event.away_team}
                              <br />
                              {event.home_team}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <strong>Spread Odds:</strong>
                              <br />
                              {event.bookmakers[0].markets[1].outcomes[0].point}
                              <br />
                              {event.bookmakers[0].markets[1].outcomes[1].point}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <strong>Moneyline:</strong>
                              <br />
                              {event.bookmakers[0].markets[0].outcomes[0].price}
                              <br />
                              {event.bookmakers[0].markets[0].outcomes[1].price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <h2>MMA Events</h2>
            <div className="row">
              {mmaData &&
                mmaData.map((event, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-center">
                          {formatTime(event.commence_time)}
                        </h5>
                        <div className="row">
                          <div className="col">
                            <p className="card-text">
                              <strong>Fighters:</strong>
                              <br />
                              {event.away_team}
                              <br />
                              {event.home_team}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <strong>Moneyline:</strong>
                              <br />
                              {event.bookmakers[0] &&
                              event.bookmakers[0].markets[0] ? (
                                <div>
                                  {
                                    event.bookmakers[0].markets[0].outcomes[0]
                                      .price
                                  }
                                  <br />
                                  {
                                    event.bookmakers[0].markets[0].outcomes[1]
                                      .price
                                  }
                                </div>
                              ) : (
                                <div>
                                  Missing Data.
                                  <br />
                                  Missing Data.
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <h2>MLS Events</h2>
            <div className="row">
              {mlsData &&
                mlsData.map((event, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-center">
                          {formatTime(event.commence_time)}
                        </h5>
                        <div className="row">
                          <div className="col">
                            <p className="card-text">
                              <strong>Teams:</strong>
                              <br />
                              {event.away_team}
                              <br />
                              {event.home_team}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <strong>Moneyline:</strong>
                              <br />
                              {event.bookmakers[0] &&
                              event.bookmakers[0].markets[0] ? (
                                <div>
                                  {
                                    event.bookmakers[0].markets[0].outcomes[0]
                                      .price
                                  }
                                  <br />
                                  {
                                    event.bookmakers[0].markets[0].outcomes[1]
                                      .price
                                  }
                                </div>
                              ) : (
                                <div>
                                  Missing Data.
                                  <br />
                                  Missing Data.
                                </div>
                              )}
                              <br />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
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
