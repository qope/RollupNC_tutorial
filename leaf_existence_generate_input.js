const {buildEddsa, buildMimc7} = require("circomlibjs");
const { getCipherInfo } = require("crypto");
const fs = require("fs");


(async ()=>{
const eddsa =  await buildEddsa();
const mimcjs =  await buildMimc7();
const F = eddsa.babyJub.F;
const leaf1 = F.toString(mimcjs.multiHash([1,2,3]));
const leaf2 = F.toString(mimcjs.multiHash([4,5,6]));
const leaf3 = F.toString(mimcjs.multiHash([7,8,9]));
const leaf4 = F.toString(mimcjs.multiHash([9,8,7]));
const leafArray = [leaf1,leaf2,leaf3,leaf4]
const tree = treeFromLeafArray(leafArray);
const root = tree[0][0];
const leaf1Pos = ["1","1"];
const leaf1Proof = [leaf2, tree[1][1]];


const inputs = {
    "preimage": ["1","2","3"],
    "root": root,
    "paths2_root": leaf1Proof,
    "paths2_root_pos": leaf1Pos
}
console.log(inputs);

fs.writeFileSync(
    "./leaf_existence_input.json",
    JSON.stringify(inputs),
    "utf-8"
);


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

