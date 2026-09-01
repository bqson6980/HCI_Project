import React, { CSSProperties } from 'react';

interface SpinnerProps {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 40 }) => {
  const spinnerStyle: CSSProperties = {
    width: size,
    height: size,
    border: `4px solid #f0f0f0`,
    borderTop: `4px solid #007AFF`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle}></div>
    </div>
  );
};
