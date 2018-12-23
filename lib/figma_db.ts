// import { downloadImages } from './downloadImages'
import * as figma from './figma'
import { convertTextElementToMarkdown } from './figmaToMarkdown'

const REFETCH_IMAGES = false

export const FILE_KEY = 'EuXW2OoSnNpWqU9ULu1sOYhN'

let images = {}
let file = {}

export const getWebsiteData = async() => {
  images = await figma.fetchFileImages(FILE_KEY)
  file = await figma.fetchFile(FILE_KEY)
  // REFETCH_IMAGES ? await downloadImages(images) : null

  return {
    biography: getBio(),
    projects: getProjects(),
  }
}

function getBio(){
  const pagesCanvas = figma.getFigmaCanvas(file, 'pages')
  const frameBio = figma.getFrameFromCanvas(pagesCanvas, 'bio')
  const biographyData = parseElements(frameBio.children)
  return {
    ...biographyData,
  }
}

function getProjects(){
  const projectsCanvas = figma.getFigmaCanvas(file, 'projects')
  const frames = projectsCanvas.children.filter( i => i.type == 'FRAME' )

  const projectsData = frames.sort(sortByPositionX).map( frame => {
    return {
      slug: frame.name,
      ...parseElements(frame.children)
    }
  })

  return projectsData
}

const parseElements = ( elements ) => {

  const headerElementsNames = ['title', 'subtitle1', 'subtitle2', 'subtitle3']
  const headerImageNames = ['cover', 'thumbnail']
  const metaNames = headerElementsNames.concat(headerImageNames)

  const metaElements = elements.filter( el => metaNames.includes(el.name))
  const meta = {}
  
  metaElements.map( el => {
    if( headerElementsNames.includes(el.name))
      return meta[el.name] = el.characters
    
    if( isImage(el) && headerImageNames.includes(el.name) )
      return meta[el.name] = getImageObject(el)
  })
  
  const body: any = []
  const bodyElements = elements.filter( el => !headerElementsNames.concat(headerImageNames).includes(el.name))
  bodyElements.sort(sortByPosition).map( el => {
      
    if( el.type == 'TEXT')
      return body.push( { type: 'text', text: convertTextElementToMarkdown(el) })
      
    if( isVideo(el) )
      return body.push(getVideoObject(el))
      
    if( isImageGroup(el))
      return body.push( { type: 'imageGroup', content: el.children.sort(sortByPosition).map( iEl => getImageObject(iEl) ) })

    if( isVideoGroup(el))
      return body.push( { type: 'videoGroup', content: el.children.sort(sortByPosition).map( iEl => getVideoObject(iEl) ) })

    if( isImage(el))
      return body.push( getImageObject(el) )
      

  })

  const data = { meta, body}

  return data

}

const getImageUrl = ( el ) => images[getImageRef(el)]
const getImageRef = ( el ) => el.fills[0].imageRef
const getImageCaption = ( el ) => el.name.indexOf('image') == -1 ? el.name : undefined

const getVideoObject = ( el ) => {
  const idEl = el.children.find( el => el.type == 'TEXT' && el.name == 'id' )
  const sourceEl = el.children.find( el => el.type == 'TEXT' && el.name == 'source' )
  if( idEl && idEl.characters && sourceEl && sourceEl.characters  )
    return { type: 'video', source: sourceEl.characters, id: idEl.characters }
}

const getImageObject = ( el ) => ({
  type: 'image',
  id: el.fills[0].imageRef,
  caption: getImageCaption(el),
  url: getImageUrl(el),
})


const isVideo = ( el ) => el.type == 'INSTANCE' && el.name == 'video'
const isImage = ( el ) => el.type == 'RECTANGLE' && el.fills[0].type == 'IMAGE'
const isImageGroup = ( el ) => el.type == 'GROUP' && isImage(el.children[0])
const isVideoGroup = ( el ) => el.type == 'GROUP' && isVideo(el.children[0])
const sortByPosition = ( A, B, axis ='y' ) => {
  const a = A.absoluteBoundingBox
  const b = B.absoluteBoundingBox
  return a[axis] - b[axis]
}

const sortByPositionX = ( a, b) => sortByPosition( a, b, 'x')