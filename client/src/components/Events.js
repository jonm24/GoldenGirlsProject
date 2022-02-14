import { useState, useContext, Fragment, useEffect } from 'react';
import { GlobalContext } from "../GlobalContext";
import Modal from 'react-modal';

export function Events() {
  const { currentUser } = useContext(GlobalContext)
  const [userEvents, setUserEvents] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserEvents(currentUser.events)
    }
  }, [currentUser])
  
  return (
    <div style={{ textAlign: "center", position: 'relative' }}>
      <h1 style={{marginBottom:'40px'}}>My Events</h1>
      <CreateEvent 
        currentUser={currentUser} 
      />
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



// CREATE EVENT MODAL

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
    textAlign: 'center', 
  },
};

// unique id generator
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
  );
}

function CreateEvent ({ currentUser }) {
  // modal
  const [modalIsOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [invitee, setInvitee] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);


  function openModal() {
    setIsOpen(true);
    fetch(`https://q1weuz.deta.dev/users/all`)
      .then(data => data.json())
      .then(data => setAllUsers(data.results))
      .finally(console.log("got all users"))
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

  useEffect(() => {
    setFilteredUsers(
      allUsers.filter(elem => (
          elem.toLowerCase().startsWith(invitee.toLowerCase())
      ))
    )
  }, [allUsers, invitee]);

  function addInvitee(invitee) {
    setGuestList([...guestList, invitee])
    document.getElementById("invite-input").value = ''
    setInvitee('')
    setShowSuggestions(false)
    return
  }

  function removeName(index) {
    setGuestList([...guestList.slice(0, index), ...guestList.slice(index+1)])
  }

  function handleGuestInput(e) {
    if (document.activeElement.classList[0].includes("user-suggest-card")) {
        if (e.key === 'ArrowDown') {
          document.activeElement.nextElementSibling?.focus()
        } else if (e.key === "ArrowUp") {
          document.activeElement.previousElementSibling?.focus()
        } else if ( e.key === "Enter") {
          addInvitee(document.activeElement.innerHTML);
          document.getElementById("invite-input").focus()
        }
      return
    }
  
    if (e.key === 'Enter' && e.target.value !== '') {
      addInvitee(e.target.value)
      return
    }
    if (e.key === "ArrowDown" && e.target.value !== '') {
      document.getElementById("suggestions").firstElementChild.focus()      
    }
    setInvitee(e.target.value)
    setShowSuggestions(e.target.value !== '' ? true : false)
  }

  return (
    <Fragment>
      <button onClick={openModal} className="create-event"></button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      > 
        <h2 style={{color: "black"}}>Create an Event</h2>
        <button style={{position: 'absolute', right: '10px', top: '10px', cursor: 'pointer'}} onClick={closeModal}>close</button>
        <div className="flex column" style={{justifyContent: "space-around"}}>
          <div className='modal-field-container'>
            <h4 className='modal-title'>Event name:</h4>
            <input 
              className='modal-field'
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </div>
          <div className='modal-field-container'>
            <h4 className='modal-title'>Location:</h4>
            <input 
              className='modal-field' 
              onChange={(e) => setLocation(e.target.value)} 
              type="text" placeholder="Location"
            />
          </div>
          <div className='modal-field-container'>
            <h4 className='modal-title'>Date & Time:</h4>
            <input 
              style={{width: "32.5ch"}}
              className='modal-field' 
              value={`${new Date(Date.now()).toISOString().split(".")[0].slice(0, -3)}`}
              onChange={(e) => setTime(e.target.value)} 
              type="datetime-local" placeholder="Date and Time"
            />
          </div>
          <div className='modal-field-container'>
            <h4 className='modal-title'>Description:</h4>
            <textarea 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Description"
              style={{height: '100px', padding: "10px 10px", width: '69%'}}
            />
          </div>
          <div className='modal-field-container' style={{position: 'relative'}}>
            <h4 className='modal-title'>Invite:</h4>
            <input 
              autoComplete='off'
              id="invite-input"
              className='modal-field'
              onKeyUp={(e) => handleGuestInput(e)}
              placeholder='Type Email and Press Enter'
            />
            {
              showSuggestions ?
                <div tabIndex={-1} id="suggestions" className='suggestions'>
                  {
                    filteredUsers?.length > 0 ?
                      filteredUsers.map((elem, index) => (
                        <div
                          tabIndex={index}
                          onKeyUp={(e) => handleGuestInput(e)}
                          onClick={() => { addInvitee(elem) }}
                          className='user-suggest-card' key={index}
                        >
                          {elem}
                        </div>
                      ))
                    : 
                      <div className='user-suggest-card'>No matching users.</div>
                  }
                </div>
              : 
                null
            }
          </div>
          <div className='flex' style={{width: "425px", marginBottom: "10px", justifyContent: "flex-end"}}>
            {
              guestList.map((elem, index) => (
                <div className='guest-chip' key={index} style={{margin: '5px'}}>
                  <p style={{margin: 0}}>{elem}</p>
                  <h5 
                    style={{margin: '0px 0px 0px 10px', cursor: 'pointer'}}
                    onClick={() => removeName(index)}
                  >
                    X
                  </h5>
                </div>
              ))
            }
          </div>
          <button style={{height: '50px'}}type="submit">Submit</button>
        </div>
      </Modal>
    </Fragment>
  )
}
