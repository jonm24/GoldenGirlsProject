import "./index.css";
import { useState } from 'react';
import bernie from "./bern.jpg";
import { fakeEvents, fakeUsers } from "./fakeData";
import { GlobalContext } from "./GlobalContext";
import { Upcoming } from './components/Upcoming';
import { Events } from './components/Events';

export default function App() {
  const [user, setUser] = useState(fakeUsers[2])
  const [allEvents, setAllEvents] = useState(fakeEvents)
  const [decidedList, setDecidedList] = useState(
    Object.entries(user['events'])
      .filter(value => value[1] === "Yes" || value[1] === "Maybe")
  )

  return (
    <div className="App">
      <User />
      <div id="app-container">
        <h1>Golden Girls</h1>
        <div id="search">
          <input type="text" className="search" placeholder="Search"></input>
        </div>
        <div className="main-container">
          <GlobalContext.Provider value={{ user, setUser, decidedList, setDecidedList, allEvents, setAllEvents }}>
            <Upcoming />
            <Events />
          </GlobalContext.Provider>
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
