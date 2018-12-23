"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertTextElementToMarkdown(el) {
    // TODO expand styling to any style instead of only bolding
    var defaultStyleIsBold = el.style.fontWeight > 400;
    var boldStyleKeys = Object.entries(el.styleOverrideTable)
        .filter(function (i) { return i[1].fontWeight > 400; })
        .map(function (i) { return parseInt(i[0]); });
    if (defaultStyleIsBold)
        boldStyleKeys.push(0);
    var chars = el.characters;
    var isChardBold = function (charKey) {
        if (charKey < 0 || charKey === undefined)
            return false;
        var char = chars[charKey];
        if (char === '\n')
            return false;
        var charStyleKey = el.characterStyleOverrides[charKey];
        return boldStyleKeys.includes(charStyleKey);
    };
    var mdStr = '';
    for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        var isBold = isChardBold(i);
        var isPrevCharBold = isChardBold(i - 1);
        var isNewLine = chars[i] === '\n';
        if (isNewLine && isPrevCharBold)
            mdStr += "**" + c;
        else if (isBold && !isPrevCharBold)
            mdStr += "**" + c;
        else if (!isBold && isPrevCharBold)
            mdStr += "**" + c;
        else if (isBold && i === chars.length - 1)
            mdStr += c + "**";
        else
            mdStr += c;
    }
    return mdStr;
}
exports.convertTextElementToMarkdown = convertTextElementToMarkdown;
