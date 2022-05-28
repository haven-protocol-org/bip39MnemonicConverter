OUTPUT="monero.js"

# Compile C to js
emcc monero-core.c crypto-ops.c crypto-ops-data.c hash.c keccak.c -o monero-core.js -s WASM_ASYNC_COMPILATION=0 -s NODEJS_CATCH_EXIT=0 -s NODEJS_CATCH_REJECTION=0 -s EXPORTED_FUNCTIONS='["_sc_reduce32", "_secret_key_to_public_key", "_cn_fast_hash", "_get_subaddress_secret_key", "_sc_add", "_scalarmultKey", "_malloc", "_free"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -s WASM=1

# Create closure for WASM + custom functions
# echo 'const XMRModule = function() {' > $OUTPUT
echo 'const wasm_data =  `' >> $OUTPUT

# Convert wasm byte data to a hex multiline variable
xxd -p -c 70 monero-core.wasm >> $OUTPUT
echo '`;' >> $OUTPUT

# Add list of english words for bytes -> seed
#cat monero-words-english.js >> $OUTPUT

# Add custom helper methods
cat module.js >> $OUTPUT

# Add WASM code
cat monero-core.js >> $OUTPUT

# Finalize closure
#echo 'return Module;' >> $OUTPUT
#echo '}();' >> $OUTPUT
# add es6 export
echo 'export default Module;' >> $OUTPUT

mv $OUTPUT ../src
