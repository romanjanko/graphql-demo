const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

//TODO test this
class SingletonJsonDB {
  constructor() {
    if (!SingletonJsonDB.instance) {
      SingletonJsonDB.instance = new JsonDB(new Config("graphql-demo-db", true, true))
    }
  }
 
  getInstance() {
    return SingletonJsonDB.instance
  }
}

module.exports = (new SingletonJsonDB).getInstance()