#!/bin/bash

# If requirement is not installed, open the following comment
# chmod +x ./activate && ./activate

mkdir -p output

python3  -m grpc_tools.protoc --proto_path=./proto --python_out=. --grpc_python_out=. simple_grpc.proto

echo "Generation complete! The output files are located in the Output folder."
