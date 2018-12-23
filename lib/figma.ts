import axios from 'axios'

const PERSONAL_ACCESS_TOKEN = '3429-bf1d6755-7de1-446b-aace-4d1b00d1a775'
const FILE_KEY = 'EuXW2OoSnNpWqU9ULu1sOYhN'

function fetchFigma( endpoint: string ){
  const options = {
    method: 'GET',
    headers: { "x-figma-token": PERSONAL_ACCESS_TOKEN },
    url: `https://api.figma.com/v1/${endpoint}`,
  }

  return axios(options)
    .then( response => {
      return response.data
    })
    .catch( error => ({ err: error }))
}

export async function fetchFile(fileKey: string ){
  const file = await fetchFigma( `files/${fileKey}` )
  if( !file || !file.document ) throw( 'File not found')
  return file.document
}

export function getFigmaCanvas(file, canvasName: string ){
  const canvas = file.children.filter( el => el.type == 'CANVAS' && el.name == canvasName)[0]
  return canvas
}

export function getFrameFromCanvas(canvas, frameName: string ){
  const frame = canvas.children.filter( el => el.type == 'FRAME' && el.name == frameName)[0]
  return frame
}

export async function fetchImages( imageIds ){
  const parsedImageIds = imageIds.join(',')
  const result = await fetchFigma( `images/${FILE_KEY}?ids=${parsedImageIds}` )
  return result.images
}

export async function fetchFileImages( fileKey ){
  const result = await fetchFigma( `files/${fileKey}/images` )
  if( result.error ) throw( 'File not found')
  if( !result.meta || !result.meta.images ) throw( 'No Images found')
  return result.meta.images
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
