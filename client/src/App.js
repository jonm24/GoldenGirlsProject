import "./index.css";
import bernie from "./bern.jpg";

export default function App() {
  return (
    <div className="App">
      <User />
      <div id="app-container">
        <h1>Golden Girls</h1>
        <div id="search">
          <input type="text" className="search" placeholder="Search"></input>
        </div>
        <div className="main-container">
          <Upcoming />
          <Events />
        </div>
      </div>
    </div>
  );
}

function User() {
  return(
    <div className="flex user-container">
      <div className="welcome">
        <img src={bernie} id="bernie" alt="bernie" />
        <h3 id="welcome-user">Welcome, Bernie</h3>
      </div>
    </div>
  )
}

function Upcoming() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Upcoming Events</h2>
      <div className="upcoming-container"></div>
    </div>
  );
}

function Events() {
  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <h2>My Events</h2>
      <button className="create-event"></button>
      <div className="events-container">
        {[0, 1, 2, 3, 4, 5].map((elem) => (
          <div key={elem} className="card"></div>
        ))}
      </div>
    </div>
  );
}
