import { CSSProperties } from 'react';

export const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#333',
  } as CSSProperties,
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  } as CSSProperties,
  divider: {
    height: '1px',
    backgroundColor: '#eee',
    margin: '24px 0',
  } as CSSProperties,
  infoBox: {
    backgroundColor: '#f8f8f8',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
  } as CSSProperties,
  errorBox: {
    backgroundColor: '#FFE6E6',
    color: '#C41C3B',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
  } as CSSProperties,
  successBox: {
    backgroundColor: '#E6F7E6',
    color: '#15703D',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
  } as CSSProperties,
};
