import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { bcs } from "@mysten/sui.js/bcs";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import wallet from "./wba-wallet.json"
import { fromHEX } from "@mysten/bcs";

const keypair = Ed25519Keypair.fromSecretKey(fromHEX(wallet.privateKey));
const client = new SuiClient({ url: getFullnodeUrl("devnet") });

const enrollment_object_id = "0x326054a2db6192fcd3085cfde6e92d1a917f3df953f5327f7d4e3c1457e8816e";
const cohort = "0x0311787fbd06d5e50927173103f3edd59a864c7b97ed5cda6fe02ed4e2b2e6aa";

const txb = new TransactionBlock();
const github = new Uint8Array(Buffer.from("iamknownasfesal"));
let serialized_github = txb.pure(bcs.vector(bcs.u8()).serialize(github), "vector<u8>");

txb.moveCall({
    target: `${enrollment_object_id}::enrollment::enroll`,
    arguments: [txb.object(cohort), serialized_github],
});

(async () => {
    let txid = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: txb });
    console.log(`Success! Check our your TX here: https://suiexplorer.com/txblock/${txid.digest}?network=devnet`);
})();