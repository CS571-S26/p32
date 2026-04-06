import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Welcome to your Dashboard!</h1>
          <Alert variant="info" className="text-center">
            <strong>JournalKeeper</strong> - Your personal journaling companion
          </Alert>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>📝 New Entry</Card.Title>
              <Card.Text>
                Start writing your thoughts and memories. Create a new journal entry.
              </Card.Text>
              <Button variant="primary" className="w-100">
                Create Entry
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>📚 My Entries</Card.Title>
              <Card.Text>
                View and manage all your journal entries. Browse through your memories.
              </Card.Text>
              <Button variant="secondary" className="w-100">
                View Entries
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>📊 Statistics</Card.Title>
              <Card.Text>
                See insights about your journaling habits and writing patterns.
              </Card.Text>
              <Button variant="info" className="w-100">
                View Stats
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>🏷️ Categories</Card.Title>
              <Card.Text>
                Organize your entries with tags and categories for better organization.
              </Card.Text>
              <Button variant="success" className="w-100">
                Manage Tags
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>🔍 Search</Card.Title>
              <Card.Text>
                Find specific entries quickly with powerful search functionality.
              </Card.Text>
              <Button variant="warning" className="w-100">
                Search Entries
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>⚙️ Settings</Card.Title>
              <Card.Text>
                Customize your journaling experience and account preferences.
              </Card.Text>
              <Button variant="dark" className="w-100">
                Account Settings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="bg-light">
            <Card.Body className="text-center">
              <h5>Recent Activity</h5>
              <p className="text-muted mb-0">
                No recent entries yet. Start your journaling journey by creating your first entry!
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;