const {expect} = require("chai");
const {ethers} = require("hardhat");

const BigNumber = ethers.BigNumber;
const parseEther = (number) => ethers.utils.parseEther(number.toString());
const generateCardNumber = () => `0x` + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

console.log(`Sample card numbers`);
for(let i = 0; i < 100; i++) {
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

        //check the contract received the right amount of ether
        const balance = await cards.provider.getBalance(cards.address);
        expect(balance).to.equal(parseEther(0.5));

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
        expect(await cards.getCardsCount()).to.equal(0);

        await cards.connect(addr1).createCard(
            `0xf5f39d91dabd5b6772abcd15dc840bca43e52592328ec732cd7448609cbcd241`,
            addr4.address,
            `First event`,
            {value: parseEther(0.004)}
        );

        expect(await cards.getCardsCount()).to.equal(1);

        await cards.connect(addr2).createCard(
            `0x6a1b5d0df604b9812e719e35ef3bac3a13470812fc3a4070c5fe792c95407244`,
            addr5.address,
            `Second event`,
            {value: parseEther(50.43)}
        );

        expect(await cards.getCardsCount()).to.equal(2);

        await cards.connect(addr5).createCard(
            `0xc7547cfd0f8229c7904d4c852229d289265d4d8dfda91218ab6ba097a1964438`,
            addr1.address,
            ``,
            {value: parseEther(0.0001)}
        );

        expect(await cards.getCardsCount()).to.equal(3);
    });

    it(`Card cancellation and redemption should not update card count`, async function () {
        const first = `0xa1c704e6eccd824452488dcfd63ba4b49f769c41a3bf52f1e8575f49f869dcfe`;
        await cards.connect(addr1).createCard(
            first,
            addr4.address,
            `First event`,
            {value: parseEther(0.004)}
        );

        const second = `0x3a926ec2368dc3cb8188958ddd193c552fea6d445ad473628aa949570ada00f9`;
        await cards.connect(addr1).createCard(
            second,
            addr5.address,
            `Second event`,
            {value: parseEther(50.43)}
        );

        expect(await cards.getCardsCount()).to.equal(2);

        await cards.connect(addr4).redeemCard(first);
        await cards.connect(addr1).cancelCard(second);

        expect(await cards.getCardsCount()).to.equal(2);
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
            {value: parseEther(9)}
        )).to.be.revertedWith(`InvalidBeneficiary("${nullAddress}")`);
    });

    it(`Card redemption`, async function () {
        const card = `0x9b931349e1ad2bec511969cd2d51ba491bb4af0f05870f5c15bfa600d54c293a`;

        await cards.connect(addr4).createCard(
            card,
            addr5.address,
            `Redeem me`,
            {value: parseEther(2.99)}
        );

        //check the contract received the right amount of ether
        const balance = await cards.provider.getBalance(cards.address);
        expect(balance).to.equal(parseEther(2.99));

        await cards.connect(addr5).redeemCard(card)

        //check the amount has been sent back to the owner
        const newBalance = await cards.provider.getBalance(cards.address);
        expect(newBalance).to.equal(parseEther(0));

        //TODO: check the right user received the ether
    });

    it(`Card redemption without being the beneficiary`, async function () {
        const card = `0xf6a2ab0171054d392912c0e224f47ef885012f0e497ec6206bcd5895e9281585`;

        await cards.connect(addr1).createCard(
            card,
            addr2.address,
            `Hello !`,
            {value: parseEther(2.23)}
        );

        //creator
        await expect(cards.connect(addr1).redeemCard(card)).to.be.revertedWith(`NotTheBeneficiary("${addr2.address}")`);

        //random addresses
        await expect(cards.connect(addr3).redeemCard(card)).to.be.revertedWith(`NotTheBeneficiary("${addr2.address}")`);
        await expect(cards.connect(addr4).redeemCard(card)).to.be.revertedWith(`NotTheBeneficiary("${addr2.address}")`);
        await expect(cards.connect(addr5).redeemCard(card)).to.be.revertedWith(`NotTheBeneficiary("${addr2.address}")`);
    });

    it(`Redeeming a same card twice`, async function () {
        const card = `0xc82f4c144edc934f74c5737bad7000ac495b8552c2d6e44ac7f98c4a520aad8e`;

        await cards.connect(addr1).createCard(
            card,
            addr2.address,
            `Hello !`,
            {value: parseEther(0.0454)}
        );

        //first legitimate redemption
        await cards.connect(addr2).redeemCard(card);

        //forbidden redemption
        await expect(cards.connect(addr1).redeemCard(card)).to.be.revertedWith(`Redeemed`);
        await expect(cards.connect(addr2).redeemCard(card)).to.be.revertedWith(`Redeemed`);
        await expect(cards.connect(addr3).redeemCard(card)).to.be.revertedWith(`Redeemed`);
        await expect(cards.connect(addr4).redeemCard(card)).to.be.revertedWith(`Redeemed`);
        await expect(cards.connect(addr5).redeemCard(card)).to.be.revertedWith(`Redeemed`);
    });

    it(`Card cancellation`, async function () {
        const card = `0xdbc170bf10cd669f3bedf97bd42eb313996d26a27c20b154aecf5cdaca8360ba`;

        await cards.connect(addr4).createCard(
            card,
            addr5.address,
            `Cancel me`,
            {value: parseEther(1.23)}
        );

        //check the contract received the right amount of ether
        const balance = await cards.provider.getBalance(cards.address);
        expect(balance).to.equal(parseEther(1.23));

        await cards.connect(addr4).cancelCard(card)

        //check the amount has been sent back to the owner
        const newBalance = await cards.provider.getBalance(cards.address);
        expect(newBalance).to.equal(parseEther(0));

        //TODO: check the right user received the ether
    });

    it(`Card cancellation without being the creator`, async function () {
        const card = `0x98f5800e28c6e368bf131c88cc79dd4d8ddf4afc7eef46b100b42939f3632266`;

        await cards.connect(addr1).createCard(
            card,
            addr2.address,
            `Hello !`,
            {value: parseEther(3.788)}
        );

        //beneficiary
        await expect(cards.connect(addr2).cancelCard(card)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);

        //random addresses
        await expect(cards.connect(addr3).cancelCard(card)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
        await expect(cards.connect(addr4).cancelCard(card)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
        await expect(cards.connect(addr5).cancelCard(card)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
    });

    it(`Cancelling a same card twice`, async function () {
        const card = `0x25f7edf3cd195d4bf278facf5fbd91a0ce755a74fa26128924a360f0dc5646d8`;

        await cards.connect(addr1).createCard(
            card,
            addr2.address,
            `Hello !`,
            {value: parseEther(2)}
        );

        //first legitimate cancellation
        await cards.connect(addr1).cancelCard(card);

        //forbidden cancellation
        await expect(cards.connect(addr1).cancelCard(card)).to.be.revertedWith(`Cancelled`);
        await expect(cards.connect(addr2).cancelCard(card)).to.be.revertedWith(`Cancelled`);
        await expect(cards.connect(addr3).cancelCard(card)).to.be.revertedWith(`Cancelled`);
        await expect(cards.connect(addr4).cancelCard(card)).to.be.revertedWith(`Cancelled`);
        await expect(cards.connect(addr5).cancelCard(card)).to.be.revertedWith(`Cancelled`);
    });

});
