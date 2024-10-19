const { exit } = require("process");
const { id, createClient, AccountFlags } = require("tigerbeetle-node");

// Account Codes 
// the code indicates the account type, such as assets, liabilities, equity, income, or expenses, and subcategories within those classification.
// 1: the stokvel escrow account owned by VelFund
// 1000: a contributor account
//
// Ledgers
// 1: contributions ledger. update later to make logical groupings.
//
// Transfer Codes
// the code indicates why a given transfer is happening, such as a purchase, refund, currency exchange, etc.
// 1000: contribution

async function seedTigerBeetle() {
  const client = createClient({
    cluster_id: 0n,
    replica_addresses: [
      "127.0.0.1:4000",
      "127.0.0.1:4001",
      "127.0.0.1:4002",
      "127.0.0.1:4003",
      "127.0.0.1:4004",
      "127.0.0.1:4005"
    ],
  });

  const velFundAccounts = await client.lookupAccounts([1n])
  if(velFundAccounts.length > 0){
    console.log("VelFund account already exists")
    return true;
  }

  const account = {
    id: 1n, // A unique ID for the stokvel account in TigerBeetle
    debits_pending: 0n,
    debits_posted: 0n,
    credits_pending: 0n,
    credits_posted: 0n,
    user_data_128: 0n,// entity id in the control plane db
    user_data_64: 0n, // realworld timestamp in UTC
    user_data_32: 0,  // locale
    reserved: 0,
    ledger: 1, // Could represent the ledger for contributions
    code: 1, // Custom code to represent this type of account
    flags: AccountFlags.history,
    timestamp: 0n,
  };

  try {
    const account_errors = await client.createAccounts([account]);
    if (account_errors.length === 0) {
      console.log('VelFund account created successfully in TigerBeetle');
    } else {
      console.error('Error creating VelFund account:', account_errors);
    }
  } catch (error) {
    console.error('Failed to create VelFund account:', error);
  }
}

seedTigerBeetle();