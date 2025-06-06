// client/src/pages/Error.tsx

import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import '../styles/Error.css'; // Assuming you have a CSS file for styles

export default function ErrorPage() {
  // Treat useRouteError() result as unknown so we can narrow it
  const error: unknown = useRouteError();

  console.error(error);

  // 1) If it’s a RouteErrorResponse, it has .status and .statusText
  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <pre style={{ background: '#fdd', padding: '1rem' }}>
          {error.status} {error.statusText}
        </pre>
        <p>
          Go back to <Link to="/">Home</Link>.
        </p>
      </div>
    );
  }

  // 2) Otherwise, if it’s a normal Error, extract message; else stringify
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <pre style={{ background: '#fdd', padding: '1rem' }}>{message}</pre>
      <p>
        Go back to <Link to="/">Home</Link>.
      </p>
    </div>
  );
}
