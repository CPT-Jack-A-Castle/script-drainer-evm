const { ethers } = require('ethers')

const rpc = "https://rpc.ankr.com/polygon_mumbai"
const provider = new ethers.JsonRpcProvider(rpc)

const walletPenerima = '0x..address'
const privateKeys = "0x..privatekey"
const _signer = new ethers.Wallet(privateKeys);
const signer = _signer.connect(provider);

provider.on('block', async () => {
    const fee = ethers.formatEther((await provider.getFeeData()).gasPrice.toString(), 'gwei')
    const gasLimit = 21000
    const balance = ethers.formatEther(await provider.getBalance(signer.address))
    const feeTotal = parseFloat(fee) * gasLimit
    const total = (parseFloat(balance) - feeTotal).toFixed(18)
    console.log(`Address: ${signer.address}\nBalance: ${balance}\n`)
    if (parseFloat(balance) >= feeTotal) {
        try {

            const transaction = await signer.sendTransaction(
                {
                    to: walletPenerima,
                    value: ethers.parseEther(total.toString()),
                    gasLimit,
                    gasPrice: ethers.parseUnits(fee, "ether")

                }
            )
            console.log(`\n SUCCES: ${transaction.hash} \n`)
        } catch (error) {
            console.log(error.message)
        }
    } else {
        console.log("Gas Fee tidak cukup!")
    }
})
