# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: point_cloud.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x11point_cloud.proto\x12\npointcloud\"(\n\x05Point\x12\t\n\x01x\x18\x01 \x01(\x01\x12\t\n\x01y\x18\x02 \x01(\x01\x12\t\n\x01z\x18\x03 \x01(\x01\"7\n\x12PointCloudResponse\x12!\n\x06points\x18\x01 \x03(\x0b\x32\x11.pointcloud.Point\"%\n\x11PointCloudRequest\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t2d\n\x17PointCloudStreamService\x12I\n\x13GetStreamPointCloud\x12\x1d.pointcloud.PointCloudRequest\x1a\x11.pointcloud.Point0\x01\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'point_cloud_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _POINT._serialized_start=33
  _POINT._serialized_end=73
  _POINTCLOUDRESPONSE._serialized_start=75
  _POINTCLOUDRESPONSE._serialized_end=130
  _POINTCLOUDREQUEST._serialized_start=132
  _POINTCLOUDREQUEST._serialized_end=169
  _POINTCLOUDSTREAMSERVICE._serialized_start=171
  _POINTCLOUDSTREAMSERVICE._serialized_end=271
# @@protoc_insertion_point(module_scope)
