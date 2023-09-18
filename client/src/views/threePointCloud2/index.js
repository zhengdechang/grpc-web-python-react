import React, { useRef, useEffect } from 'react'
import { useReactive } from 'ahooks'
import * as THREE from 'three'
import './index.less'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { PointCloudRequest } from '@/grpc-api/point_cloud_pb.js'
import GrpcStream from '@/utils/GrpcStream'
import { Button, Input, Typography } from 'antd'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { GUI } from 'dat.gui'
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
    guiControls: {
      showPointCloud: true,
      size: 0.005,
      color: 0xffffff,
      opacity: 0.7,
      transparent: true,
      autoRotate: false,
    },
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
    state.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
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

    setupLights()
    addControls()
  }

  const animation = () => {
    state.animationId = requestAnimationFrame(animation)
    state.stats.update()
    // Update your scene here
    render()
  }

  const addControls = () => {
    state.geometry = new THREE.BufferGeometry()

    state.material = new THREE.PointsMaterial(state.guiControls)
    const gui = new GUI()

    const box = gui.addFolder('Points')
    // box.add(state.points.material, 'x', 0, 3).name('Width').listen();
    // box.add(state.points.material, 'y', 0, 3).name('Height').listen();
    // box.add(state.points.material, 'z', 0, 3).name('Length').listen();
    // box.add(state.points.material, 'wireframe').listen();
    box
      .add(state.guiControls, 'showPointCloud')
      .name('显示点云')
      .onChange((value) => {
        if (state.points) state.points.visible = value
      })
    const other = gui.addFolder('Other')
    other
      .add(state.guiControls, 'size', 0.001, 0.01)
      .name('颗粒度')
      .onChange((value) => {
        if (state.points) {
          state.points.material.size = value
        }
      })
    other
      .add(state.guiControls, 'opacity', 0, 1)
      .name('透明度')
      .onChange((value) => {
        if (state.points) {
          state.points.material.opacity = value
        }
      })
    other
      .addColor(state.guiControls, 'color')
      .name('颜色')
      .onChange((value) => {
        if (state.points) {
          state.points.material.color.set(value)
        }
      })
    other
      .add(state.guiControls, 'autoRotate')
      .name('自动旋转')
      .onChange((value) => {
        state.points.autoRotate = value
        render()
      })

    const guiDomElement = gui.domElement
    console.log(guiDomElement, 'guiDomElement')
    viewNode.current.appendChild(guiDomElement)
    // 设置gui的位置
    guiDomElement.style.position = 'absolute'
    guiDomElement.style.top = '10px'
    guiDomElement.style.right = '10px'
    // gui.add(state.material, 'size', 0.001, 0.01).onChange(() => render())
    // gui.add(state.material, 'sizeAttenuation').onChange(() => render())
    // gui.add(state.material, 'depthTest').onChange(() => render())
    // gui.add(state.material, 'depthWrite').onChange(() => render())
    // gui.add(state.material, 'vertexColors').onChange(() => render())
    box.open()
    other.open()
  }

  const setupLights = () => {
    state.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 5, 1)
    state.scene.add(directionalLight)
  }

  const clearScene = () => {
    for (const object of state.scene.children.slice()) {
      if (object instanceof THREE.Points) {
        state.scene.remove(object)
      }
    }
    state.positions = []
    state.points = null
    render()
  }

  const startServerStream = (event) => {
    console.log('event: ', event.target)
    clearScene()
    const file = event.target.files[0]
    if (file) {
      const loader = new PCDLoader()
      loader.load(URL.createObjectURL(file), function (points) {
        state.points = points
        state.points.geometry.center()
        state.points.geometry.rotateX(Math.PI)
        state.points.name = file.name
        state.scene.add(state.points)

        render()
      })
    }
  }
  const render = () => {
    if (state.points && state.points.autoRotate) {
      state.points.rotation.x += 0.01
      state.points.rotation.y += 0.01
    }
    state.renderer.render(state.scene, state.camera)
  }

  const handler = (pointList) => {
    if (pointList != null) {
      const newPositions = pointList.flatMap((p) => [p.x, p.y, p.z])
      state.positions = [...state.positions, ...newPositions]
      // Create BufferGeometry and add position attribute

      state.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(state.positions, 3)
      )
      state.geometry.attributes.position.needsUpdate = true // Tell BufferGeometry to update

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

    render()
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
      <div className="canvas">
        <div ref={viewNode}></div>
      </div>
    </React.Fragment>
  )
}

export default ThreePointCloud
