import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

export function Upcoming() {
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
      <div className="covering" style={{bottom: '600px'}}></div>
    </div>
  );
}

export function UpcomingCard({ id, status }) {
  const { allEvents } = useContext(GlobalContext)
  let cleanLocale
  let elem = allEvents.find(elem => elem.id === id)

  if (elem['location'].includes("/")) {
    let splitLocale = elem['location'].split('/')
    cleanLocale = `${splitLocale[0]}, ${splitLocale[1]}`
  } else {
    cleanLocale = elem['location']
  }

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