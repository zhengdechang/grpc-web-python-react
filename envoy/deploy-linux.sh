# buikd image
docker build -f Dockerfile -t grpc-proxy:v1.0 .

# start docker container
docker compose up -d
