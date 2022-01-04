import './index.css';
import { Routes, Route, Link } from "react-router-dom";
import { CreateUpdate, Read, Delete } from "./CRUD";

function App() {
  return (
    <div className="App">
      <h1>Golden Girls Client App</h1>

      <div className="flex">
        <Link to="/put" className="btn">Create/Update</Link>
        <Link to="/" className="btn">Read</Link>
        <Link to="/delete" className="btn">Delete</Link>
      </div>

      <Routes>
        <Route path="put" element={<CreateUpdate />} />
        <Route path="" element={<Read />} />
        <Route path="delete" element={<Delete />} />
      </Routes>
    </div>
  );
}

export default App;
