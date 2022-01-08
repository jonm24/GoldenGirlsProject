import "./index.css";
import { useContext, useState } from 'react';
import bernie from "./bern.jpg";
import { fakeEvents, fakeUsers } from "./fakeData";
import { GlobalContext } from "./GlobalContext";

export default function App() {
  const [user, setUser] = useState(fakeUsers[2])
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
          <GlobalContext.Provider value={{ user, setUser, decidedList, setDecidedList }}>
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

function Upcoming() {
  const { decidedList } = useContext(GlobalContext)

  return (
    <div style={{ textAlign: "center", position: 'relative' }}>
      <h2>Upcoming Events</h2>
      <div className="upcoming-container">
      {decidedList.map((event, index)=>(
          <UpcomingCard key={index}  id={event[0]} status={event[1]}/>
          ))
        }
      </div>

      {/* covers cards getting cut off */}
      <div className="covering"></div>
      <div className="covering" style={{bottom: '580px'}}></div>
    </div>
  );
}

function UpcomingCard({ id, status }) {
  let elem = fakeEvents.find(elem => elem.id === id)
  let splitLocale = elem['location'].split('/')
  let cleanLocale = `${splitLocale[0]}, ${splitLocale[1]}`

  return (
    <div className="card flex column" style={{backgroundColor: "#2e2e2e", color: "white"}}> 
      <h1 className="eventName" style={{color: "white"}}>{elem.name}</h1>
      <p style={{margin: '5px 0px 0px 0px', fontSize: '12px'}}>{elem["description"]}</p>
      <div className="flex" style={{alignSelf: 'flex-end', width: '100%', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <h2 style={{color: "white"}}>{cleanLocale}</h2>
        {
          status === "Yes" ?
            <h3 className="yes">✅</h3>
          : status === "Maybe" ?
            <h3 className="maybe">❓</h3>
          :
            <h3 className="no">❌</h3>
        }
      </div>
    </div>
  )
}


function Events() {
  return (
    <div style={{ textAlign: "center", position: 'relative' }}>
      <h2>My Events</h2>
      <button className="create-event"></button>
      <div className="events-container">
        {fakeEvents.map((elem, index)=>(
          <Card key={index}  elem={elem} />
          ))
        }
      </div>
    </div>
  );
}
function Card({ elem }) {
  const { user, setUser, decidedList, setDecidedList } = useContext(GlobalContext)
  let attending = user['events'][elem['id']]
  let splitLocale = elem['location'].split('/')
  let cleanLocale = `${splitLocale[0]}, ${splitLocale[1]}`

  function setEvent(decision) {
    let userEvents = user['events']
    userEvents[elem['id']] = decision
    setUser({...user, userEvents})
    if (decision !== "No") {
      setDecidedList([[elem.id, decision], ...decidedList])
    }
  }

  return (
    <div className="card flex column"> 
      <h1 className="eventName">{elem.name}</h1>
      <p style={{margin: '5px 0px 0px 0px', fontSize: '12px'}}>{elem["description"]}</p>
      <div className="flex" style={{alignSelf: 'flex-end', width: '100%', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <h2>{cleanLocale}</h2>
        {
          !attending ? 
            <div className="unsure flex">
              <h3 onClick={() => setEvent("Yes")} className="yes">✅</h3> 
              <h3 onClick={() => setEvent("Maybe")} style={{margin: '0px 12px'}} className="maybe">❓</h3>
              <h3 onClick={() => setEvent("No")} className="no">❌</h3>
            </div>
          : attending === "Yes" ?
            <h3 className="yes">✅</h3>
          : attending === "Maybe" ?
            <h3 className="maybe">❓</h3>
          :
            <h3 className="no">❌</h3>
        }
      </div>
    </div>
  )
}
