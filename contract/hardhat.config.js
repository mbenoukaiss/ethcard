const fs = require('fs');

require("@nomiclabs/hardhat-waffle");

//current contract 0xA9D8EF3B012c5e2860D364aB6DCd049735D550E4

try {
    const config = JSON.parse(fs.readFileSync(`config.json`, `utf8`));

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


