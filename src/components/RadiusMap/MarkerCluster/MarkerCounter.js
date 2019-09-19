import React, { memo } from 'react'

const styles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  padding: 8,
  marginLeft: -10,
  textAlign: 'center',
  fontSize: 14,
  color: '#fff',
  border: '2px solid #fff',
  borderRadius: '50%',
  backgroundColor: '#333'
}
const MarkerCounter = ({ children }) => <div style={styles}>{children}</div>

export default memo(MarkerCounter)
