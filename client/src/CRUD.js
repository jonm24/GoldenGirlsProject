import React, { useEffect, useState } from "react";
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

// CREATE client page
export function Create() {
  const [text, setText] = useState("")
  const [data, setData] = useState(null)

  function createText(e) {
    e.preventDefault()
    fetch("https://an2wr0.deta.dev/text", { 
      method: 'PUT',
      body: JSON.stringify({"text": text }),
      headers: {'Content-Type': 'application/json'},
    }).then(data => data.json())
      .then(data => setData(data))
      .then(setText(""))
  }

  return (
    <div className="flex column">
      <h1>Create</h1>
      {
        data ?
        <div className="flex column">
          <Text id={data.key} data={data.text}></Text>
          <div className="btn" onClick={() => setData(null)}>Reset</div>
        </div>
        :
        <form onSubmit={(e) => createText(e)}>
          <textarea onChange={(e) => setText(e.target.value)} style={{height: '80px', width: '250px'}}></textarea>
          <input className="btn" type="submit" style={{marginLeft: '0', marginTop: '10px'}}></input>
        </form>
      }
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

// UPDATE client page
export function Update() {
  return (
    <h1>Update</h1>
  )
}

// DELETE client page
export function Delete() {
  return (
    <h1>Delete</h1>
  )
}


