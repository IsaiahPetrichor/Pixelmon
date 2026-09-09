import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin/Admin.css';

const apiBaseUrl = import.meta.env.VITE_API_URL;
const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

type AuthUser = {
  userId: number;
  username: string;
  permissionLevel: number;
};

type LoginProps = {
  onAuthenticated: (user: AuthUser) => void;
};

function Login({ onAuthenticated }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isSigningUp && password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const response = await fetch(`${apiBaseUrl}/AdminAuth/${isSigningUp ? 'signup' : 'verify'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(result.message ?? 'Unable to authenticate.');
      }

      const result: { token: string } = await response.json();
      sessionStorage.setItem(authTokenKey, result.token);
      const validationResponse = await fetch(`${apiBaseUrl}/AdminAuth/validate`, {
        headers: { Authorization: `Bearer ${result.token}` },
      });
      const validationResult: { user: AuthUser } = await validationResponse.json();

      onAuthenticated(validationResult.user);
      navigate(validationResult.user.permissionLevel <= 3 ? '/admin' : '/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-auth">
      <div className="admin-auth-copy">
        <p className="eyebrow">{isSigningUp ? 'New account' : 'Welcome back'}</p>
        <h2>{isSigningUp ? 'Create an account' : 'Log in'}</h2>
        <p>{isSigningUp ? 'Create an account to get started.' : ''}</p>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete={isSigningUp ? 'new-password' : 'current-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={isSigningUp ? 8 : undefined}
          required
        />
        {isSigningUp && (
          <>
            <label htmlFor="login-confirm-password">Confirm password</label>
            <input
              id="login-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />
          </>
        )}
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isSigningUp
              ? 'Creating account...'
              : 'Logging in...'
            : isSigningUp
              ? 'Create account'
              : 'Log in'}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setIsSigningUp((current) => !current);
            setError('');
          }}
        >
          {isSigningUp ? 'Already have an account? Log in' : 'Create an account'}
        </button>
      </form>
    </section>
  );
}

export default Login;
