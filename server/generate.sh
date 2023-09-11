#!/bin/bash

# If requirement is not installed, open the following comment
# chmod +x ./activate && ./activate

python3  -m grpc_tools.protoc --proto_path=./protos --python_out=. --grpc_python_out=. simple_grpc.proto

echo "Generation complete! The output files are located in the proto folder."
