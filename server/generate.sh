#!/bin/bash

# If requirement is not installed, open the following comment
# chmod +x ./activate && ./activate

mkdir -p output

python3  -m grpc_tools.protoc --proto_path=./proto --python_out=./output --grpc_python_out=./output simple_grpc.proto

echo "Generation complete! The output files are located in the Output folder."
