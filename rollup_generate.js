const {buildEddsa, buildMimc7} = require("circomlibjs");
const { getCipherInfo } = require("crypto");
const fs = require("fs");


(async ()=>{
const eddsa =  await buildEddsa();
const mimcjs =  await buildMimc7();
const F = eddsa.babyJub.F;

const alicePrvKey = Buffer.from('1'.toString().padStart(64,'0'), "hex");
const alicePubKey = eddsa.prv2pub(alicePrvKey);
const alicePubKeyStr = [F.toString(alicePubKey[0]),F.toString(alicePubKey[1])];
const bobPrvKey = Buffer.from('2'.toString().padStart(64,'0'), "hex");
const bobPubKey = eddsa.prv2pub(bobPrvKey);
const bobPubKeyStr = [F.toString(bobPubKey[0]),F.toString(bobPubKey[1])];
const Alice = {
    pubkey: alicePubKeyStr,
    balance: "500"
}
const Bob = {
    pubkey: bobPubKeyStr,
    balance: "0"
}
const aliceHash = F.toString(mimcjs.multiHash(
    [Alice.pubkey[0], Alice.pubkey[1], Alice.balance]
));
const bobHash = F.toString(mimcjs.multiHash(
    [Bob.pubkey[0], Bob.pubkey[1], Bob.balance]
));
const accounts_root = F.toString(mimcjs.multiHash([aliceHash, bobHash]));
const tx = {
    from: Alice.pubkey,
    to: Bob.pubkey,
    amount: "500"
}

const txHashRow =mimcjs.multiHash(
    [tx.from[0], tx.from[1], tx.to[0], tx.to[1], tx.amount]
);
const signature = eddsa.signMiMC(alicePrvKey, txHashRow);
console.log(signature);

const newAlice = {
    pubkey: alicePubKey,
    balance: "0"
}
const newBob = {
    pubkey: bobPubKey,
    balance: "500"
}
const newAliceHash = F.toString(mimcjs.multiHash(
    [newAlice.pubkey[0], newAlice.pubkey[1], newAlice.balance]
));
const newbobHash = F.toString(mimcjs.multiHash(
    [newBob.pubkey[0], newBob.pubkey[1], newBob.balance]
));
const intermediate_root = F.toString(mimcjs.multiHash([newAliceHash, bobHash]));

const inputs = {
    "accounts_root": accounts_root,
    "intermediate_root": intermediate_root,
    "accounts_pubkeys": [
        [Alice.pubkey[0], Alice.pubkey[1]], 
        [Bob.pubkey[0], Bob.pubkey[1]]
    ],
    "accounts_balances": [Alice.balance, Bob.balance],
    "sender_pubkey": [Alice.pubkey[0], Alice.pubkey[1]],
    "sender_balance": Alice.balance,
    "receiver_pubkey": [Bob.pubkey[0], Bob.pubkey[1]],
    "receiver_balance": Bob.balance,
    "amount": tx.amount,
    "signature_R8x": F.toString(signature.R8[0]),
    "signature_R8y": F.toString(signature.R8[1]),
    "signature_S": signature.S.toString(),
    "sender_proof": [bobHash],
    "sender_proof_pos": ["1"],
    "receiver_proof": [newAliceHash],
    "receiver_proof_pos": ["0"]
}

fs.writeFileSync(
    "rollup_input.json",
    JSON.stringify(inputs),
    "utf-8"
)
// console.log(Alice);
// const aliceHash = F.toString(mimcjs.multiHash(
//     [Alice.pubkey[0], Alice.pubkey[1], Alice.balance]
// ));
// const leaf1 = F.toString(mimcjs.multiHash([1,2,3]));
// const leaf2 = F.toString(mimcjs.multiHash([4,5,6]));
// const leaf3 = F.toString(mimcjs.multiHash([7,8,9]));
// const leaf4 = F.toString(mimcjs.multiHash([9,8,7]));
// const leafArray = [leaf1,leaf2,leaf3,leaf4]
// const tree = treeFromLeafArray(leafArray);
// const root = tree[0][0];
// const leaf1Pos = ["1","1"];
// const leaf1Proof = [leaf2, tree[1][1]];


// const inputs = {
//     "preimage": ["1","2","3"],
//     "root": root,
//     "paths2_root": leaf1Proof,
//     "paths2_root_pos": leaf1Pos
// }
// console.log(inputs);

// fs.writeFileSync(
//     "./leaf_existence_input.json",
//     JSON.stringify(inputs),
//     "utf-8"
// );


function treeFromLeafArray(leafArray) {
    const depth = Math.log2(leafArray.length);
    const tree = Array(depth);
    tree[depth-1] = pairwiseHash(leafArray);
    for(let k=depth-2;k>=0;k--) {
        tree[k] = pairwiseHash(tree[k+1]);
    }
    return tree;
}

function pairwiseHash(array){
    arrayHash = []
    for (i = 0; i < array.length; i = i + 2){
        const pairhash = mimcjs.multiHash(
            [array[i], array[i+1]]
        );
        arrayHash.push(F.toString(pairhash));
    }
    return arrayHash
}
})();

