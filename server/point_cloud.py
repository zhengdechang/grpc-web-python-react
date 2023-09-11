import grpc
import point_cloud_pb2 as point_cloud_pb2
import point_cloud_pb2_grpc as point_cloud_pb2_grpc


class PointCloudStreamService(point_cloud_pb2_grpc.PointCloudStreamServiceServicer):
    def GetStreamPointCloud(self, request, context):
        # 在这里处理点云数据的流式加载逻辑
        # 从文件或其他来源加载点云数据，并将其作为流式响应发送
        # 可以参考之前提供的代码示例来实现点云数据的加载和发送逻辑
        pass
