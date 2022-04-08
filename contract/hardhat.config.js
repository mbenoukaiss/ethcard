const fs = require('fs');

require("@nomiclabs/hardhat-waffle");

try {
    let config;
    if (fs.existsSync(`config.json`)) {
        config = JSON.parse(fs.readFileSync(`config.json`, `utf8`));
    } else {
        config = {
            api: process.env.CONTRACT_API,
            keys: [process.env.ETHEREUM_PRIVATE_KEY],
        }
    }

    module.exports = {
        solidity: `0.8.13`,
        networks: {
            ropsten: {
                url: config.api,
                accounts: config.keys,
            }
        }
    };
} catch (err) {
    console.error(err)
}


