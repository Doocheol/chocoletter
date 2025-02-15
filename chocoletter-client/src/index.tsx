import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/index.css";
import App from "./App";
import React from "react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://3fe8dbf30ca02fee2550f638bbb1d4af@o4508822353215488.ingest.us.sentry.io/4508822360621056",
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
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
