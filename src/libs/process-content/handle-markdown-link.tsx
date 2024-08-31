import { ReactNode } from 'react'
import reactStringReplace from 'react-string-replace'

export const handleMarkdownLink = (str: ReactNode[]): ReactNode[] => {
  const rxLinkRef = /(https:\/\/[\w.-]+(?:\/[\w.-]*)*)/g

  const x = reactStringReplace(str, rxLinkRef, (match, i) => (
    <a key={i} href={match} className="external-link" target="_blank">
      {match}
    </a>
  ))

  console.log(x)

  return x
}
