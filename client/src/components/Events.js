import { useState, useContext, Fragment, useEffect } from 'react';
import { GlobalContext } from "../GlobalContext";
import Modal from 'react-modal';
import $ from 'jquery';
import AutoAddress from './AutoAddress';

export function Events({ userEvents, setUserEvents }) {
  const { currentUser, setCurrentUser, search } = useContext(GlobalContext)
  const [userDecisions, setUserDecisions] = useState([]);
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    let temp = {}
    for (let elem of currentUser?.events) {
      temp[Object.keys(elem)[0]] = Object.values(elem)[0]
    }
    setUserDecisions(temp)
  }, [currentUser]);

  useEffect(() => {
    $(".filters-item").on('click', function () {
      $(".selected").removeClass("selected")
      $(this).addClass("selected")
      setEventFilter($(this).attr("id").split("-")[0])
    })

    return () => {
      $("filters-items").off("click")
    };
  }, []);
  
  return (
    <div style={{ textAlign: "center", position: 'relative' }}>
      <h1 style={{marginBottom:'20px'}}>My Events</h1>
      <div className='filters-container'>
          <div id="all-filter" className='filters-item selected'>All</div>
          <div id="yes-filter" className='filters-item'>✅</div>
          <div id="maybe-filter" className='filters-item'>❓</div>
          <div id="no-filter" className='filters-item'>❌</div>
          <div id="host-filter" className='filters-item'>Hosting</div>
      </div>
      <CreateEvent 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        userEvents={userEvents}
        setUserEvents={setUserEvents}
      />
      <div className="events-container">
        {
          !userEvents?.length ? 
            <h1>No events</h1>
          :
          <Fragment>
            {userEvents
              .filter(elem => {
                if ((!search || (search && elem.name.toLowerCase().startsWith(search.toLowerCase())))
                    && (eventFilter === "all" || eventFilter === userDecisions[elem.key])) {
                  return true
                }
                return false
              })
              .map((elem, index)=>(
                <Card 
                  key={index}
                  elem={elem}
                  decision={userDecisions[elem.key]}
                />
              ))
            }
          </Fragment>
        }
      </div>
    </div>
  );
}

function Card({ elem, decision }) {
  const { currentUser, setCurrentUser } = useContext(GlobalContext)
  const [status, setStatus] = useState(decision)
  let cleanLocale = elem.location

  useEffect(() => {
    setStatus(decision)
  }, [decision])

  function setEvent(decision) {
    setStatus(decision)
    fetch(`https://q1weuz.deta.dev/events/rsvp/${elem.key}/${currentUser.key}/${decision}/${currentUser.version}`)
      .then(data => data.json())
      .then(data => {
        if (data.error) {
          alert(`error: ${data.error}`)
          setCurrentUser(data.user)
        } else {
          setCurrentUser(data.result)
        }
      })
  }

  return (
    <div className="card flex column">
      <div style={{cursor: 'pointer'}}> 
        <h1 className="eventName black">{elem.name}</h1>
        <p style={{margin: '5px 0px 0px 0px', fontSize: '12px', color: "black"}}>{elem.description}</p>
      </div>
      <div className="flex" style={{alignSelf: 'flex-end', width: '100%', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <h2>{cleanLocale}</h2>
        {
          elem.host === currentUser.key ? 
            <p>Host</p>
          : !status ? 
            <div className="unsure flex">
              <h3 onClick={() => setEvent("yes")} className="yes">✅</h3> 
              <h3 onClick={() => setEvent("maybe")} style={{margin: '0px 12px'}} className="maybe">❓</h3>
              <h3 onClick={() => setEvent("no")} className="no">❌</h3>
            </div>
          : 
            <div className='flex'>
              {
                status === "yes" ?
                  <h3 className="yes">✅</h3>
                : status === "maybe" ?
                  <h3 className="maybe">❓</h3>
                : 
                  <h3 className="no">❌</h3>
              }
              <img 
                style={{width: '25px', height: '25px', marginLeft: '5px', cursor: "pointer"}}
                onClick={() => setStatus("")}
                alt="edit" 
                src="https://img.icons8.com/windows/32/000000/edit--v1.png"
              />
            </div>
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

function CreateEvent ({ currentUser, setCurrentUser, userEvents, setUserEvents }) {
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

  async function addEvent() {
    let newEvent = {
      name: name,
      location: location,
      time: time,
      description: description,
      invited: guestList,
      host: currentUser.key
    }
    let res = await fetch(`https://q1weuz.deta.dev/events/create/${currentUser.version}`,{
      method: 'POST',
      body: JSON.stringify(newEvent),
      headers: {'Content-Type': 'application/json'} 
    })
    let newUser = await res.json()
    setCurrentUser(newUser.user)
    setUserEvents([...userEvents, newEvent])
    setName(null)
    setLocation(null)
    setTime(null)
    setDescription(null)
    setGuestList([])
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
            <AutoAddress setLocation={setLocation}/>
          </div>
          <div className='modal-field-container'>
            <h4 className='modal-title'>Date & Time:</h4>
            <input 
              style={{width: "32.5ch"}}
              className='modal-field' 
              placeholder={`${new Date(Date.now()).toISOString().split(".")[0].slice(0, -3)}`}
              onChange={(e) => setTime(e.target.value)} 
              type="datetime-local"
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
          <button onClick={addEvent} style={{height: '50px'}}type="submit">Submit</button>
        </div>
      </Modal>
    </Fragment>
  )
}
