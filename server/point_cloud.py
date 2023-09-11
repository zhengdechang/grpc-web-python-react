import grpc
from pyntcloud import PyntCloud
import point_cloud_pb2 as point_cloud_pb2
import point_cloud_pb2_grpc as point_cloud_pb2_grpc


def generate_point_cloud(pcd_file):
    cloud = PyntCloud.from_file(pcd_file)
    points = cloud.points.values.tolist()

    for point in points:
        x, y, z = point
        yield point_cloud_pb2.Point(x=x, y=y, z=z)


class PointCloudStreamService(point_cloud_pb2_grpc.PointCloudStreamServiceServicer):
    def GetStreamPointCloud(self, request, context):
        pcd_file = request.pcd_file  # Get the pcd_file value from the request

        point_generator = generate_point_cloud(pcd_file)
        for point in point_generator:
            yield point