import { fetchFigma } from './figma'

const PERSONAL_ACCESS_TOKEN = '6212-9d008494-aadb-4fd7-9e9a-d339804593a9'
const FILE_KEY = 'MloTx0twgY5zFtIP9YIqxu3f'

const clientOptions = {
  accessToken: PERSONAL_ACCESS_TOKEN,
  fileKey: FILE_KEY,
}


async function test() {
  const figma = await fetchFigma(clientOptions)
  const myCanvas = figma.getCanvas('MyCanvas')
  const myFrame = myCanvas.getFrame('MyFrame')
  const myTextObject = myFrame.getElement('myText')
  console.log(`myElement`, myTextObject.getCharacters())

}

test()