// Basic implementation of the Three.js avatar
// This can be expanded later with more complex 3D models

document.addEventListener("DOMContentLoaded", () => {
  // Check if the avatar container exists
  const container = document.querySelector(".avatar-container");
  if (!container) return;

  // Only proceed if Three.js is loaded
  if (typeof THREE === "undefined") {
    console.warn("Three.js not loaded. Using static avatar instead.");
    return;
  }

  // Remove any existing content
  container.innerHTML = "";

  // Set up the scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Create a simple avatar (a colorful sphere for now)
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.3,
    roughness: 0.4,
  });

  const avatar = new THREE.Mesh(geometry, material);
  scene.add(avatar);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Position camera
  camera.position.z = 15;

  // Make avatar interactive
  container.addEventListener("mousemove", (event) => {
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    gsap.to(avatar.rotation, {
      x: y * 0.5,
      y: x * 0.5,
      duration: 0.5,
    });
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Add subtle idle animation
    avatar.rotation.y += 0.005;

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
});
