const hre = require("hardhat");

const main = async () => {
    const Cards = await hre.ethers.getContractFactory("Cards");
    const cards = await Cards.deploy();

    await cards.deployed();

    console.log("Cards deployed to:", cards.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
