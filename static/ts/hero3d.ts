// 3D Hero Avatar using Three.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Hero3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock: THREE.Clock;
  private container: HTMLElement;
  private loadingElement: HTMLElement;
  private animationFrame: number | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    // Create loading indicator
    this.loadingElement = document.createElement("div");
    this.loadingElement.className = "loading-indicator";
    this.loadingElement.innerHTML =
      '<div class="loading-spinner"></div><div class="loading-text">Loading 3D Model...</div>';
    this.loadingElement.style.position = "absolute";
    this.loadingElement.style.top = "50%";
    this.loadingElement.style.left = "50%";
    this.loadingElement.style.transform = "translate(-50%, -50%)";
    this.loadingElement.style.textAlign = "center";
    this.loadingElement.style.color = "#2563eb";
    this.loadingElement.style.fontWeight = "bold";
    this.container.appendChild(this.loadingElement);

    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfef9c3);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.camera.position.y = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Add lights
    this.setupLights();

    // Load model
    this.loadModel();

    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this));
  }
  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();

    loader.load(
      "/static/models/avatar.glb",
      (gltf) => {
        this.loadingElement.style.display = "none";

        this.model = gltf.scene;
        this.model.scale.set(1.5, 1.5, 1.5);
        this.model.position.y = -1;
        this.scene.add(this.model);

        // Set up animations if they exist
        if (gltf.animations && gltf.animations.length) {
          this.mixer = new THREE.AnimationMixer(this.model);
          const action = this.mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Start animation loop
        this.animate();
      },
      (xhr) => {
        const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
        const loadingText = this.loadingElement.querySelector(".loading-text");
        if (loadingText) {
          loadingText.textContent = `Loading 3D Model... ${percent}%`;
        }
      },
      (error) => {
        console.error("Error loading GLB:", error);
        this.loadingElement.innerHTML =
          '<div style="color: #ef4444; padding: 20px; background: rgba(254, 226, 226, 0.8); border-radius: 8px;"><p>Error loading 3D model</p></div>';

        // Fall back to a simple cube
        this.createFallbackCube();
      }
    );
  }

  private createFallbackCube(): void {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    // Animate the cube
    this.animate = () => {
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };

    this.animate();
  }

  private animate(): void {
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));

    // Update the animation mixer on each frame
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    // Add subtle floating animation to the model if it exists
    if (this.model) {
      this.model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
      this.model.rotation.y = Math.sin(Date.now() * 0.0005) * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.container) return;

    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  public dispose(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }

    window.removeEventListener("resize", this.handleResize.bind(this));

    // Dispose of Three.js resources
    this.renderer.dispose();

    // Remove the canvas from the DOM
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// Initialize the hero avatar when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("hero-avatar-container");
  if (container) {
    new Hero3D("hero-avatar-container");
  }
});

export default Hero3D;
