# buikd image
docker build -f Dockerfile -t envoy-proxy:v1.0 .

# start docker container
docker compose up -d