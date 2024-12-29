// 获取粒子背景的 Canvas 元素
const canvas = document.querySelector("#particle-bg");

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);

// 设置渲染器尺寸为 .hero 的宽高
const hero = document.querySelector(".hero");
const heroBounds = hero.getBoundingClientRect();
renderer.setSize(heroBounds.width, heroBounds.height);

// 创建场景
const scene = new THREE.Scene();

// 创建摄像机
const camera = new THREE.PerspectiveCamera(75, heroBounds.width / heroBounds.height, 0.1, 1000);
camera.position.z = 300;

// 粒子系统
const particlesCount = 1000; // 减少粒子数量，使其更稀疏
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  // 随机生成球面坐标
  const theta = Math.random() * 2 * Math.PI; // 球面角度
  const phi = Math.acos((Math.random() * 2) - 1); // 球面经度

  // 控制分布：外侧更多，内侧更少
  const distance = Math.pow(Math.random(), 0.5) * 300 + 50; // 距离范围 50 到 350，外侧稠密

  const x = distance * Math.sin(phi) * Math.cos(theta);
  const y = distance * Math.sin(phi) * Math.sin(theta);
  const z = distance * Math.cos(phi);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 1.5, // 粒子尺寸
  color: 0xffffff, // 粒子颜色
  transparent: true,
  opacity: 0.4, // 更淡的粒子
  blending: THREE.AdditiveBlending, // 柔和叠加
});

const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// 动画
function animate() {
  requestAnimationFrame(animate);

  // 缓慢旋转粒子云
  particleSystem.rotation.y += 0.0005; // 更慢的 Y 轴旋转
  particleSystem.rotation.x += 0.0002; // 更慢的 X 轴旋转

  renderer.render(scene, camera);
}

animate();

// 窗口大小调整时重新计算 .hero 的尺寸
window.addEventListener("resize", () => {
  const heroBounds = hero.getBoundingClientRect();
  renderer.setSize(heroBounds.width, heroBounds.height);
  camera.aspect = heroBounds.width / heroBounds.height;
  camera.updateProjectionMatrix();
});