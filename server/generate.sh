#!/bin/bash

# If protobuf-compiler is not installed, open the following comment
# sudo apt install -y protobuf-compiler

mkdir -p output

protoc --python_out=output --grpc_python_out=output your_proto_file.proto

echo "Generation complete! The output files are located in the Output folder."
