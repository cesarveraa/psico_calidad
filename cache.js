const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 600 }); // TTL de 10 minutos

module.exports = myCache;