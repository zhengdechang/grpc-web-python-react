const getGrpcUrl = () => {
    return process.env.REACT_APP_GRPC_URL || 'https://d0a9-206-190-239-91.ngrok-free.app'
}


export default getGrpcUrl