# RollupNC tutorial
このレポジトリは[RollupNC tutorial](https://github.com/rollupnc/RollupNC_tutorial)の古くなってエラーが発生していた箇所を修正したものです。あくまで自分の勉強の為に作成したもので、元のレポジトリから大幅に変更されている部分もあるのでご了承ください。

# git clone

```
git clone https://github.com/qope/RollupNC_tutorial.git --recursive
```

# circomlibjsとsnarkjsのインストール

```
npm i
```

# 事前のセットアップ

trusted setupのPhase1を行い、`pot16_final.ptau`を作成する(自分の環境では10分程度掛かった)。
```
snarkjs powersoftau new bn128 16 pot16_0000.ptau -v
snarkjs powersoftau contribute pot16_0000.ptau pot16_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot16_0001.ptau pot16_final.ptau -v
```


# 回路のコンパイル&検証
例えば`eddsa.circom`とそのインプットファイル`eddsa_input.json`を作ったら、次の手順でZKPを作成し検証する。
最後に`snarkJS: OK!`が表示されると成功。
```
circom eddsa.circom --r1cs --wasm --sym
node eddsa_js/generate_witness.js eddsa_js/eddsa.wasm eddsa_input.json eddsa_witness.wtns
snarkjs plonk setup eddsa.r1cs pot16_final.ptau eddsa_final.zkey
snarkjs zkey export verificationkey eddsa_final.zkey eddsa_verification_key.json
snarkjs plonk prove eddsa_final.zkey eddsa_witness.wtns eddsa_proof.json eddsa_public.json
snarkjs plonk verify eddsa_verification_key.json eddsa_public.json eddsa_proof.json
```

上の手順は手間が掛かるので、Pythonスクリプトを用意した。

```
python prove.py eddsa
```
で上記の全てのコマンドが実行される。

# input.jsonの生成
`{name}.circom`のインプットファイルは`node {name}_generate_input.js`で生成できる。
