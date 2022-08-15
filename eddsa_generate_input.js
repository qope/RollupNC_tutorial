const circomlibjs = require("circomlibjs");
const fs = require("fs");

(async ()=>{

const eddsa =  await circomlibjs.buildEddsa();
const mimcjs =  await circomlibjs.buildMimc7();

const F = eddsa.babyJub.F;
const preimage = [123,456,789];
const msg = mimcjs.multiHash(preimage);
const prvKey = fromHexString("0001020304050607080900010203040506070809000102030405060708090001");
console.log(prvKey);
const pubKey = eddsa.prv2pub(prvKey);
const signature = eddsa.signMiMC(prvKey, msg);

const inputs = {
    "from_x": F.toString(pubKey[0]),
    "from_y": F.toString(pubKey[1]),
    "R8x": F.toString(signature.R8[0]),
    "R8y": F.toString(signature.R8[1]),
    "S": signature.S.toString(),
    "M": F.toString(msg)
}

console.log(inputs);

fs.writeFileSync(
    "./input.json",
    JSON.stringify(inputs),
    "utf-8"
);

})();

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
