import { useState, useContext, Fragment, useEffect } from 'react';
import { GlobalContext } from "../GlobalContext";
import Modal from 'react-modal';

// setup modal
Modal.setAppElement('#root');
const customModalStyles = {
  content: {
    width: 'max-content',
    height: 'max-content',
    padding: '70px 100px 100px 100px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// unique id generator
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
  );
}

export function Events() {
  const { currentUser } = useContext(GlobalContext)
  const [userEvents, setUserEvents] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserEvents(currentUser.events)
    }
  }, [currentUser])
  
  // modal
  const [modalIsOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState(null);
  const [description, setDescription] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function addEvent(e) {
    e.preventDefault()
    let newEvent = {
      'id': uuidv4(),
      name: name,
      location: location,
      time: time,
      description: description,
      host: currentUser['handle']
    }
    console.log(newEvent)
    // setAllEvents([newEvent, ...allEvents])
    setName(null)
    setLocation(null)
    setTime(null)
    setDescription(null)
    closeModal()
  }

  return (
    <div style={{ textAlign: "center", position: 'relative' }}>
      <h1 style={{marginBottom:'40px'}}>My Events</h1>
      <button onClick={openModal} className="create-event"></button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      > 
        <CreateEventForm 
          addEvent={addEvent}
          closeModal={closeModal}
          setName={setName}
          setLocation={setLocation}
          setTime={setTime}
          setDescription={setDescription}
        />
      </Modal>
      <div className="events-container">
        {
          !userEvents?.length ? 
          <h1>No events</h1>
          : 
          <Fragment>
            {userEvents.map((elem, index)=>(
              <Card key={index}  elem={elem} />
              ))
            }
          </Fragment>
        }
      </div>
    </div>
  );
}

function CreateEventForm({ addEvent, closeModal, setName, setLocation, setTime, setDescription}) {
  return (
    <Fragment>
      <button style={{position: 'absolute', right: '10px', top: '10px', cursor: 'pointer'}} onClick={closeModal}>close</button>
      <form onSubmit={(e) => addEvent(e)} className="flex column" style={{height: '400px', justifyContent: "space-around"}}>
        <input 
          className='modal-fields'
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Event Name"
        />
        <input 
          className='modal-fields' 
          onChange={(e) => setLocation(e.target.value)} 
          type="text" placeholder="Location"
        />
        <input 
          className='modal-fields' 
          onChange={(e) => setTime(e.target.value)} 
          type="datetime-local" placeholder="Date and Time"
        />
        <textarea 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description"
          style={{height: '100px'}}
        />
        <button style={{height: '50px'}}type="submit">Submit</button>
      </form>
    </Fragment>
  )
}

function Card({ elem }) {
  const { currentUser, setCurrentUser } = useContext(GlobalContext)
  let attending = currentUser ? currentUser['events'][elem['id']] : null
  let splitLocale = elem['location'].split('/')
  let cleanLocale = `${splitLocale[0]}, ${splitLocale[1]}`

  function setEvent(decision) {
    let currentUserEvents = currentUser['events']
    currentUserEvents[elem['id']] = decision
    setCurrentUser({...currentUser, currentUserEvents})
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


