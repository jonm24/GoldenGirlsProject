import { useState, useContext, Fragment, useEffect } from 'react';
import { GlobalContext } from "../GlobalContext";
import CreateEventModal from './CreateEventModal';
import $ from 'jquery';
import Modal from 'react-modal';

// setup modal
Modal.setAppElement('#root');
const customModalStyles = {
  content: {
    width: 'max-content',
    height: 'max-content',
    padding: '50px 80px 50px 50px',
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

export function Events({ userEvents, setUserEvents }) {
  const { currentUser, setCurrentUser, search } = useContext(GlobalContext)
  const [userDecisions, setUserDecisions] = useState([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalObject, setModalObject] = useState({});
  const [friendsGoing, setFriendsGoing] = useState([]);

  function openModal(elem) {
    setModalObject(elem)
    setModalIsOpen(true)
  }

  function closeModal() {
    setModalIsOpen(false)
  }

  function deleteEvent() {
    console.log(modalObject)
    fetch(`https://q1weuz.deta.dev/events/delete/${modalObject.key}`)
      .then(() => setUserEvents(userEvents.filter(elem => elem.key !== modalObject.key)))
      .then(() => setModalIsOpen(false))
  }

  useEffect(() => {
    setFriendsGoing(currentUser?.friends.filter(elem => modalObject?.invited?.includes(elem)))
  }, [modalObject, currentUser])

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
      <div className='filters-container'>
          <div id="all-filter" className='filters-item selected'>All</div>
          <div id="yes-filter" className='filters-item'>✅</div>
          <div id="maybe-filter" className='filters-item'>❓</div>
          <div id="no-filter" className='filters-item'>❌</div>
          <div id="host-filter" className='filters-item'>Hosting</div>
      </div>
      <CreateEventModal
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        userEvents={userEvents}
        setUserEvents={setUserEvents}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <button className="close-btn" onClick={closeModal}>close</button>
        <div className='view-modal-container'>
          <h2 style={{color: "black", paddingLeft: '0px'}}>{modalObject.name}</h2>
          <div>{modalObject.description}</div>
          <h5 style={{marginBottom: "0"}}>
            {new Date (modalObject.time).toDateString().slice(0, -4)} 
            @ {new Date (modalObject.time).toLocaleTimeString("en-US", {timeStyle: "long"})}
          </h5>
          <div className='flex'>
            <h5 style={{marginBottom: '0px', marginRight: "50px"}}>{modalObject.location}</h5>
            <h5>Hosted By: {modalObject.host}</h5>
          </div>
          {
            friendsGoing?.length > 0 ?
            <Fragment>
              <h4 style={{margin: '0'}}>Friends invited:</h4>
              <ul>
                {friendsGoing.map((elem, index) => <li key={index}>{elem}</li>)}
              </ul>
            </Fragment>
            : 
              null 
          }
          </div>
          {
            modalObject.host === currentUser?.key ?
              <button onClick={deleteEvent} className='delete-btn'>Delete Event</button>
            : 
              null
          }
      </Modal>
      <div className="events-container">
        {
          !userEvents?.length ? 
            <h2>No events</h2>
          :
          <Fragment>
            {userEvents
              .filter(elem => {
                if ( elem !== null 
                    && (!search || (search && elem.name.toLowerCase().startsWith(search.toLowerCase())))
                    && (eventFilter === "all" || eventFilter === userDecisions[elem?.key])) {
                  return true
                }
                return false
              })
              .map((elem, index)=>(
                <Card 
                  key={index}
                  elem={elem}
                  decision={userDecisions[elem?.key]}
                  openModal={openModal}
                />
              ))
            }
          </Fragment>
        }
      </div>
    </div>
  );
}

function Card({ elem, decision, openModal }) {
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
      <div style={{cursor: 'pointer'}} onClick={() => openModal(elem)}> 
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
