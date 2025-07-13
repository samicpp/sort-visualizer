# this shouldnt be ran

javac Server.java
jar cfe server.jar Server Server.class 'Server$Handler.class'
cd sorting-algorithms
cargo build --release
cmake -S cxx -B build
cmake --build build
cargo build --target wasm32-unknown-unknown --release
cd ..
wasm-bindgen sorting-algorithms/target/wasm32-unknown-unknown/release/sorting_algorithm.wasm --out-dir public/pkg --target web
tsc --project tsconfig.json
cd static-serve
cargo build --target x86_64-unknown-linux-gnu --release
export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc
cargo build --target aarch64-unknown-linux-gnu --release
cp ./target/aarch64-unknown-linux-gnu/release/static_serve ./bin/aarch64-unknown-linux-gnu
cp ./target/x86_64-unknown-linux-gnu/release/static_serve ./bin/x86_64-unknown-linux-gnu
cp ./static-serve/bin/x86_64-unknown-linux-gnu ./server-x86_64
cp ./static-serve/bin/aarch64-unknown-linux-gnu ./server-aarch64
