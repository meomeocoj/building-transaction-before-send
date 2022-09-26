import { ethers } from "ethers"
import { Interface } from "ethers/lib/utils"
import erc20Abi from "./abi/erc20.json"

const ifaceErc20 = new Interface(erc20Abi)

const amountTransfer = ethers.utils.parseEther("20")

const data = ifaceErc20.encodeFunctionData("transfer", [
  "0xA75b901F1Ae13520810b17F08c1764C5949AC207",
  amountTransfer,
])

const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
)

// Trên client sẽ thay thê = metamask get account

const signer = new ethers.Wallet(
  "715627cfadbba8a8c837443f2125a1a5e60bb4bbf62a189e1b4603065268893b",
  provider
)

const main = async () => {
  const nonce = await signer.getTransactionCount()
  // Test contract ERC20
  const contract = new ethers.Contract(
    "0x3b979adf6Cd72Ae8ED420E7a9ba74865a7F64B82",
    erc20Abi,
    signer
  )
  //   Tính toán gas Trước
  const estimateGas = await contract.estimateGas.transfer(
    "0xA75b901F1Ae13520810b17F08c1764C5949AC207",
    amountTransfer
  )
  //   Data để kí trước phải đủ tất cả các trường

  const tx_data: ethers.providers.TransactionRequest = {
    nonce,
    to: "0x3b979adf6Cd72Ae8ED420E7a9ba74865a7F64B82",
    value: "0x0",
    gasPrice: await signer.getGasPrice(),
    gasLimit: estimateGas,
    data,
    chainId: await signer.getChainId(),
  }
  //   Confirm các trường trước khi gửi bước
  let tx_dataConfirm = signer.checkTransaction(tx_data)
  //   Confirm log các trường
  console.log(tx_dataConfirm)
  //   kí data
  let rawTransaction = await signer.signTransaction(tx_data)
  console.log("===rawTrasnction: " + rawTransaction)
  //   Hash lại transaction
  let tx_hash = ethers.utils.keccak256(rawTransaction)
  console.log("===tx_hash: " + tx_hash)
  let tx_recepit = await contract.transfer(
    "0xA75b901F1Ae13520810b17F08c1764C5949AC207",
    amountTransfer
  )
  console.log(tx_recepit)
}
main()
