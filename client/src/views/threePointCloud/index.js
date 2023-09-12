import React, { useRef, useEffect } from 'react'
import { useReactive } from 'ahooks'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { PointCloudRequest } from '@/grpc-api/point_cloud_pb.js'

const ThreePointCloud = () => {
  const state = useReactive({
    scene: null,
    camera: null,
    renderer: null,
    controler: null,
    pointCloudMaterial: null,
  })

  useEffect(() => {
    initThreeScene()
    animation()

    return () => {
      cancelAnimationFrame(state.animationId)
    }
  }, [])

  const initThreeScene = () => {
    // Create a scene
    state.scene = new THREE.Scene()

    // Create a camera
    state.camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    state.camera.position.set(120, 800, 180)
    state.camera.lookAt(state.scene.position)

    // Create a renderer
    state.renderer = new THREE.WebGLRenderer({ alpha: true })
    state.renderer.setSize(window.innerWidth, window.innerHeight)
    state.renderer.setClearColor(0xeeeeee, 1)
    document.body.appendChild(state.renderer.domElement)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xcccccc)
    state.scene.add(ambientLight)

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(400, 10, 500)
    state.scene.add(pointLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x999999)
    directionalLight.position.set(0, 150, 0)
    state.scene.add(directionalLight)

    // Add controls
    state.controler = new OrbitControls(state.camera, state.renderer.domElement)
    state.controler.minPolarAngle = 0
    state.controler.maxPolarAngle = Math.PI / 2
    state.controler.minDistance = 1
    state.controler.maxDistance = 800

    // Create point cloud material
    state.pointCloudMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      opacity: 0.7,
      transparent: true,
    })
  }

  const animation = () => {
    state.animationId = requestAnimationFrame(animation)
    // Update your scene here
    state.renderer.render(state.scene, state.camera)
  }

  const clearScene = () => {
    for (const object of state.scene.children.slice()) {
      if (object instanceof THREE.Points) {
        state.scene.remove(object)
      }
    }
    state.renderer.render(state.scene, state.camera)
  }

  const startServerStream = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const points = pcdLoader.parse(e.target.result)
        points.material = state.pointCloudMaterial
        state.scene.add(points)
        state.renderer.render(state.scene, state.camera)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const sendUnary = async () => {
    clearScene()
    const client = new PointCloudStreamServiceClient(
      'http://localhost:5000',
      null,
      null
    )
    const streamRequest = new PointCloudRequest()
    streamRequest.setFilename('wolf.pcd')
    let i = 0
    const stream = client.getStreamPointCloud(streamRequest, {})

    stream.on('data', (response) => {
      if (response != null) {
        const positions = []
        const point = {
          x: response.getX(),
          y: response.getY(),
          z: response.getZ(),
        }
        positions.push(point.x, point.y, point.z)

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(positions, 3)
        )
        geometry.computeBoundingSphere()

        const material = new THREE.PointsMaterial({
          size: 3,
          vertexColors: 0x00ff00,
        })
        const points = new THREE.Points(geometry, material)
        state.scene.add(points)
        state.renderer.render(state.scene, state.camera)
      }
    })

    stream.on('error', (err) => {
      console.log(
        `Unexpected stream error: code = ${err.code}, message = "${err.message}"`
      )
    })
  }

  return (
    <div className="app-wrap" ref={viewNode}>
      <input
        type="file"
        id="pcd-upload"
        accept=".pcd"
        onClick={startServerStream}
      />
      <button id="clear-scene" onClick={clearScene}>
        清除场景
      </button>
      <button id="getPoints-scene" onClick={sendUnary}>
        获取实时点云
      </button>
    </div>
  )
}

export default ThreePointCloud