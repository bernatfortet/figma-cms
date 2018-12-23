// import * as fs from 'fs-extra'
// import * as request from 'request-promise'
// import * as sharp from 'sharp'

// import * as figma from './figma'
// import { FILE_KEY } from './figma_db'

// const OUTPUT_PATH = '../public/images/'

// const init = async () => {
//   let images = await figma.fetchFileImages(FILE_KEY)
//   await downloadImages(images)
// }

// export const downloadImages = async ( images ) => {
//   checkImagesFolderAndCreate()

//   images = await getMissingImages(images)
//   console.log(`${Object.keys(images).length} Images are missing`)
//   const imagePromises = []
//   for( const id in images){
//     const url = images[id]
//     imagePromises.push( getImageObjectFromUrl(url, id) )
//   }

//   return Promise.all(imagePromises)
// }

// async function getMissingImages(images: any){
//   console.log(`🔲  Checking for missing images`)

//   let missingImages = {}
//   for( const id in images){
//     const url = images[id]
//     const exists = fs.pathExistsSync(`${OUTPUT_PATH}${id}.jpg`)
//     if( !exists ){
//       console.error(`Image for ${id} is missing: `)
//       missingImages[id] = url
//     }
//   }

//   return missingImages
// }

// function getImageObjectFromUrl( url: string, fileName: string ){
//   const COVER_AR = 2.5
//   return request.get({ url: url, encoding: null })
//     .then( async (res) => {
//       console.log(`Getting Image ${fileName}`)
//       const Sharp =  await sharp(res)
//       const { width, height } = await Sharp.metadata()
//       if( fileName == 'b51210344b8062c84cace263fd80ae027cbcf05f'){
//         console.log(`width`, width)
//         console.log(`height`, height)
//       }
//       const aspectRatio = width/height
//       const size = aspectRatio >= COVER_AR ? [1500, 300] : [600]
//       Sharp.resize(size[0], size[1]).jpeg({ quality: 90}).toFile(`../public/images/${fileName}.jpg`)
//     })
//     .catch( error => null )
// }

// init()

// function checkImagesFolderAndCreate(){
//   if(!fs.existsSync(OUTPUT_PATH))
//     fs.mkdirSync(OUTPUT_PATH)
// }