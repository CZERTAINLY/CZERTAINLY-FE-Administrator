import React from 'react';

const ErrorBoundaryThrowError: React.FC = () => {
    throw new Error('Test error');
};

export default ErrorBoundaryThrowError;
