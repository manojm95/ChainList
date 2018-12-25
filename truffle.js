module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },
          chainskills: {
               host: "localhost",
               port: 8545,
               network_id: "4224"
          },
          poa: {
               host: "54.243.9.9",
               port: 8545,
               network_id: "1015"
          }
     }
};
