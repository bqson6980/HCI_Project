import React, { CSSProperties } from 'react';
import { Floor } from '../../types';

interface FloorCardProps {
  floor: Floor;
  onClick: (floorId: string) => void;
}

export const FloorCard: React.FC<FloorCardProps> = ({ floor, onClick }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'AVAILABLE':
        return '#34C759';
      case 'NEARLY_FULL':
        return '#FF9500';
      case 'FULL':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'AVAILABLE':
        return 'CÒN TRỐNG';
      case 'NEARLY_FULL':
        return 'GẦN ĐẦY';
      case 'FULL':
        return 'ĐẦY';
      default:
        return status;
    }
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    gap: '16px',
    alignItems: 'center',
  };

  const floorNameStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
  };

  const progressBarStyle: CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const progressFillStyle: CSSProperties = {
    width: `${floor.occupancyPercent}%`,
    height: '100%',
    backgroundColor: getStatusColor(floor.status),
    transition: 'width 0.3s ease',
  };

  const infoStyle: CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  };

  const statusStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  };

  const statusBadgeStyle: CSSProperties = {
    backgroundColor: getStatusColor(floor.status),
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  };

  const availableSlotStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: getStatusColor(floor.status),
  };

  return (
    <div style={cardStyle} onClick={() => onClick(floor.id)}>
      <div>
        <div style={floorNameStyle}>{floor.id}</div>
        <div style={infoStyle}>{floor.name}</div>
      </div>

      <div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <div style={infoStyle}>
          {floor.occupied} / {floor.capacity} chỗ
        </div>
      </div>

      <div style={statusStyle}>
        <div style={statusBadgeStyle}>{getStatusLabel(floor.status)}</div>
        <div style={availableSlotStyle}>{floor.available} trống</div>
      </div>
    </div>
  );
};
