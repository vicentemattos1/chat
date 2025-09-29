export const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Fortaleza',
    hour: '2-digit',
    minute: '2-digit',
  })
}
