const db = require('../db/connection');
const fs = require('fs/promises')

exports.selectApi = () => {

    return fs
    .readFile(`${__dirname}/../endpoints.json`, `utf8`)
    .then((endpoint) => {
        const parsedEndpoint = JSON.parse(endpoint);
        return parsedEndpoint
    })

}
