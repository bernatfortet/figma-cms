import axios from 'axios'

type FigmaClientOptions = {
  accessToken: string,
  fileKey: string,
}

export function createClient(options: FigmaClientOptions) {
  return new FigmaClient(options)
}

class FigmaClient {
  accessToken: string = ''
  fileKey: string = ''

  file: any // TODO

  constructor({ accessToken, fileKey }: FigmaClientOptions ){
    this.accessToken = accessToken
    this.fileKey = fileKey
    this.file = this.fetchFile(fileKey)
  }

  async fetchFile(fileKey: string) {
    const file = await this.fetch(`files/${fileKey}`)
    if (!file || !file.document) throw ('File not found')
    return file.document
  }

  getFigmaCanvas(file, canvasName: string) {
    const canvas = file.children.filter(el => el.type == 'CANVAS' && el.name == canvasName)[0]
    return canvas
  }

  getFrameFromCanvas(canvas, frameName: string) {
    const frame = canvas.children.filter(el => el.type == 'FRAME' && el.name == frameName)[0]
    return frame
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
