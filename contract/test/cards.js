const {expect} = require("chai");
const {ethers} = require("hardhat");

const BigNumber = ethers.BigNumber;
const parseEther = (number) => ethers.utils.parseEther(number.toString());

for(i = 0; i < 100; i++) {
    console.log(generateCardNumber());
}
describe(`Cards`, function () {
    let Cards;
    let cards;
    let owner, addr1, addr2, addr3, addr4, addr5, addrs;

    beforeEach(async function () {
        Cards = await ethers.getContractFactory(`Cards`);
        [owner, addr1, addr2, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();

        cards = await Cards.deploy();
        await cards.deployed();
    });

    it(`Contract has the right initial state`, async function () {
        expect(await cards.getCardsCount()).to.equal(0);
    });

    it(`Create simple card`, async function () {
        const number = `0xa0683df20755cba5be85323b3ff0d054c0aef90e97abfda4c50da23b65a299e2`;
        const createCardTx = await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Hello !`,
            {value: parseEther(0.5)}
        );

        // wait until the transaction is mined
        await createCardTx.wait();

        const card = await cards.getCard(number);
        expect(card.number).to.equal(number);
        expect(card.creator).to.equal(addr1.address);
        expect(card.beneficiary).to.equal(addr2.address);
        expect(card.amount).to.equal(parseEther(0.5));
        expect(card.message).to.equal(`Hello !`);
        expect(card.redeemedAt).to.equal(BigNumber.from(0));
        expect(card.cancelledAt).to.equal(BigNumber.from(0));
    });

    it(`Card creation should emit event`, async function () {
        const number = `0xd999440825617928f94880a8a096a16bcab18f6e228f95278f0d2144e585fada`;

        await expect(cards.connect(addr1).createCard(
            number,
            addr3.address,
            `Event test`,
            {value: parseEther(1.5)}
        )).to.emit(cards, `CreatedCard`).withArgs(number);
    });

    it(`Card creation should increase card count`, async function () {
        await cards.connect(addr1).createCard(
            `0xf5f39d91dabd5b6772abcd15dc840bca43e52592328ec732cd7448609cbcd241`,
            addr4.address,
            `First event`,
            {value: parseEther(0.004)}
        );

        await cards.connect(addr1).createCard(
            `0x6a1b5d0df604b9812e719e35ef3bac3a13470812fc3a4070c5fe792c95407244`,
            addr5.address,
            `Second event`,
            {value: parseEther(50.43)}
        );

        expect(await cards.getCardsCount()).to.equal(2);
    });

    it(`Card creation minimum amount`, async function () {
        await expect(cards.connect(addr1).createCard(
            `0x201dc15a91ad966bfc3a7dad43047ab4de01b5acb56c02cb24c8edb23a55579a`,
            addr3.address,
            `With zero ether`,
            {value: parseEther(0)}
        )).to.be.revertedWith(`InvalidAmount(${parseEther(0)})`);

        await expect(cards.connect(addr1).createCard(
            `0xeaafddd043526e80261802d019a280239553180b2238cce8929ec542ffb3440a`,
            addr3.address,
            `Not enough`,
            {value: parseEther(0.00001)}
        )).to.be.revertedWith(`InvalidAmount(${parseEther(0.00001)})`);

        await cards.connect(addr1).createCard(
            `0x01990298bdab3096dc9691af589dbc5af828889522de29b4ac717c08316e524f`,
            addr3.address,
            `Just enough ether`,
            {value: parseEther(0.0001)}
        );

        expect(await cards.getCardsCount()).to.equal(1);
    });

    it(`Create card with invalid address`, async function () {
        const card = `0x78307557f26142e25b44bbcd2f7962ab604d74023d0062537b8a315a7e93810d`;

        const nullAddress = `0x0000000000000000000000000000000000000000`;

        await expect(cards.connect(addr1).createCard(
            card,
            nullAddress,
            `Hello !`,
            {value: parseEther(0.5)}
        )).to.be.revertedWith(`InvalidBeneficiary("${nullAddress}")`);
    });
});
