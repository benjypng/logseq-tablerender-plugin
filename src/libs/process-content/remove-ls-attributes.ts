export const removeLsAttributes = (str: string) => {
  // Note: Logbook is always at the end of the block content
  // \n:LOGBOOK:\nCLOCK: [2024-09-01 Sun 17:09:11]--[2024-09-01 Sun 17:09:16] =>  00:00:05\n:END:

  let content = str
  content = content.replace(/collapsed::\s*(true|false)/, '')
  if (content.indexOf('\nid:: ') !== -1) {
    content = content.substring(0, content.indexOf('\nid:: '))
  }
  if (content.indexOf('\n:LOGBOOK:') !== -1) {
    content = content.substring(0, content.indexOf('\n:LOGBOOK:'))
  }

  const markersMap: Record<string, string> = {
    NOW: '⏰',
    LATER: '🕒',
    DOING: '🏗️',
    DONE: '✅',
    CANCELLED: '❌',
    CANCELED: '❌',
    'IN-PROGRESS': '🚧',
    TODO: '📝',
    WAITING: '⏳',
    WAIT: '⏳',
  }

  Object.keys(markersMap).forEach((m) => {
    if (!markersMap[m]) return
    content = content.replace(m, markersMap[m])
  })

  return content
}
