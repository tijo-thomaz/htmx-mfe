// Hero Avatar using Three.js with GLB model
document.addEventListener("DOMContentLoaded", function () {
  // Check if THREE is available
  if (typeof THREE === "undefined") {
    console.error("THREE is not defined");
    return;
  }

  // Check if the avatar container exists
  const avatarContainer = document.getElementById("hero-avatar");
  if (!avatarContainer) return;

  // Set up Three.js scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfef9c3); // Light yellow background to match theme

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    avatarContainer.clientWidth / avatarContainer.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 1;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  avatarContainer.appendChild(renderer.domElement);

  // Responsive canvas
  window.addEventListener("resize", () => {
    camera.aspect = avatarContainer.clientWidth / avatarContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Add a subtle fill light from the opposite direction
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);

  // Add a ground plane to receive shadows (optional)
  const groundGeometry = new THREE.PlaneGeometry(10, 10);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef9c3,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.5,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Loading manager to track progress
  const loadingManager = new THREE.LoadingManager();

  // Loading indicator
  const loadingElement = document.createElement("div");
  loadingElement.className = "loading-indicator";
  loadingElement.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Loading 3D Model...</div>
  `;
  avatarContainer.appendChild(loadingElement);

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = ((itemsLoaded / itemsTotal) * 100).toFixed(0);
    loadingElement.querySelector(
      ".loading-text"
    ).textContent = `Loading 3D Model... ${progress}%`;
  };

  loadingManager.onLoad = () => {
    loadingElement.style.display = "none";
  };

  // GLB Loader
  const loader = new THREE.GLTFLoader(loadingManager);

  // Model and animation variables
  let model;
  let mixer;
  const clock = new THREE.Clock();

  // Load the GLB file
  loader.load(
    "/static/models/avatar.glb",
    (gltf) => {
      model = gltf.scene;

      // Configure the model
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      // Scale and position the model appropriately
      model.scale.set(1.5, 1.5, 1.5);
      model.position.y = -2; // Adjust based on your model

      scene.add(model);

      // Set up animations if they exist
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);

        // Play the first animation by default, or choose a specific one
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        // Optional: You can play multiple animations or specific ones
        // gltf.animations.forEach((clip) => {
        //   if (clip.name === 'Wave' || clip.name === 'Idle') {
        //     mixer.clipAction(clip).play();
        //   }
        // });
      }
    },
    // Progress callback
    (xhr) => {
      // Progress is handled by the loading manager
    },
    // Error callback
    (error) => {
      console.error("An error happened loading the GLB model:", error);
      loadingElement.innerHTML = `
      <div class="loading-error">
        <p>Error loading 3D model</p>
        <small>${error.message}</small>
      </div>
    `;
    }
  );

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Update the animation mixer on each frame
    if (mixer) {
      mixer.update(clock.getDelta());
    }

    // Add subtle floating animation to the model if it exists
    if (model) {
      model.position.y = -2 + Math.sin(Date.now() * 0.001) * 0.1;
      model.rotation.y = Math.sin(Date.now() * 0.0005) * 0.5;
    }

    renderer.render(scene, camera);
  };

  animate();

  // Add interactivity - model follows cursor
  avatarContainer.addEventListener("mousemove", (event) => {
    if (!model) return;

    const rect = avatarContainer.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / avatarContainer.clientWidth) * 2 - 1;
    const y =
      -((event.clientY - rect.top) / avatarContainer.clientHeight) * 2 + 1;

    gsap.to(model.rotation, {
      x: y * 0.3,
      y: x * 0.5,
      duration: 1,
      ease: "power2.out",
    });
  });

  // Reset rotation when mouse leaves
  avatarContainer.addEventListener("mouseleave", () => {
    if (!model) return;

    gsap.to(model.rotation, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    });
  });
});
