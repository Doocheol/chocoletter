import React, { Component, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		new Error(error.message);
	}

	render() {
		if (this.state.hasError) {
			return <Navigate to="/error" replace />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
