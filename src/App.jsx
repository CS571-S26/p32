import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entries" element={<Entries />} />
        <Route path="/stats" element={<Statistics />} />
        <Route
          path="/"
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
