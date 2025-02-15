// src/components/common/ErrorBoundary.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => {
        // Sentry에 자동 리포팅되고, 에러 발생 시 /error 페이지로 리다이렉트합니다.
        return <Navigate to="/error" replace />;
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
