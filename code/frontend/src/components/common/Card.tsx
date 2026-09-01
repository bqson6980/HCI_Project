import React, { CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onClick }) => {
  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ...style
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {children}
    </div>
  );
};
