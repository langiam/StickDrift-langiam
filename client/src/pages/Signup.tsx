// client/src/pages/Signup.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useMutation, gql } from '@apollo/client';
import Auth from '../utils/auth';
import '../styles/Signup.css';

// Make sure this matches your server’s mutation signature exactly:
const ADD_PROFILE = gql`
  mutation AddProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;

export default function Signup() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const [addProfile, { data, error, loading }] = useMutation(ADD_PROFILE);

  // Update state on input change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  // Submit the form
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Client‐side validation
    if (formState.name.trim().length < 2) {
      setValidationError('Name must be at least 2 characters.');
      return;
    }
    if (formState.email.trim().length < 5) {
      setValidationError('Email must be at least 5 characters.');
      return;
    }
    if (formState.password.trim().length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    try {
      // Pass variables exactly as name, email, password (no “input” wrapper)
      const response = await addProfile({
        variables: {
          name: formState.name,
          email: formState.email,
          password: formState.password,
        },
      });

      const token = response.data.addProfile.token;
      Auth.login(token);
      // After storing the token, redirect to the “/me” route:
      navigate('/me');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>

        {data ? (
          <p>
            Success! You may now head{' '}
            <Link to="/">back to the homepage.</Link>
          </p>
        ) : (
          <form onSubmit={handleFormSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="Your name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="you@example.com"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                placeholder="••••••••"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="signup-button">
              {loading ? 'Creating Account…' : 'Sign Up'}
            </button>

            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}
          </form>
        )}

        {error && (
          <div className="server-error">
            Error: {error.message}
          </div>
        )}

        <p className="redirect-login">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </main>
  );
}
