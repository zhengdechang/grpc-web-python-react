import grpc
from pyntcloud import PyntCloud
import point_cloud_pb2 as point_cloud_pb2
import point_cloud_pb2_grpc as point_cloud_pb2_grpc
import os


def generate_point_cloud(pcd_file):
    try:
        cloud = PyntCloud.from_file(pcd_file)
        points = cloud.points.values.tolist()

        print(len(points),'points')
        for point in points:
            x, y, z = point
            yield point_cloud_pb2.Point(x=x, y=y, z=z)
    except Exception as e:
        print(f'e:{e}')



class PointCloudStreamService(point_cloud_pb2_grpc.PointCloudStreamServiceServicer):
    def GetStreamPointCloud(self, request, context):
        pcd_file = os.path.join('./pcd-data', request.filename)  # Get the pcd_file value from the request
        print(pcd_file,'pcd_file')
        point_generator = generate_point_cloud(pcd_file)

        try:
            for point in point_generator:
                yield point
        except Exception as e:
            print(f'e:{e}')
