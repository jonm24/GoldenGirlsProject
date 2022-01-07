import './index.css';

export default function App() {
  return (
    <div className="App">
      <h1>Golden Girls</h1>
      <input type="text" className="search" placeholder="Search"></input>
      <div className="main-container">
        <Upcoming />
        <Events />
      </div>
    </div>
  );
}

function Upcoming() {
  return (
    <div style={{textAlign: "center"}}>
      <h2>Upcoming Events</h2>
      <div className="upcoming-container">

      </div>
    </div>
  )
}

function Events() {
  return (
    <div style={{textAlign: "center", position: 'relative'}}>
      <h2>My Events</h2>
      <button className="create-event"></button>
      <div className="events-container">
        {[0,1,2,3,4,5]
          .map(elem => <div key={elem} className="card"></div>)
        }
      </div>
    </div>
  )
}
