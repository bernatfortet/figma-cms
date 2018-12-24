import axios from 'axios'
import { FigmaFile, CanvasObject, FrameObject, Elements, TextObject } from './types'


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

class Figma {
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
  }

  getElement(elementName: string) {
    const element = this.frame.children.find(el => el.name == elementName)
    if (element == null || element == undefined) throw ('Element was not found')

    switch (element.type) {
      default:
      case 'TEXT': return new Text(element as TextObject)
    }
    
  }
}

export class Text {
  element: TextObject

  constructor(TextObject: TextObject) {
    this.element = TextObject
  }

  getCharacters() {
    return this.element.characters
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


export function parseBannerTitle( website ){
  const banner = website.children.find(i => i.name == 'Banner')
  return banner.children.find( i => i.name == 'title' ).characters
}


const sortedByName = (a, b ) => a.name > b.name



  // async function fetchImages(imageIds) {
  //   const parsedImageIds = imageIds.join(',')
  //   const result = await fetchFigma(`images/${FILE_KEY}?ids=${parsedImageIds}`)
  //   return result.images
  // }

  // async function fetchFileImages(fileKey) {
  //   const result = await fetchFigma(`files/${fileKey}/images`)
  //   if (result.error) throw ('File not found')
  //   if (!result.meta || !result.meta.images) throw ('No Images found')
  //   return result.meta.images
  // }