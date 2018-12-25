import { fetchFigma } from '../dist'
import { getSeries } from '../lib/figma'

const PERSONAL_ACCESS_TOKEN = '6212-9d008494-aadb-4fd7-9e9a-d339804593a9'
const FILE_KEY = 'Mt78ryN0usWO1SKTSxkf5AIm'

const clientOptions = {
  accessToken: PERSONAL_ACCESS_TOKEN,
  fileKey: FILE_KEY,
}

async function test() {
  try {
    console.log(`Loading...`)
    const figma = await fetchFigma(clientOptions)
    console.log(`loaded`)

    const myCanvas = figma.getCanvas('Pages')
    const myFrame = myCanvas.getFrame('Services')

    const series = myFrame.getSeries(['title', 'description', 'includes'])
    console.log(`series`, series.map( s => console.log(`s`, s)))
    
  } catch (e) { console.error(e) }
}

test()