import React, { CSSProperties } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const containerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    ...style,
  };

  return <div style={containerStyle}>{children}</div>;
};
