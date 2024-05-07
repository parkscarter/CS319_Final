import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";

function App() {
  const [currentView, setCurrentView] = useState("Home");
  const [nbaData, setNbaData] = useState(null);
  const [mmaData, setMmaData] = useState(null);
  const [mlsData, setMlsData] = useState(null);
  const [betEvent, setBetEvent] = useState(null);
  const [betAmount, setBetAmount] = useState("");

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

  const handleBetClick = (event, betType, team) => {
    // Set the selected event for betting
    setBetEvent({ event, betType, team });
    // Change view to the betting view
    setCurrentView("Bet");
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
            <h2 className="text-light">NBA Events</h2>
            <div className="row">
              {nbaData &&
                nbaData.map((event, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-header bg-danger">
                        <h5 className="card-title text-center">
                          {formatTime(event.commence_time)}
                        </h5>
                      </div>
                      <div className="card-body">
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
                              <strong>Spread:</strong>
                              <br />
                              {event.bookmakers[0] &&
                              event.bookmakers[0].markets[1] ? (
                                <div>
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "spread", "away")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[1].outcomes[0]
                                        .point
                                    }
                                  </button>
                                  <br />
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "spread", "home")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[1].outcomes[1]
                                        .point
                                    }
                                  </button>
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
                          <div className="col">
                            <p className="card-text">
                              <strong>Moneyline:</strong>
                              <br />
                              {event.bookmakers[0] &&
                              event.bookmakers[0].markets[0] ? (
                                <div>
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "away")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[0]
                                        .price
                                    }
                                  </button>
                                  <br />
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "home")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[1]
                                        .price
                                    }
                                  </button>
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
            <h2 className="text-light">MMA Events</h2>
            <div className="row">
              {mmaData &&
                mmaData.map((event, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-header bg-danger">
                        <h5 className="card-title text-center">
                          {formatTime(event.commence_time)}
                        </h5>
                      </div>
                      <div className="card-body">
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
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "away")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[0]
                                        .price
                                    }
                                  </button>
                                  <br />
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "home")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[1]
                                        .price
                                    }
                                  </button>
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
            <h2 className="text-danger">MLS Events</h2>
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
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "away")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[0]
                                        .price
                                    }
                                  </button>

                                  <br />
                                  <button
                                    onClick={() =>
                                      handleBetClick(event, "moneyline", "home")
                                    }
                                  >
                                    {
                                      event.bookmakers[0].markets[0].outcomes[1]
                                        .price
                                    }
                                  </button>
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
      case "Bet":
        console.log(betEvent);

        const handleAmountChange = (e) => {
          setBetAmount(e.target.value);
        };

        const calculateToWin = () => {
          let odds;
          // Determine the odds based on the selected bet type and team
          if (betEvent.betType === "spread") {
            odds =
              betEvent.team === "away"
                ? betEvent.event.bookmakers[0].markets[1].outcomes[0].point
                : betEvent.event.bookmakers[0].markets[1].outcomes[1].point;
          } else if (betEvent.betType === "moneyline") {
            odds =
              betEvent.team === "away"
                ? betEvent.event.bookmakers[0].markets[0].outcomes[0].price
                : betEvent.event.bookmakers[0].markets[0].outcomes[1].price;
          }

          // Calculate "to win" based on bet type
          let toWin;
          if (betEvent.betType === "spread") {
            toWin = betAmount * odds;
          } else if (betEvent.betType === "moneyline") {
            if (odds > 0) {
              // Positive odds: calculate how much you will win if you bet $100
              toWin = (betAmount * odds) / 100;
            } else {
              // Negative odds: calculate how much you need to bet to win $100
              toWin = (-100 * betAmount) / odds;
            }
          }

          return toWin;
        };
        return (
          <div>
            <h2>Betting on Event</h2>
            {/* Display information about the selected event */}
            {betEvent && (
              <div className="card">
                <div className="card-header bg-danger">
                  <h5 className="card-title text-center">
                    {formatTime(betEvent.event.commence_time)}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <p className="card-text">
                        <strong>Teams:</strong>
                        <br />
                        {betEvent.event.away_team}
                        <br />
                        {betEvent.event.home_team}
                      </p>
                    </div>
                    <div className="col">
                      <p className="card-text">
                        <strong>Bet Type:</strong> {betEvent.betType}
                        <br />
                        <strong>Team:</strong>{" "}
                        {betEvent.team === "away"
                          ? betEvent.event.away_team
                          : betEvent.event.home_team}
                      </p>
                    </div>
                    <div className="col">
                      <p className="card-text">
                        {/* Render the spread bet button based on betType and team */}
                        {betEvent.betType === "spread" &&
                          betEvent.team === "away" &&
                          betEvent.event.bookmakers[0] &&
                          betEvent.event.bookmakers[0].markets[1] && (
                            <button
                              onClick={() =>
                                handleBetClick(betEvent.event, "spread", "away")
                              }
                            >
                              {
                                betEvent.event.bookmakers[0].markets[1]
                                  .outcomes[0].point
                              }
                            </button>
                          )}
                        {betEvent.betType === "spread" &&
                          betEvent.team === "home" &&
                          betEvent.event.bookmakers[0] &&
                          betEvent.event.bookmakers[0].markets[1] && (
                            <button
                              onClick={() =>
                                handleBetClick(betEvent.event, "spread", "home")
                              }
                            >
                              {
                                betEvent.event.bookmakers[0].markets[1]
                                  .outcomes[1].point
                              }
                            </button>
                          )}
                        {/* If not spread bet, show "Missing Data" */}
                        {betEvent.betType !== "spread" && <div></div>}
                      </p>
                    </div>
                    <div className="col">
                      <p className="card-text">
                        {/* Render the moneyline bet button based on betType and team */}
                        {betEvent.betType === "moneyline" &&
                          betEvent.team === "away" &&
                          betEvent.event.bookmakers[0] &&
                          betEvent.event.bookmakers[0].markets[0] && (
                            <button
                              onClick={() =>
                                handleBetClick(
                                  betEvent.event,
                                  "moneyline",
                                  "away"
                                )
                              }
                            >
                              {
                                betEvent.event.bookmakers[0].markets[0]
                                  .outcomes[0].price
                              }
                            </button>
                          )}
                        {betEvent.betType === "moneyline" &&
                          betEvent.team === "home" &&
                          betEvent.event.bookmakers[0] &&
                          betEvent.event.bookmakers[0].markets[0] && (
                            <button
                              onClick={() =>
                                handleBetClick(
                                  betEvent.event,
                                  "moneyline",
                                  "home"
                                )
                              }
                            >
                              {
                                betEvent.event.bookmakers[0].markets[0]
                                  .outcomes[1].price
                              }
                            </button>
                          )}
                        {/* If not moneyline bet, show "Missing Data" */}
                        {betEvent.betType !== "moneyline" && <div></div>}
                      </p>
                    </div>
                  </div>
                  <div className="col">
                    {/* Bet Amount input */}
                    <label htmlFor="betAmount" className="form-label">
                      Bet Amount:
                    </label>
                    <input
                      type="number"
                      id="betAmount"
                      className="form-control"
                      value={betAmount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="col">
                    {/* To Win field */}
                    <label htmlFor="toWin" className="form-label">
                      To Win:
                    </label>
                    <input
                      type="number"
                      id="toWin"
                      className="form-control"
                      value={calculateToWin()}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
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
    <div className="App bg-dark">
      <nav className="navbar navbar-expand-lg navbar-light bg-danger">
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
        <h1 className="text-light">{currentView}</h1>
        {renderView({
          currentView,
          nbaData,
          mmaData,
          mlsData,
          betAmount,
          setBetAmount,
          handleBetClick,
        })}
      </div>
    </div>
  );
}

export default App;
