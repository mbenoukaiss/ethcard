# Ethcard
A (mostly useless) web application to make gift cards of Ethereum with your Metamask wallet !
Project made in two weeks to learn the basics of Solidity and Web3 programming.

## Demo
The application can be tested at http://51.38.34.237/, the contract is deployed on the
Ropsten test network.

## Installation
If you plan on deploying both the smart contract and the client you can run the following 
command which will initialize both the `contract` and `client` projects.
```shell
yarn setup
```

If you just want to run the application with the existing contract, run :
```shell
yarn setup-client
```

### Deploying the contract (optional)
This step is optional, you can use the already existing contract on the Ropsten test network with
the following address :
```
0x048a8198d33Bcd0D368d1fD3019d15B1Fed4ea90
```

Then you need to get an ethereum wallet private key and an API URL (from a service such as
[Alchemy](https://www.alchemy.com/)) and write both in a `config.json` file in the `contract` 
folder, the file must have the following structure :
```json
{
    "api": "http://your.api/url",
    "keys": [
        "your private key"
    ]
}
```

If you're deploying the contract on the Ropsten network you can run `yarn deploy-ropsten` else
you can run `yarn deploy` and specify the `--network` argument.
Script execution should take about 45 seconds. When you have your contract address, replace 
the current address in `CardContext.tsx` with your new address.

### Running the application
Finally, run the react application locally by running the following command, you can open
your browser and go to http://localhost:3000/ to see the application.
```shell
yarn start
```

## Technical stack
Frontend made with the React framework and the ethers.js library and a smart contract made 
with Solidity and hardhat. The smart contract is fully tested and continuous integration has 
been setup using Github Actions.