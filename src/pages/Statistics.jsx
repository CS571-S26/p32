import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserJournalEntries } from '../services/journalService';
import '../styles/Statistics.css';

const Statistics = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadStatistics();
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const loadStatistics = async () => {
    try {
      setError('');
      const userEntries = await getUserJournalEntries();
      setEntries(userEntries);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load statistics. Please try again.';
      setError(errorMessage);
      console.error('Error loading statistics:', err);
    }
  };

  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const entriesThisPeriod = (days) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return entries.filter((entry) => new Date(entry.createdAt) >= threshold).length;
  };

  const moodCounts = entries.reduce((counts, entry) => {
    const mood = entry.mood || 'neutral';
    counts[mood] = (counts[mood] || 0) + 1;
    return counts;
  }, {});

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const mainMood = sortedMoods.length ? sortedMoods[0][0] : 'neutral';

  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => sum + countWords(entry.content), 0);
  const totalChars = entries.reduce((sum, entry) => sum + (entry.content ? entry.content.length : 0), 0);
  const averageWords = totalEntries ? Math.round(totalWords / totalEntries) : 0;
  const averageChars = totalEntries ? Math.round(totalChars / totalEntries) : 0;
  const latestEntry = entries[0];
  const secondLatestEntry = entries[1] || null;

  const moodName = (mood) => {
    const labels = {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      neutral: 'Neutral',
      anxious: 'Anxious',
      grateful: 'Grateful',
      excited: 'Excited',
      calm: 'Calm',
    };
    return labels[mood] || mood || 'Neutral';
  };

  const moodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
      anxious: '😰',
      grateful: '🙏',
      excited: '🤩',
      calm: '😌',
    };
    return emojis[mood] || '📝';
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-4">
        <Col>
          <div className="stats-header">
            <div>
              <h1>📊 Journal Statistics</h1>
              <p className="text-muted mb-0">
                Review your writing habits, moods, and entry history at a glance.
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {totalEntries === 0 ? (
        <Row>
          <Col>
            <Card className="text-center p-5">
              <Card.Body>
                <h5 className="mb-3">No entries yet</h5>
                <p className="text-muted mb-4">
                  Create your first entry to start tracking your journaling progress.
                </p>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Create Entry
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Total Entries</Card.Title>
                  <div className="stats-value">{totalEntries}</div>
                  <Card.Text className="text-muted">Your complete number of journal entries.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Most Frequent Mood</Card.Title>
                  <div className="stats-value">{moodEmoji(mainMood)} {moodName(mainMood)}</div>
                  <Card.Text className="text-muted">The mood you record most often.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Last Entry</Card.Title>
                  <div className="stats-value">{formatDateTime(latestEntry?.createdAt)}</div>
                  <Card.Text className="text-muted">Most recent journal entry timestamp.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Words Written</Card.Title>
                  <div className="stats-value">{totalWords}</div>
                  <Card.Text className="text-muted">Total words across all journal entries.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Average Words</Card.Title>
                  <div className="stats-value">{averageWords}</div>
                  <Card.Text className="text-muted">Average words per entry.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Entries This Week</Card.Title>
                  <div className="stats-value">{entriesThisPeriod(7)}</div>
                  <Card.Text className="text-muted">Entries created in the last 7 days.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Entries This Month</Card.Title>
                  <div className="stats-value">{entriesThisPeriod(30)}</div>
                  <Card.Text className="text-muted">Entries created in the last 30 days.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Average Characters</Card.Title>
                  <div className="stats-value">{averageChars}</div>
                  <Card.Text className="text-muted">Average characters per entry.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="stats-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Next Entry Goal</Card.Title>
                  <div className="stats-value">{Math.max(0, 5 - entriesThisPeriod(7))}</div>
                  <Card.Text className="text-muted">How many more entries until your weekly journaling goal.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Top Moods</Card.Title>
                  <ListGroup variant="flush" className="mt-3">
                    {sortedMoods.map(([mood, count]) => (
                      <ListGroup.Item key={mood} className="mood-item">
                        <span>{moodEmoji(mood)}</span>
                        <strong>{moodName(mood)}</strong>
                        <span>{count} {count === 1 ? 'entry' : 'entries'}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Recent Entries</Card.Title>
                  <ListGroup variant="flush" className="mt-3">
                    {entries.slice(0, 3).map((entry) => (
                      <ListGroup.Item key={entry.id}>
                        <div className="recent-entry-title">{entry.title}</div>
                        <div className="text-muted">{formatDateTime(entry.createdAt)}</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Statistics;
