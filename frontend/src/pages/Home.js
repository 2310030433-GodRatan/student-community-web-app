import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1>Welcome to Student Community</h1>
          <p>Share notes, resources, and collaborate with your peers</p>

          {!user ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/notes" className="btn-primary">
                Browse Notes
              </Link>
              <Link to="/resources" className="btn-secondary">
                Browse Resources
              </Link>
            </div>
          )}
        </div>

        <div className="features">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📝 Share Notes</h3>
              <p>Create and share your academic notes with the community</p>
            </div>
            <div className="feature-card">
              <h3>📚 Resources</h3>
              <p>Discover and share valuable educational resources</p>
            </div>
            <div className="feature-card">
              <h3>👥 Connect</h3>
              <p>Follow other students and build your network</p>
            </div>
            <div className="feature-card">
              <h3>💬 Collaborate</h3>
              <p>Comment and discuss notes with your peers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
