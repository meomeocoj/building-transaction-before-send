"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const erc20_json_1 = __importDefault(require("./abi/erc20.json"));
const ifaceErc20 = new utils_1.Interface(erc20_json_1.default);
const amountTransfer = ethers_1.ethers.utils.parseEther("20");
const data = ifaceErc20.encodeFunctionData("transfer", [
    "0xA75b901F1Ae13520810b17F08c1764C5949AC207",
    amountTransfer,
]);
const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const signer = new ethers_1.ethers.Wallet("your-secret-key", provider);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const nonce = yield signer.getTransactionCount();
    const contract = new ethers_1.ethers.Contract("0x3b979adf6Cd72Ae8ED420E7a9ba74865a7F64B82", erc20_json_1.default, signer);
    const estimateGas = yield contract.estimateGas.transfer("0xA75b901F1Ae13520810b17F08c1764C5949AC207", amountTransfer);
    const tx_data = {
        nonce,
        to: "0x3b979adf6Cd72Ae8ED420E7a9ba74865a7F64B82",
        value: "0x0",
        gasPrice: yield signer.getGasPrice(),
        gasLimit: estimateGas,
        data,
        chainId: yield signer.getChainId(),
    };
    let tx_dataConfirm = signer.checkTransaction(tx_data);
    console.log(tx_dataConfirm);
    let rawTransaction = yield signer.signTransaction(tx_data);
    console.log("===rawTrasnction: " + rawTransaction);
    let tx_hash = ethers_1.ethers.utils.keccak256(rawTransaction);
    console.log("===tx_hash: " + tx_hash);
    let tx_recepit = yield signer.sendTransaction(tx_dataConfirm);
    console.log(tx_recepit);
});
main();
