import React, { CSSProperties } from 'react';

interface HeaderProps {
  onBack?: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onBack, title }) => {
  const headerStyle: CSSProperties = {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    flex: 1,
    margin: 0,
  };

  const backButtonStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  };

  return (
    <div style={headerStyle}>
      {onBack && (
        <button
          style={backButtonStyle}
          onClick={onBack}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
        >
          ←
        </button>
      )}
      <h1 style={titleStyle}>{title}</h1>
    </div>
  );
};
