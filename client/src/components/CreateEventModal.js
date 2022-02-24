import { useState, Fragment, useEffect } from 'react';
import Modal from 'react-modal';
import AutoAddress from './AutoAddress';

// setup modal
Modal.setAppElement('#root');
const customModalStyles = {
  content: {
    width: 'max-content',
    height: 'max-content',
    padding: '50px 80px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    borderRadius: "3vh",
    boxShadow: '0px 0px 9px -3px #2e2e2e'
  },
};

export default function CreateEventModal ({ currentUser, setCurrentUser, userEvents, setUserEvents }) {
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
    let data = await res.json()
    setCurrentUser(data?.user)
    setUserEvents([...userEvents, data?.event])
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
        <button className="close-btn" onClick={closeModal}>close</button>
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
              className='modal-field'
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
          <button onClick={addEvent} className="submit-btn">Submit</button>
        </div>
      </Modal>
    </Fragment>
  )
}