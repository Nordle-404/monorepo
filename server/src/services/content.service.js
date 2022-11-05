import { utils } from 'ethers'
// import * as fs from 'fs'
import httpStatus from 'http-status'
import { Web3Storage } from 'web3.storage'

import { ApiError } from '../utils'
import { openai } from '../constants'

// const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
// const DeployedContractAbi = loadJSON('../constants/DeployedContract.json')

// const overrides = {
//   gasLimit: 5_000_000,
// }

const abiCoder = new utils.AbiCoder()

export async function draw(options) {
  try {
    const { phrase, owner, burnIds } = options

    // const response = await openai.createImage({
    //   prompt: phrase.split('_').join(' '), // happy_unicorn => happy unicorn
    //   n: 1,
    //   size: '512x512',
    // })
    // const imageUrl = response.data.data[0].url
    // const imageUrl = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-j7QXf8rISyjEHz1qT8BcRXBI/user-cPKQfE1yYROUxPeytMJ0wWfB/img-Ctl95G6mTo6JLV2Tsimhnr6p.png?st=2022-11-05T04%3A27%3A00Z&se=2022-11-05T06%3A27%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-11-05T01%3A11%3A23Z&ske=2022-11-06T01%3A11%3A23Z&sks=b&skv=2021-08-06&sig=iUrwm8bp0W6v22CIJtN2p0ryU4xesU%2BeQ5EXs/K21aM%3D'
    const imageUrl = 'https://ipfs.io/ipfs/bafybeicizq4zwelyxkwq2rwsavhppxyrczodmyolgyqks5kgmbgekw5x5a/55181940.jpg'
    const imageUrlLength = utils.toUtf8Bytes(imageUrl).length
    console.log(imageUrlLength, imageUrl)

    // Return byte-converted data of:
    // 1) byte length of Image URL (uint256)
    // 2) actual Image URL (converted to bytes)
    // 3a) bytes of burn token IDs (each ID is uint256 or 32 bytes)
    // 3b) Or prhase

    // NOTE: MUST USE `utils.solidityPack` in ethers.js to mimic `abi.encode()` in Solidity
    let bytesData = ''
    if (burnIds) {
      bytesData = utils.solidityPack(
        ['uint256', 'string', 'bytes'],
        [imageUrlLength, imageUrl, burnIds],
      )
    } else {
      bytesData = utils.solidityPack(
        ['uint256', 'string', 'bytes32', 'string'],
        [imageUrlLength, imageUrl, owner, phrase],
      )
    }
    // 0x00000000000000000000000000000000000000000000000000000000000001da68747470733a2f2f6f616964616c6c6561706970726f64736375732e626c6f622e636f72652e77696e646f77732e6e65742f707269766174652f6f72672d6a3751586638724953796a45487a317154384263525842492f757365722d63504b516645317959524f5578506579744d4a30775766422f696d672d43746c393547366d546f364a4c56325473696d686e7236702e706e673f73743d323032322d31312d3035543034253341323725334130305a2673653d323032322d31312d3035543036253341323725334130305a2673703d722673763d323032312d30382d30362673723d6226727363643d696e6c696e6526727363743d696d6167652f706e6726736b6f69643d36616161646564652d346662332d343639382d613866362d36383464373738366230363726736b7469643d61343863636135362d653664612d343834652d613831342d39633834393635326263623326736b743d323032322d31312d3035543031253341313125334132335a26736b653d323032322d31312d3036543031253341313125334132335a26736b733d6226736b763d323032312d30382d3036267369673d695572776d38627030573676323243494a744e32703072795534786573552532426551354558732f4b3231614d253344756e69636f726e

    // console.log(phrase, imageUrl)
    // console.log(bytesData)

    return bytesData
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}
