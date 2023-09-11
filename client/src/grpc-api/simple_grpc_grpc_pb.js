// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var simple_grpc_pb = require('./simple_grpc_pb.js');

function serialize_simplegrpc_HelloReq(arg) {
  if (!(arg instanceof simple_grpc_pb.HelloReq)) {
    throw new Error('Expected argument of type simplegrpc.HelloReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_simplegrpc_HelloReq(buffer_arg) {
  return simple_grpc_pb.HelloReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_simplegrpc_HelloRes(arg) {
  if (!(arg instanceof simple_grpc_pb.HelloRes)) {
    throw new Error('Expected argument of type simplegrpc.HelloRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_simplegrpc_HelloRes(buffer_arg) {
  return simple_grpc_pb.HelloRes.deserializeBinary(new Uint8Array(buffer_arg));
}


var SimpleGrpcService = exports.SimpleGrpcService = {
  sayHello: {
    path: '/simplegrpc.SimpleGrpc/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: simple_grpc_pb.HelloReq,
    responseType: simple_grpc_pb.HelloRes,
    requestSerialize: serialize_simplegrpc_HelloReq,
    requestDeserialize: deserialize_simplegrpc_HelloReq,
    responseSerialize: serialize_simplegrpc_HelloRes,
    responseDeserialize: deserialize_simplegrpc_HelloRes,
  },
  sayHelloToMany: {
    path: '/simplegrpc.SimpleGrpc/SayHelloToMany',
    requestStream: true,
    responseStream: false,
    requestType: simple_grpc_pb.HelloReq,
    responseType: simple_grpc_pb.HelloRes,
    requestSerialize: serialize_simplegrpc_HelloReq,
    requestDeserialize: deserialize_simplegrpc_HelloReq,
    responseSerialize: serialize_simplegrpc_HelloRes,
    responseDeserialize: deserialize_simplegrpc_HelloRes,
  },
  checkInbox: {
    path: '/simplegrpc.SimpleGrpc/CheckInbox',
    requestStream: false,
    responseStream: true,
    requestType: simple_grpc_pb.HelloReq,
    responseType: simple_grpc_pb.HelloRes,
    requestSerialize: serialize_simplegrpc_HelloReq,
    requestDeserialize: deserialize_simplegrpc_HelloReq,
    responseSerialize: serialize_simplegrpc_HelloRes,
    responseDeserialize: deserialize_simplegrpc_HelloRes,
  },
};

exports.SimpleGrpcClient = grpc.makeGenericClientConstructor(SimpleGrpcService);
