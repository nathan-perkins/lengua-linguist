export function validateLink(searchQuery: string): { isValid: boolean, isEmbed: boolean } {
  const urlRegExp: RegExp = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|live\/|v\/)?)([\w-]+)(\S+)?$/

  const isValid: boolean = urlRegExp.test(searchQuery)
  const isEmbed: boolean = searchQuery.includes('embed')

  return {
    isValid: isValid,
    isEmbed: isEmbed
  }
} 
