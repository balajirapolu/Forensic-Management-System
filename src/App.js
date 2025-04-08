import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FileDetails from './components/FileDetails';
import FileUpload from './components/FileUpload';
import Navbar from './components/Navbar';
const Verify = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Verify Evidence</h1>
    <p>Verification functionality will be implemented here.</p>
  </div>
);

const Audit = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
    <p>Audit log functionality will be implemented here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/upload"
            element={
              <>
                <Navbar />
                <FileUpload />
              </>
            }
          />
          <Route
            path="/file/:id"
            element={
              <>
                <Navbar />
                <FileDetails />
              </>
            }
          />
          <Route
            path="/verify"
            element={
              <>
                <Navbar />
                <Verify />
              </>
            }
          />
          <Route
            path="/audit"
            element={
              <>
                <Navbar />
                <Audit />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
