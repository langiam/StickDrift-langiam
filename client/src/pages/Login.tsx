import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import '../styles/Login.css';
import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      if (data?.login?.token) {
        Auth.login(data.login.token);
      }
    } catch (e) {
      console.error('Login error:', e);
    }

    setFormState({ email: '', password: '' });
  };

  return (
    <main>
      <div>
        <h4>Login</h4>
        <div>
          {data ? (
            <p>
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <input
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                placeholder="Password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button type="submit" style={{ cursor: 'pointer' }}>
                Submit
              </button>
            </form>
          )}

          {error && (
            <div style={{ color: 'red', marginTop: '8px' }}>
              {error.message.includes('Incorrect credentials')
                ? 'Incorrect email or password.'
                : 'Login failed. Please try again.'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
