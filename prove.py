import sys
import subprocess

args = sys.argv

filename = args[1]

subprocess.call('mkdir -p {}'.format(filename), shell=True)
subprocess.call('circom {0}.circom --r1cs --wasm --sym -o {0}'.format(filename), shell=True)
subprocess.call('node {0}/{0}_js/generate_witness.js {0}/{0}_js/{0}.wasm {0}_input.json {0}/{0}_witness.wtns'.format(filename), shell=True)
subprocess.call('snarkjs plonk setup {0}/{0}.r1cs pot16_final.ptau {0}/{0}_final.zkey'.format(filename), shell=True), filename
subprocess.call('snarkjs zkey export verificationkey {0}/{0}_final.zkey {0}/{0}_verification_key.json'.format(filename), shell=True)
subprocess.call('snarkjs plonk prove {0}/{0}_final.zkey {0}/{0}_witness.wtns {0}/{0}_proof.json {0}/{0}_public.json'.format(filename), shell=True)
subprocess.call('snarkjs plonk verify {0}/{0}_verification_key.json {0}/{0}_public.json {0}/{0}_proof.json'.format(filename), shell=True)
