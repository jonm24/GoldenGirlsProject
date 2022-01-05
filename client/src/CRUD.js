import React, { Fragment, useEffect, useState } from "react";
import './index.css'

// helper component for text objects
function Text({id, data}) {
  return (
    <div className="texts">
      <p><strong>key: </strong>{id}</p>
      <p><strong>text: </strong>{data}</p>
    </div>
  )
}

// READ client page
export function Read() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    fetch("https://an2wr0.deta.dev/texts")
      .then(data => data.json())
      .then(data => setData(data["results"]))
  }, [])

  return (
    <div className="texts-container">
      {data ?
        <Fragment>
          <div className="flex" style={{alignItems: "baseline"}}>
            <p>search by key:</p>
            <input 
              type="text" 
              placeholder="key" 
              onChange={(e) => setFilter(e.target.value)}
              style={{height: '20px', marginLeft: "10px"}}
            />
          </div>
          <div className="flex" style={{justifyContent: "space-around"}}>
            {data
              .filter(elem => filter ? elem.key === filter : true)
              .map((elem, index) => <Text key={index} id={elem.key} data={elem.text} />)
            }
          </div>
        </Fragment>
        :
        <h2>loading...</h2>
      }
    </div>
  )
}

// DELETE client page
export function Delete() {
  const [key, setKey] = useState(null)
  const [perform, setPerform] = useState(false)

  return (
    <div className="flex column">
      <h1>Delete</h1>
      <input 
        id="key"
        type="text" 
        placeholder="key" 
        onChange={(e) => setKey(e.target.value)}
        style={{height: '20px', marginBottom: '15px'}}
      />
      { perform ?
          <Deleter id={key} setKey={setKey} setPerform={setPerform}/>
        :
          <div id="submit" className="btn" onClick={() => setPerform(true)}>Submit</div>
      }
    </div>
  )
}
// helper for delete 
function Deleter({ id, setKey, setPerform }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`https://an2wr0.deta.dev/text/${id}`, {method: 'DELETE'})
      .then(data => data.json())
      .then(data => setData(data))
  }, [id])

  function reset() {
    setData(null)
    setKey(null)
    document.getElementById("key").value = ""
    setPerform(false)
  }

  return (
    <Fragment>
      {data ?
        <Fragment> 
          <p><strong>deleted: </strong>{data.deleted}</p>
          <div className="btn" onClick={reset}>Reset</div>
        </Fragment>
        : 
        <h2>loading...</h2>
      }
    </Fragment>
  )
}



// CREATE/UPDATE client page
export function CreateUpdate() {
  const [text, setText] = useState(null)
  const [key, setKey] = useState(null)
  const [perform, setPerform] = useState(false)

  function putText(e) {
    e.preventDefault()
    setPerform(true)
  }

  return (
    <div className="flex column">
      <h1>Create/Update</h1>
      {
        perform ?
          <CreateUpdater 
            setPerform={setPerform}
            setText={setText}
            setKey={setKey}
            obj={key ? {"key": key, "text": text} : {"text": text}}
          />
        :
        <form onSubmit={(e) => putText(e)} className="flex column">
          <input 
            type="text" 
            placeholder="key" 
            onChange={(e) => setKey(e.target.value)}
            style={{height: '20px'}}
          />
          <p>
            (only input key if you want to update)
          </p>
          <textarea 
            placeholder="text"
            onChange={(e) => setText(e.target.value)}
            style={{height: '80px', width: '250px', marginTop: '20px'}}
          />
          <input 
            className="btn" 
            type="submit" 
            style={{marginLeft: '0', marginTop: '10px'}}
          />
        </form>
      }
    </div>
  )
}
// create update helper
function CreateUpdater({ setPerform, setText, setKey, obj }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("https://an2wr0.deta.dev/text", { 
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {'Content-Type': 'application/json'},
    }).then(data => data.json())
      .then(data => setData(data))
  }, [obj])

  function reset() {
    setData(null)
    setKey(null)
    setText(null)
    setPerform(false)
  }

  return (
    <Fragment>
      {data ?
        <div className="flex column">
          <Text id={data.key} data={data.text}></Text>
          <div className="btn" onClick={reset}>Reset</div>
        </div>
        : 
        <h2>loading...</h2>
      }
    </Fragment>
  )
}


