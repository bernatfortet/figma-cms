import { createClient } from '../lib/figma'

const PERSONAL_ACCESS_TOKEN = '6212-9d008494-aadb-4fd7-9e9a-d339804593a9'
const FILE_KEY = 'MloTx0twgY5zFtIP9YIqxu3f'

describe('Basic test', () => {

  it('should be true', () => {
    const clientOptions = {
      accessToken: PERSONAL_ACCESS_TOKEN,
      fileKey: FILE_KEY,
    }

    expect(createClient(clientOptions)).to.be(true)
  })

})