export function convertTextElementToMarkdown(el: any) {
  // TODO expand styling to any style instead of only bolding
  const defaultStyleIsBold = el.style.fontWeight > 400
  
  const boldStyleKeys = Object.entries(el.styleOverrideTable)
    .filter((i: any) => i[1].fontWeight > 400)
    .map(i => parseInt(i[0]))
  if(defaultStyleIsBold) boldStyleKeys.push(0)

  let chars = el.characters

  const isChardBold = (charKey: number) => {
    if (charKey < 0 || charKey === undefined) return false
    const char = chars[charKey]
    if( char === '\n') return false
    const charStyleKey = el.characterStyleOverrides[charKey]
    return boldStyleKeys.includes(charStyleKey)
  }

  let mdStr = ''
  
  for (var i = 0; i < chars.length; i++) {
    const c = chars[i]
    const isBold = isChardBold(i)
    const isPrevCharBold = isChardBold(i - 1)
    const isNewLine = chars[i] === '\n'
    
    if (isNewLine && isPrevCharBold) mdStr += "**" + c
    else if (isBold && !isPrevCharBold) mdStr += "**" + c
    else if (!isBold && isPrevCharBold) mdStr += "**" + c
    else if (isBold && i === chars.length - 1) mdStr += c + "**"
    else mdStr += c
  }

  return mdStr
}
