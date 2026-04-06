import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/p32/login" element={<Login />} />
        <Route path="/p32/register" element={<Register />} />
        <Route path="/p32/dashboard" element={<Dashboard />} />
        <Route
          path="/p32/"
          element={
            <div className="home-container">
              <h1>Welcome to JournalKeeper</h1>
              <p>Start your journaling journey today. Login or register to get started.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
