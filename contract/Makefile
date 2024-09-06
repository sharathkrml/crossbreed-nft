-include .env

clean  :; forge clean


deploy-receiver :; forge script script/DeplyBreedDalleScript.s.sol --via-ir --rpc-url ${SEPOLIA_RPC} --account ${ACCOUNT} --sender ${ADDRESS} --password-file .password --broadcast --legacy -vvvv 

verify-receiver :; forge verify-contract \
  --rpc-url ${SEPOLIA_RPC} \
  ${RECEIVER_ADDRESS} \
  BreedDalleNFT \
  --verifier blockscout \
  --verifier-url ${SEPOLIA_BLOCKSCOUT}

