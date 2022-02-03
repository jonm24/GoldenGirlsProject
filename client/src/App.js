import "./index.css";
import { Fragment, useEffect, useState } from 'react';
import { GlobalContext } from "./GlobalContext";
import { Events } from './components/Events';
import { Friends } from './components/Friends';
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogOutButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null)
  const [friendsPage, setFriendsPage] = useState(false)
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`https://q1weuz.deta.dev/users/login/${user.nickname}`)
        .then(data => data.json())
        .then(data => setCurrentUser(data.user))
    }
  }, [user])

  return (
    <div className="App">
      <div id="app-container">
        <h1 onClick={() => setFriendsPage(false)} style={{cursor: "pointer"}}>KickBack</h1>
        {
        isLoading ? 
          <h2>Fetching Google Account...</h2>
        : 
        !isAuthenticated ?
          <LoginButton setCurrentUser={setCurrentUser}/>
        : 
          <Fragment>
            <User avatar={user.picture} name={user.given_name} setFriendsPage={setFriendsPage} />
            { 
              !currentUser ?
                <h2>Fetching KickBack Account...</h2>  
              : 
              <Fragment>
                <div id="search">
                  <input onChange={(e) => setSearch(e.target.value)} type="text" className="search" placeholder="Search"></input>
                </div>
                <div className="main-container">
                  <GlobalContext.Provider value={{ currentUser, setCurrentUser, setFriendsPage, search }}>
                    {
                      friendsPage ?
                        <Friends />
                      : 
                        <Events />
                    }
                  </GlobalContext.Provider>
                </div>
              </Fragment>
            }
          </Fragment>
        }
      </div>
    </div>
  );
}

function User({ avatar, name, setFriendsPage }) {
  return (
    <div className="flex user-container">
      <div className="welcome">
        <img src={avatar} id="avatar" alt="avatar" />
        <h3 id="welcome-user">{name}</h3>
        <div onClick={() => setFriendsPage(true)}style={{paddingLeft: "10px", paddingTop: "5px"}}>
          <img alt="friends" src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/40/000000/external-contacts-twitter-flatart-icons-outline-flatarticons.png"/>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
