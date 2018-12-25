import axios from 'axios'
import { FigmaFile, CanvasObject, GroupObject, FrameObject, Elements, TextObject } from '../types'


type FigmaClientOptions = {
  accessToken: string,
  fileKey: string,
}

export async function fetchFigma(options: FigmaClientOptions): Promise<Figma> {
  const client = new FigmaClient(options)
  const file = await client.fetchFile(options.fileKey)
  const figma = new Figma(file)
  return figma
}

class FigmaClient {
  accessToken: string = ''
  fileKey: string = ''

  constructor({ accessToken, fileKey }: FigmaClientOptions ){
    this.accessToken = accessToken
    this.fileKey = fileKey
    this.fetchFile(fileKey)
  }

  async fetchFile(fileKey: string): Promise<FigmaFile> {
    const file = await this.fetch(`files/${fileKey}`)
    if (!file || !file.document) throw ('File not found')
    return file
  }

  async fetchImages(imageIds: string[]): Promise<string[]> {
    const parsedImageIds = imageIds.join(',')
    const result: any = await fetch(`images/${this.fileKey}?ids=${parsedImageIds}`)  // TODO improve rsult Type
    return result.images
  }

  async fetchFileImages(fileKey) {
    try {
      const result: any = await fetch(`files/${fileKey}/images`) // TODO improve rsult Type
      return result.meta.images
    } catch (e) { throw ('No Images found') }
  }

  fetch(endpoint: string) {
    const options = {
      method: 'GET',
      url: `https://api.figma.com/v1/${endpoint}`,
      headers: { "x-figma-token": this.accessToken },
    }

    return axios(options)
      .then(response => {
        return response.data
      })
      .catch( error => ({ err: error }))
  }

}

export class Figma {
  file: FigmaFile

  constructor(file: FigmaFile) {
    this.file = file
    return this
  }

  getCanvas(canvasName: string): Canvas {
    const canvas = this.file.document.children.find(el => el.type == 'CANVAS' && el.name == canvasName)
    if (canvas == null || canvas == undefined) throw ('Canvas was not found')
    return new Canvas(canvas)
  }

}

export class Canvas {
  canvas: CanvasObject
  constructor(canvas: CanvasObject)  {
    this.canvas = canvas
    return this
  }

  getFrame(frameName: string): Frame {
    const frame = this.canvas.children.find(el => el.type == 'FRAME' && el.name == frameName)
    if (frame == null || frame == undefined) throw ('Frame was not found')
    return new Frame(frame as FrameObject)
  }

}

export class Frame {
  frame: FrameObject
  constructor(frame: FrameObject) {
    this.frame = frame
    return this
  }

  getElement(elementName: string) {
    const element = this.frame.children.find(el => el.name == elementName)
    if (element == null || element == undefined) throw ('Element was not found')

    switch (element.type) {
      default:
      case 'TEXT': return new Text(element as TextObject)
    }
  }

  /**
   * Returns an array of objects based on the schema provided.
   * Only works with figma container elements (Frame, Group and Canvas)
   * @param schema array of any kind of object
   */
  getSeries(schema: any[]) {
    return getSeries(this.frame, schema)
  }
}

export class Text {
  element: TextObject

  constructor(TextObject: TextObject) {
    this.element = TextObject
    return this
  }

  /** Return the plain text chracters of a figma text element  */
  getCharacters() {
    return convertTextObjectToMarkdown(this.element)
  }
}

export function parseValueProps( website ){
  const valuePropsRoot = website.children.find(i => i.name == 'ValueProps')
  const valuePropsSorted = valuePropsRoot.children.sort(sortedByName)
  const valuePropsText = valuePropsSorted.map(i => ({
    title: i.children.find( i => i.name == 'title' ).characters,
    text: i.children.find( i => i.name == 'text' ).characters,
  }))
  return valuePropsText
}


/**
 * Returns an array of objects based on the schema provided.
 * Only works with figma container elements (Frame, Group and Canvas)
 */

export function getSeries( container: FrameObject | GroupObject | CanvasObject, schema: any[] ) { // TODO use generics
  const series = container.children.sort(sortByPositionY).map( child => {
    const obj = {}
    schema.forEach( itemName => {
      if ( child.type == 'TEXT' ) return  // TODO don't know why typescript doens't allow me to do eg: !(child.type == 'FRAME')
      const item = child.children.find(el => el.name == itemName )
      if (item == null || item == undefined) {
        return console.info( `${itemName} doesn't exist in this container`)
      }
      switch (item.type) {
        case 'TEXT': obj[itemName] = new Text(item).getCharacters()
        default: return
      }
      
    })
    return obj
  })

  return series
}


const sortedByName = (a, b ) => a.name > b.name


export function convertTextObjectToMarkdown(el: TextObject) {
  // Figma styling is some kind of black magic I don't understand...
  // TODO expand styling to any style instead of only bolding
  const defaultStyleIsBold = el.style.fontWeight > 400

  const boldStyleKeys = Object.entries(el.styleOverrideTable)
    .filter((i: any) => i[1].fontWeight > 400)
    .map(i => parseInt(i[0]))
  if (defaultStyleIsBold) boldStyleKeys.push(0)

  let chars = el.characters

  const isChardBold = (charKey: number) => {
    if (charKey < 0 || charKey === undefined) return false
    const char = chars[charKey]
    if (char === '\n') return false
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


const sortByPosition = ( A, B, axis ='y' ) => { // TODO add typings 
  const a = A.absoluteBoundingBox
  const b = B.absoluteBoundingBox
  return a[axis] - b[axis]
}

const sortByPositionX = (a, b) => sortByPosition(a, b, 'x')
const sortByPositionY = ( a, b) => sortByPosition( a, b, 'y')

// TODO sortByPositionXY = (a, b) => sortByPosition( a, b)