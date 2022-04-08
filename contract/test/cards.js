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
        const tx = await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Hello !`,
            {value: parseEther(0.5)}
        );

        await tx.wait();

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

    it(`Create card for yourself`, async function () {
        const number = `0xd7de1281ee76226ddfa2efac59a8db26410b5cde3a040d7b18cceb9ef71e410a`;
        const tx = await cards.connect(addr1).createCard(
            number,
            addr1.address,
            `Hello !`,
            {value: parseEther(5.6)}
        );

        await tx.wait();

        const card = await cards.getCard(number);
        expect(card.creator).to.equal(addr1.address);
        expect(card.beneficiary).to.equal(addr1.address);
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

    it(`Check emitted cards contains the new card`, async function () {
        const number = `0xa51445df02aab9d95aef0b5334a4428582e3918da0f820f20e980784147413ec`;

        expect(await cards.getEmittedCards(addr1.address)).to.eql([]);
        expect(await cards.getEmittedCards(addr2.address)).to.eql([]);

        await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Hello !`,
            {value: parseEther(9)}
        );

        expect(await cards.getEmittedCards(addr1.address)).to.eql([number]);

        //check it isn't in the beneficiarys's emitted cards list
        expect(await cards.getEmittedCards(addr2.address)).to.eql([]);
    });

    it(`Check available cards contains the new card`, async function () {
        const number = `0xa51445df02aab9d95aef0b5334a4428582e3918da0f820f20e980784147413ec`;

        expect(await cards.getAvailableCards(addr1.address)).to.eql([]);
        expect(await cards.getAvailableCards(addr2.address)).to.eql([]);

        await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Hello !`,
            {value: parseEther(9)}
        );

        expect(await cards.getAvailableCards(addr2.address)).to.eql([number]);

        //check it isn't in the owner's available cards list
        expect(await cards.getAvailableCards(addr1.address)).to.eql([]);
    });

    it(`Card redemption`, async function () {
        const number = `0x9b931349e1ad2bec511969cd2d51ba491bb4af0f05870f5c15bfa600d54c293a`;

        await cards.connect(addr4).createCard(
            number,
            addr5.address,
            `Redeem me`,
            {value: parseEther(2.99)}
        );

        //check the contract received the right amount of ether
        const balance = await cards.provider.getBalance(cards.address);
        expect(balance).to.equal(parseEther(2.99));

        const tx = await cards.connect(addr5).redeemCard(number);
        const block = await cards.provider.getBlock(tx.blockHash);

        //check the amount has been sent back to the owner
        const newBalance = await cards.provider.getBalance(cards.address);
        expect(newBalance).to.equal(parseEther(0));

        //check redeemed at was set
        const card = await cards.getCard(number);
        expect(card.redeemedAt).to.equal(block.timestamp);
        expect(card.cancelledAt).to.equal(0);

        //TODO: check the right user received the ether
    });

    it(`Card redemption should emit event`, async function () {
        const number = `0xd629196171c365965e3c6b41389f9056725b61ec7c8e5635dc210412fa426b44`;

        await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Cancel event`,
            {value: parseEther(45.1)}
        );

        await expect(cards.connect(addr2).redeemCard(number))
            .to.emit(cards, `RedeemedCard`).withArgs(number);
    });

    it(`Inexistant card redemption fails`, async function () {
        await expect(cards.connect(addr1).redeemCard(`0x1eb47bef4b636c99e5093bb2216858942cfc3bd6fab86ddda2c567f195fa534a`))
            .to.be.revertedWith(`DoesNotExist`);

        await expect(cards.connect(addr2).redeemCard(`0x304732793f0a48a6cbd359dd62bf6cdc6011bce6fe831df9a6f770d2c4412c46`))
            .to.be.revertedWith(`DoesNotExist`);
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
        const number = `0xdbc170bf10cd669f3bedf97bd42eb313996d26a27c20b154aecf5cdaca8360ba`;

        await cards.connect(addr4).createCard(
            number,
            addr5.address,
            `Cancel me`,
            {value: parseEther(1.23)}
        );

        //check the contract received the right amount of ether
        const balance = await cards.provider.getBalance(cards.address);
        expect(balance).to.equal(parseEther(1.23));

        const tx = await cards.connect(addr4).cancelCard(number);
        const block = await cards.provider.getBlock(tx.blockHash);

        //check the amount has been sent back to the owner
        const newBalance = await cards.provider.getBalance(cards.address);
        expect(newBalance).to.equal(parseEther(0));

        //check cancelled at was set
        const card = await cards.getCard(number);
        expect(card.cancelledAt).to.equal(block.timestamp);
        expect(card.redeemedAt).to.equal(0);

        //TODO: check the right user received the ether
    });

    it(`Card cancellation should emit event`, async function () {
        const number = `0x29385a0165fa227362d2296cae4ce355601b678aef6b378a1a27fde02138f2e3`;

        await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Cancel event`,
            {value: parseEther(1.45)}
        );

        await expect(cards.connect(addr1).cancelCard(number))
            .to.emit(cards, `CancelledCard`).withArgs(number);
    });

    it(`Inexistant card cancellation fails`, async function () {
        await expect(cards.connect(addr1).redeemCard(`0xe4d3baa605ea5a32bae20edb824e2d2d8f0d037b74c2cac251d5294469e86858`))
            .to.be.revertedWith(`DoesNotExist()`);

        await expect(cards.connect(addr2).redeemCard(`0x1e0493617659d1628fabfc95c6f0468ddec7dd4b4edc36ac198b3766115734a2`))
            .to.be.revertedWith(`DoesNotExist()`);
    });

    it(`Card cancellation without being the creator`, async function () {
        const number = `0x98f5800e28c6e368bf131c88cc79dd4d8ddf4afc7eef46b100b42939f3632266`;

        await cards.connect(addr1).createCard(
            number,
            addr2.address,
            `Hello !`,
            {value: parseEther(3.788)}
        );

        //beneficiary
        await expect(cards.connect(addr2).cancelCard(number)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);

        //random addresses
        await expect(cards.connect(addr3).cancelCard(number)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
        await expect(cards.connect(addr4).cancelCard(number)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
        await expect(cards.connect(addr5).cancelCard(number)).to.be.revertedWith(`NotTheCreator("${addr1.address}")`);
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
