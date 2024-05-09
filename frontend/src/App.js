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
  const [toWin, setToWin] = useState("");
  const [bets, setBets] = useState([]);

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
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch("http://localhost:8081/bets");
        if (!response.ok) {
          throw new Error("Failed to fetch bets");
        }
        const betsData = await response.json();
        setBets(betsData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchBets();
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

  const placeBet = async () => {
    const betData = {
      teamBetOn: betEvent.event.away_team, // Example: Replace with actual data
      teamBetAgainst: betEvent.event.home_team, // Example: Replace with actual data
      timeOfGame: betEvent.event.commence_time, // Example: Replace with actual data
      betAmount: betAmount,
      toWin: toWin,
    };

    try {
      changeView("Events");
      const response = await fetch("http://localhost:8081/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(betData),
      });

      if (response.ok) {
        // Bet successfully placed
        console.log("Bet placed successfully!");
        // Handle any further actions here
      } else {
        // Bet placement failed
        console.error("Failed to place bet:", response.statusText);
        // Handle error here
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      // Handle error here
    }
  };

  const calculateToWin = () => {
    if (!betEvent) return ""; // Return empty string if betEvent is not set

    let odds;
    // Determine the odds based on the selected bet type and team

    odds =
      betEvent.team === "away"
        ? betEvent.event.bookmakers[0].markets[0].outcomes[0].price
        : betEvent.event.bookmakers[0].markets[0].outcomes[1].price;

    // Calculate "to win" based on bet type
    let betInDollars = parseInt(betAmount);

    let toWin;

    if (odds > 0) {
      // Positive odds: calculate how much you will win if you bet $100
      toWin = betInDollars + (betInDollars * odds) / 100;
    } else {
      // Negative odds: calculate how much you need to bet to win $100
      toWin = betInDollars + (-100 * betInDollars) / odds;
    }

    return toWin;
  };

  const calculateWinnings = (amount) => {
    if (!betEvent) return ""; // Return empty string if betEvent is not set

    let odds;
    // Determine the odds based on the selected bet type and team

    odds =
      betEvent.team === "away"
        ? betEvent.event.bookmakers[0].markets[0].outcomes[0].price
        : betEvent.event.bookmakers[0].markets[0].outcomes[1].price;

    // Calculate "to win" based on bet type
    let betInDollars = parseInt(amount);

    let toWin;

    if (odds > 0) {
      // Positive odds: calculate how much you will win if you bet $100
      toWin = betInDollars + (betInDollars * odds) / 100;
    } else {
      // Negative odds: calculate how much you need to bet to win $100
      toWin = betInDollars + (-100 * betInDollars) / odds;
    }

    return toWin;
  };

  const cancelBet = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/bet/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Bet deleted successfully!");
      } else {
        console.error("Failed to delete bet:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting bet:", error);
    }
  };

  const doubleBet = async (bet) => {
    try {
      const response = await fetch(`http://localhost:8081/bet/${bet._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bet), // Include updated bet data here
      });
      if (response.ok) {
        console.log("Bet doubled successfully!");
      } else {
        console.error("Failed to double bet:", response.statusText);
      }
    } catch (error) {
      console.error("Error doubling bet:", error);
    }
  };

  const handleAmountChange = (e) => {
    setBetAmount(e.target.value);
    setToWin(calculateWinnings(e.target.value));
  };

  const handleToWinChange = (e) => {
    console.log(e.toLocaleString);
    setToWin(e.target.value);
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
                      <div className="card-header bg-danger">
                        {" "}
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
        return (
          <div className="bg-dark">
            {/* Display information about the selected event */}
            {betEvent && (
              <div className="card">
                <div className="card-header bg-danger">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <button
                        className="btn btn-primary text-white"
                        onClick={() => changeView("Events")}
                      >
                        Back
                      </button>
                    </div>
                    <div className="col">
                      <h5 className="card-title text-center">
                        {formatTime(betEvent.event.commence_time)}
                      </h5>
                    </div>
                  </div>
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
                        <strong>Betting On:</strong>{" "}
                        {betEvent.team === "away"
                          ? betEvent.event.away_team
                          : betEvent.event.home_team}
                      </p>
                    </div>
                    <div className="col">
                      <p className="card-text">
                        <strong>Odds: </strong>
                        {/* Render the moneyline bet button based on betType and team */}
                        {betEvent.betType === "moneyline" &&
                          betEvent.team === "away" &&
                          betEvent.event.bookmakers[0] &&
                          betEvent.event.bookmakers[0].markets[0] && (
                            <button>
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
                            <button>
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
                  <div className="row">
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
                      <label htmlFor="toWin" className="form-label">
                        To Win:
                      </label>
                      <input
                        type="number"
                        id="toWin"
                        className="form-control"
                        value={calculateToWin()}
                        onChange={handleToWinChange}
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <button className="btn btn-primary" onClick={placeBet}>
                        Place Bet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "Wagers":
        return (
          <div>
            <div className="row">
              {bets.map((bet, index) => (
                <div key={index} className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header bg-danger">
                      <h5 className="card-title text-center">
                        Bet #{index + 1}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col">
                          <p className="card-text">
                            <strong>Team Bet On:</strong> {bet.teamBetOn}
                          </p>
                          <p className="card-text">
                            <strong>Team Bet Against:</strong>{" "}
                            {bet.teamBetAgainst}
                          </p>
                          <p className="card-text">
                            <strong>Time of Game:</strong>{" "}
                            {formatTime(bet.timeOfGame)}
                          </p>
                          <p className="card-text">
                            <strong>Bet Amount:</strong> {bet.betAmount}
                          </p>
                          <p className="card-text">
                            <strong>To Win:</strong> {bet.toWin}
                          </p>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-primary"
                            onClick={() => doubleBet(bet)}
                          >
                            Double Up
                          </button>
                          <br />
                          <br />
                          <br />
                          <button
                            className="btn btn-primary"
                            onClick={() => cancelBet(bet._id)}
                          >
                            Cancel Bet
                          </button>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
          setToWin,
          handleBetClick,
        })}
      </div>
    </div>
  );
}

export default App;
