import { ReactNode } from 'react'
import reactStringReplace from 'react-string-replace'

export const handleCode = (str: ReactNode[]): ReactNode[] => {
  const rxCodeBlocksRef = /^`([^`\n]+)`$/gm
  return reactStringReplace(str, rxCodeBlocksRef, (match, i) => (
    <div
      key={i}
      style={{
        fontSize: '90%',
        padding: '0.5rem',
        fontFamily: 'monospace',
        backgroundColor: '#eee',
      }}
    >
      {match.replaceAll('\n', '')}
    </div>
  ))
}
