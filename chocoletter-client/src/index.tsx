import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/index.css";
import App from "./App";
import React from "react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN_KEY,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  debug: false,

  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <div className="mx-auto w-full md:max-w-sm lg:min-h-screen">
        <App />
      </div>
    </RecoilRoot>
  </React.StrictMode>
);
