import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initTelemetry } from './lib/telemetry';

// Initialize observability tools like Sentry and OpenTelemetry.
initTelemetry();

createRoot(document.getElementById('root')!).render(<App />);
