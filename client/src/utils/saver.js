import { saveAs } from 'file-saver'

const saverPcd = (positions) => {
  console.log(positions, 'positions')
  // 假设你有一个数组，名为positions，其中包含你的点云数据
  // positions = [x1, y1, z1, x2, y2, z2, ..., xn, yn, zn]

  // 创建PCD头部
  let header = `# .PCD v.7 - Point Cloud Data file format
VERSION .7
FIELDS x y z
SIZE 4 4 4
TYPE F F F
COUNT 1 1 1
WIDTH ${positions.length / 3}
HEIGHT 1
VIEWPOINT 0 0 0 1 0 0 0
POINTS ${positions.length / 3}
DATA ascii
`

  // 将点云数据转换为PCD格式
  for (let i = 0; i < positions.length; i += 3) {
    let x = Number(positions[i]).toFixed(6)
    let y = Number(positions[i + 1]).toFixed(6)
    let z = Number(positions[i + 2]).toFixed(6)
    header += `${x} ${y} ${z}\n`
  }

  // 创建Blob对象
  let blob = new Blob([header], { type: 'text/plain;charset=utf-8' })
  console.log(blob, 'blob')
  // 使用FileSaver保存文件
  saveAs(blob, './output.pcd')
}

export default saverPcd
