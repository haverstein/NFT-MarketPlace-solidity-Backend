const { ethers, network } = require("hardhat")
const fs = require("fs")

const frontEndContractsFile =
    "../nextjs-nft-marketplace-moralis-frontend/constants/networkMapping.json"
module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("updating frontend...")
        await updateContractAddresses()
    }
}

async function updateContractAddresses() {
    const nftMarketPlace = await ethers.getContract("NFTMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf-8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NFTMarketplace"].includes(nftMarketPlace.address)) {
            contractAddresses[chainId]["NFTMarketplace"].push(nftMarketPlace.address)
        }
    } else {
        contractAddresses[chainId] = { NFTMarketplace: [nftMarketPlace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
