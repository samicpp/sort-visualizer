cargo build --target wasm32-unknown-unknown --release
wasm-bindgen sorting-algorithms/target/wasm32-unknown-unknown/release/sorting_algorithm.wasm --out-dir public/pkg --target web
# cargo install -f wasm-bindgen-cli