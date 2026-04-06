import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Navbar.css';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/p32/login');
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };

  return (
    <Navbar bg="dark" expand="lg" className="navbar-custom sticky-top">
      <Container>
        <Navbar.Brand href="/p32/" className="brand-text">
          <span className="brand-icon">📔</span> JournalKeeper
        </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            {!loading && !user ? (
              <>
                <Nav.Link href="/p32/login" className="nav-link-auth">
                  Login
                </Nav.Link>
                <Nav.Link href="/p32/register" className="nav-link-auth">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Nav.Link>
              </>
            ) : !loading && user ? (
              <>
                <Nav.Link href="/p32/dashboard" className="nav-link-logged">
                  Dashboard
                </Nav.Link>
                <Nav.Link href="/p32/entries" className="nav-link-logged">
                  Entries
                </Nav.Link>
                <div className="nav-user-section">
                  <span className="user-email">{user.email}</span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <span className="loading-text">Loading...</span>
            )}
          </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
