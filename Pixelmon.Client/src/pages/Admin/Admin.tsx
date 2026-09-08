import { useEffect, useState, type SubmitEvent } from 'react';
import './Admin.css';

const apiBaseUrl = 'http://localhost:5172';
const adminTokenStorageKey = 'adminToken';

function Admin() {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(() => Boolean(sessionStorage.getItem(adminTokenStorageKey)));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem(adminTokenStorageKey);
    if (!token) return;

    fetch(`${apiBaseUrl}/AdminAuth/validate`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setIsAuthorized(response.ok))
      .catch(() => setIsAuthorized(false))
      .finally(() => setIsCheckingAccess(false));
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/AdminAuth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, apiKey }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or API key.');
      }

      const result: { token: string } = await response.json();
      sessionStorage.setItem(adminTokenStorageKey, result.token);
      setIsAuthorized(true);
      setUsername('');
      setApiKey('');
    } catch {
      setError('Unable to verify those credentials. Check them and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    sessionStorage.removeItem(adminTokenStorageKey);
    setIsAuthorized(false);
  }

  if (isCheckingAccess) {
    return (
      <section className="admin-panel">
        <p>Checking access...</p>
      </section>
    );
  }

  if (isAuthorized) {
    return (
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h2>Welcome back</h2>
            <p>You are verified and can manage Pixelmon project data from here.</p>
          </div>
          <button className="secondary-button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
        <div className="admin-placeholder">
          <h3>Admin tools</h3>
          <p>Management tools will appear here as they are added.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-auth">
      <div className="admin-auth-copy">
        <p className="eyebrow">Restricted area</p>
        <h2>Admin access</h2>
        <p>Verify your staff credentials to continue to the Pixelmon management tools.</p>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="admin-api-key">API key</label>
        <input
          id="admin-api-key"
          name="apiKey"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          required
        />
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify access'}
        </button>
      </form>
    </section>
  );
}

export default Admin;
