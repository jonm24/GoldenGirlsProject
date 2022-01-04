import './index.css';
import { Routes, Route, Link } from "react-router-dom";
import { Create, Read, Update, Delete } from "./CRUD";

function App() {
  return (
    <div className="App">
      <h1>Golden Girls Client App</h1>

      <div className="flex">
        <Link to="/create" className="btn">Create</Link>
        <Link to="/" className="btn">Read</Link>
        <Link to="/update" className="btn">Update</Link>
        <Link to="/delete" className="btn">Delete</Link>
      </div>

      <Routes>
        <Route path="create" element={<Create />} />
        <Route path="" element={<Read />} />
        <Route path="update" element={<Update />} />
        <Route path="delete" element={<Delete />} />
      </Routes>
    </div>
  );
}

export default App;
