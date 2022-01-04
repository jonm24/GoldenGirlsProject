import React, { Fragment, useEffect, useState } from "react";
import './index.css'

// helper component for text objects
function Text({id, data}) {
  return (
    <div className="texts">
      <p><strong>id: </strong>{id}</p>
      <p><strong>text: </strong>{data}</p>
    </div>
  )
}

// READ client page
export function Read() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch("https://an2wr0.deta.dev/texts")
      .then(data => data.json())
      .then(data => setData(data["results"]))
  }, [])

  return (
    <div className="texts-container">
      {data.map((elem, index) => <Text key={index} id={elem.key} data={elem.text} />)}
    </div>
  )
}

// DELETE client page
export function Delete() {
  const [key, setKey] = useState(null)
  const [data, setData] = useState(null)

  function deleteText() {
    fetch(`https://an2wr0.deta.dev/text/${key}`, {method: 'DELETE'})
      .then(data => data.json())
      .then(data => setData(data))
  }
  
  function reset() {
    setData(null)
    setKey(null)
    document.getElementById("key").value = ""
  }

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
      {
        data ?
        <Fragment>
          <p><strong>deleted: </strong>{data.deleted}</p>
          <div className="btn" onClick={reset}>Reset</div>
        </Fragment>
        :
        <div className="btn" onClick={deleteText}>Submit</div>
      }
    </div>
  )
}

// CREATE/UPDATE client page
export function CreateUpdate() {
  const [text, setText] = useState(null)
  const [key, setKey] = useState(null)
  const [data, setData] = useState(null)

  function putText(e) {
    e.preventDefault()

    // update or create based on if key is not null
    let obj = key ? {"key": key, "text": text} : {"text": text}

    fetch("https://an2wr0.deta.dev/text", { 
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {'Content-Type': 'application/json'},
    }).then(data => data.json())
      .then(data => setData(data))
      .then(setText(null))
      .then(setKey(null))
  }

  return (
    <div className="flex column">
      <h1>Create/Update</h1>
      {
        data ?
        <div className="flex column">
          <Text id={data.key} data={data.text}></Text>
          <div className="btn" onClick={() => setData(null)}>Reset</div>
        </div>
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


