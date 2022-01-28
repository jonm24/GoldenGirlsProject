import "./index.css";
import { Fragment, useState } from 'react';
import { fakeEvents, fakeUsers } from "./fakeData";
import { GlobalContext } from "./GlobalContext";
import { Upcoming } from './components/Upcoming';
import { Events } from './components/Events';
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogOutButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { user, isAuthenticated, error, isLoading } = useAuth0();
  console.log(user, isAuthenticated, error);
  const [currentUser, setCurrentUser] = useState(fakeUsers[2])
  const [allEvents, setAllEvents] = useState(fakeEvents)
  const [decidedList, setDecidedList] = useState(
    Object.entries(currentUser['events'])
      .filter(value => value[1] === "Yes" || value[1] === "Maybe")
  )

  return (
    <div className="App">
      <div id="app-container">
        <h1>KickBack</h1>
        {
        isLoading ? 
          <h2>Loading...</h2>
        : 
        !isAuthenticated ?
          <LoginButton />
        : 
          <Fragment>
            <User pic={user.picture} name={user.given_name}/>
            <div id="search">
              <input type="text" className="search" placeholder="Search"></input>
            </div>
            <div className="main-container">
              <GlobalContext.Provider value={{ currentUser, setCurrentUser, decidedList, setDecidedList, allEvents, setAllEvents }}>
                <Upcoming />
                <Events />
              </GlobalContext.Provider>
            </div>
          </Fragment>
        }
      </div>
    </div>
  );
}

function User({pic, name}) {
  return (
    <div className="flex user-container">
      <div className="welcome">
        <img src={pic} id="bernie" alt="bernie" />
        <h3 id="welcome-user">{name}</h3>
        <LogoutButton />
      </div>
    </div>
  );
}
