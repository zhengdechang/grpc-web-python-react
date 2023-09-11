#!/bin/bash

# If requirement is not installed, open the following comment
# chmod +x ./activate && ./activate

python3  -m grpc_tools.protoc --proto_path=./proto --python_out=./proto --grpc_python_out=./proto simple_grpc.proto

echo "Generation complete! The output files are located in the proto folder."
