import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation, MutationResult } from '@apollo/client';
import Auth from '../utils/auth';
import '../styles/Signup.css';

// Define mutation
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

// Define TypeScript types for mutation result and variables
interface AddProfileData {
  addProfile: {
    token: string;
    profile: {
      _id: string;
      name: string;
      email: string;
    };
  };
}

interface AddProfileVars {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const [addProfile, mutationResult]: [
    (options: { variables: AddProfileVars }) => Promise<any>,
    MutationResult<AddProfileData>
  ] = useMutation<AddProfileData, AddProfileVars>(ADD_PROFILE);

  const { data, error, loading } = mutationResult;

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
      await addProfile({
        variables: {
          name: formState.name,
          email: formState.email,
          password: formState.password,
        },
      });

      if (data?.addProfile?.token) {
        Auth.login(data.addProfile.token);
        navigate('/me');
      } else {
        console.error('No token returned from addProfile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleFormSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formState.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formState.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {validationError && <p className="error">{validationError}</p>}
          {error && <p className="error">Signup failed. Try again.</p>}
        </form>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
