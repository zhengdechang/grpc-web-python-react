import React, { useRef, useEffect } from 'react'
import { useReactive } from 'ahooks'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { PointCloudRequest } from '@/grpc-api/point_cloud_pb.js'
import GrpcStream from '@/utils/GrpcStream'
import { Button, Input, Typography } from 'antd'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import getGrpcUrl from '@/utils/get-grpc-url.js'

const ThreePointCloud = () => {
  const viewNode = useRef(null)
  const state = useReactive({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    pointCloudMaterial: null,
    material: null,
    points: null,
    positions: [],
    geometry: null,
    stats: null,
  })

  useEffect(() => {
    initThreeScene()
    animation()
    window.addEventListener('resize', onWindowResize)

    return () => {
      cancelAnimationFrame(state.animationId)
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  const initThreeScene = () => {
    // Create a scene
    state.renderer = new THREE.WebGLRenderer({ antialias: true })
    state.renderer.setPixelRatio(window.devicePixelRatio)
    state.renderer.setSize(window.innerWidth, window.innerHeight)
    viewNode.current.appendChild(state.renderer.domElement)
    state.stats = new Stats()
    state.stats.dom.style.position = 'absolute' // 设置元素的位置
    viewNode.current.appendChild(state.stats.dom)

    state.scene = new THREE.Scene()
    state.scene.background = new THREE.Color(0x050505)
    state.scene.fog = new THREE.Fog(0x050505, 2000, 3500)

    state.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.01,
      40
    )
    state.camera.position.set(0, 0, 1)
    state.scene.add(state.camera)

    state.controls = new OrbitControls(state.camera, state.renderer.domElement)
    // state.controls.addEventListener('change', () => render()) // use if there is no animation loop
    state.controls.minDistance = 0.5
    state.controls.maxDistance = 10
  }

  const animation = () => {
    state.animationId = requestAnimationFrame(animation)
    state.stats.update()
    // Update your scene here
    render()
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
    console.log('event: ', event.target);
    clearScene()
    const file = event.target.files[0]
    if (file) {
      const loader = new PCDLoader()
      loader.load(URL.createObjectURL(file), function (points) {
        points.geometry.center()
        points.geometry.rotateX(Math.PI)
        points.name = file.name
        state.scene.add(points)

        const gui = new GUI()

        gui.add(points.material, 'size', 0.001, 0.01).onChange(render)
        gui.addColor(points.material, 'color').onChange(render)
        gui.open()

        render()
      })
    }
  }
  const render = () => {
    state.renderer.render(state.scene, state.camera)
  }

  const handler = (pointList) => {
    if (pointList != null) {
      const newPositions = pointList.flatMap((p) => [p.x, p.y, p.z])
      state.positions = [...state.positions, ...newPositions]
      // Create BufferGeometry and add position attribute
      if (!state.geometry) {
        state.geometry = new THREE.BufferGeometry()
      }

      state.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(state.positions, 3)
      )
      state.geometry.attributes.position.needsUpdate = true // Tell BufferGeometry to update

      if (!state.material) {
        state.material = new THREE.PointsMaterial({
          size: 0.005,
          color: 0xffffff,
          opacity: 0.7,
          transparent: true,
        })
        const gui = new GUI()
        gui.add(state.material, 'size', 0.001, 0.01).onChange(() => render())
        gui.addColor(state.material, 'color').onChange(() => render())
        gui.add(state.material, 'opacity').onChange(() => render())
        gui.add(state.material, 'transparent').onChange(() => render())
        gui.add(state.material, 'sizeAttenuation').onChange(() => render())
        gui.add(state.material, 'depthTest').onChange(() => render())
        gui.add(state.material, 'depthWrite').onChange(() => render())
        gui.add(state.material, 'vertexColors').onChange(() => render())
        gui.open()
      }

      if (!state.points) {
        state.points = new THREE.Points(state.geometry, state.material)
        state.scene.add(state.points)
      }

      // Center the points and rotate
      state.points.geometry.center()
      state.points.rotation.x = Math.PI

      render()
    }
  }

  function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight
    state.camera.updateProjectionMatrix()

    state.renderer.setSize(window.innerWidth, window.innerHeight)

    state.renderer.render(state.scene, state.camera)
  }

  const sendUnary = async () => {
    clearScene()
    const request = new PointCloudRequest()
    request.setFilename('Zaghetto.pcd')
    const stream = new GrpcStream(getGrpcUrl())
    stream.getStreamPointCloud(request, handler)
  }

  return (
    <React.Fragment>
      <div className="app-wrap">
        <Input
          type="file"
          id="pcd-upload"
          accept=".pcd"
          onChange={startServerStream}
          style={{ width: '200px', marginRight: '60px' }}
        />
        <Button id="clear-scene" onClick={clearScene}>
          清除场景
        </Button>
        <Button id="getPoints-scene" onClick={sendUnary}>
          获取grpc点云
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        <div ref={viewNode}></div>
      </div>
    </React.Fragment>
  )
}

export default ThreePointCloud
