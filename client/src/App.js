import "./index.css";
import bernie from "./bern.jpg";
import { fakeEvents, fakeUsers } from "./fakeData";

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
  function Events(){
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
  let attending = fakeUsers[2]['events'][elem['id']]
  let splitLocale = elem['location'].split('/')
  let cleanLocale = `${splitLocale[0]}, ${splitLocale[1]}`

  return (
    <div className="card flex column"> 
      <h1 className="eventName">{elem.name}</h1>
      <p style={{margin: '5px 0px 0px 0px', fontSize: '12px'}}>{elem["description"]}</p>
      <div className="flex" style={{alignSelf: 'flex-end', width: '100%', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <h2>{cleanLocale}</h2>
        {
          !attending ? 
            <div className="unsure flex">
              <h3 className="yes">✅</h3> 
              <h3 style={{margin: '0px 12px'}} className="maybe">❓</h3>
              <h3 className="no">❌</h3>
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
