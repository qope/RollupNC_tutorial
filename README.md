
# 事前のセットアップ

Phase1
```
snarkjs powersoftau new bn128 16 pot16_0000.ptau -v
snarkjs powersoftau contribute pot16_0000.ptau pot16_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot16_0001.ptau pot16_final.ptau -v
```


# 回路を新しく書いたら、次の手順を行う
```
circom zk.circom --r1cs --wasm --sym
node zk_js/generate_witness.js zk_js/zk.wasm input.json witness.wtns
snarkjs plonk setup zk.r1cs pot16_final.ptau final.zkey
snarkjs zkey export verificationkey final.zkey verification_key.json
snarkjs plonk prove final.zkey witness.wtns proof.json public.json
snarkjs plonk verify verification_key.json public.json proof.json
```

代わりに`prove.py`