package main

import (
	"fmt"
	"html/template"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/tijo-thomaz/htmx-mfe/handlers"
	"github.com/tijo-thomaz/htmx-mfe/models"
)

var templateHandler *handlers.TemplateHandler

func init() {
	// Initialize the template handler
	templateHandler = handlers.NewTemplateHandler("templates")
	err := templateHandler.LoadTemplates()
	if err != nil {
		panic(fmt.Sprintf("Failed to load templates: %v", err))
	}

	// Seed the random number generator
	rand.Seed(time.Now().UnixNano())
}

func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		fmt.Printf("[HTMX-MFE] %s %s (%s)\n", r.Method, r.URL.Path, time.Since(start))
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func renderIndex(w http.ResponseWriter, r *http.Request) {
	// If not the root path, return 404
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	// Create the page data
	data := models.NewPortfolioData()

	// Parse all templates together
	tmpl, err := template.New("index.html").Funcs(template.FuncMap{
		"safeHTML": func(s string) template.HTML {
			return template.HTML(s)
		},
	}).ParseFiles(
		"templates/layouts/base.html",
		"templates/pattern.html",
		"templates/partials/hero.html",
		"templates/partials/arsenal.html",
		"templates/partials/origin.html",
		"templates/partials/contact.html",
		"templates/partials/terminal.html",
	)

	if err != nil {
		http.Error(w, "Template error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Execute the base template
	err = tmpl.ExecuteTemplate(w, "base.html", data)
	if err != nil {
		http.Error(w, "Template execution error: "+err.Error(), http.StatusInternalServerError)
	}
}

func fetchUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, `{"name": "Tijo", "role": "HeroDev"}`)
}

func postEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("MFE Event Received")
	w.WriteHeader(http.StatusNoContent)
}

func devCapsule(w http.ResponseWriter, r *http.Request) {
	capsules := []string{
		`<div class='p-6 transform border-4 border-gray-900 rounded-lg project-card bg-cyan-900 shadow-comic rotate-1'>
			<div class="flex items-center justify-between mb-4 comic-header">
				<div class="px-4 py-1 font-bold text-gray-900 transform -translate-x-2 -translate-y-8 bg-yellow-400 rounded-full year-badge -rotate-3">
					2022
				</div>
				<div class="flex space-x-1 comic-dots">
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
				</div>
			</div>
			<h3 class='mb-2 text-xl font-bold text-white'>Frontend Architecture</h3>
			<p class='text-cyan-300'>Designed and implemented scalable component systems using React and Vue</p>
			<div class='flex flex-wrap gap-2 mt-4'>
				<span class='px-2 py-1 text-xs rounded bg-cyan-800 text-cyan-200'>React</span>
				<span class='px-2 py-1 text-xs rounded bg-cyan-800 text-cyan-200'>Vue</span>
				<span class='px-2 py-1 text-xs rounded bg-cyan-800 text-cyan-200'>TypeScript</span>
			</div>
		</div>`,
		`<div class='p-6 transform bg-purple-900 border-4 border-gray-900 rounded-lg project-card shadow-comic -rotate-2'>
			<div class="flex items-center justify-between mb-4 comic-header">
				<div class="px-4 py-1 font-bold text-gray-900 transform -translate-x-2 -translate-y-8 bg-yellow-400 rounded-full year-badge -rotate-3">
					2021
				</div>
				<div class="flex space-x-1 comic-dots">
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
				</div>
			</div>
			<h3 class='mb-2 text-xl font-bold text-white'>Performance Optimization</h3>
			<p class='text-purple-300'>Improved application load times by 60% through code splitting and lazy loading</p>
			<div class='flex flex-wrap gap-2 mt-4'>
				<span class='px-2 py-1 text-xs text-purple-200 bg-purple-800 rounded'>Webpack</span>
				<span class='px-2 py-1 text-xs text-purple-200 bg-purple-800 rounded'>Lighthouse</span>
				<span class='px-2 py-1 text-xs text-purple-200 bg-purple-800 rounded'>PWA</span>
			</div>
		</div>`,
		`<div class='p-6 transform bg-indigo-900 border-4 border-gray-900 rounded-lg project-card shadow-comic rotate-2'>
			<div class="flex items-center justify-between mb-4 comic-header">
				<div class="px-4 py-1 font-bold text-gray-900 transform -translate-x-2 -translate-y-8 bg-yellow-400 rounded-full year-badge -rotate-3">
					2020
				</div>
				<div class="flex space-x-1 comic-dots">
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
				</div>
			</div>
			<h3 class='mb-2 text-xl font-bold text-white'>Micro-Frontend Architecture</h3>
			<p class='text-indigo-300'>Led the transition to a micro-frontend architecture for a large-scale application</p>
			<div class='flex flex-wrap gap-2 mt-4'>
				<span class='px-2 py-1 text-xs text-indigo-200 bg-indigo-800 rounded'>Module Federation</span>
				<span class='px-2 py-1 text-xs text-indigo-200 bg-indigo-800 rounded'>Single-SPA</span>
				<span class='px-2 py-1 text-xs text-indigo-200 bg-indigo-800 rounded'>HTMX</span>
			</div>
		</div>`,
		`<div class='p-6 transform bg-green-900 border-4 border-gray-900 rounded-lg project-card shadow-comic -rotate-1'>
			<div class="flex items-center justify-between mb-4 comic-header">
				<div class="px-4 py-1 font-bold text-gray-900 transform -translate-x-2 -translate-y-8 bg-yellow-400 rounded-full year-badge -rotate-3">
					2019
				</div>
				<div class="flex space-x-1 comic-dots">
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
					<span class="w-3 h-3 bg-gray-200 rounded-full"></span>
				</div>
			</div>
			<h3 class='mb-2 text-xl font-bold text-white'>Mentorship & Leadership</h3>
			<p class='text-green-300'>Mentored junior developers and led technical interviews for the frontend team</p>
			<div class='flex flex-wrap gap-2 mt-4'>
				<span class='px-2 py-1 text-xs text-green-200 bg-green-800 rounded'>Team Leadership</span>
				<span class='px-2 py-1 text-xs text-green-200 bg-green-800 rounded'>Code Reviews</span>
				<span class='px-2 py-1 text-xs text-green-200 bg-green-800 rounded'>Technical Writing</span>
			</div>
		</div>`,
	}

	// Return a random capsule
	randomCapsule := capsules[rand.Intn(len(capsules))]
	fmt.Fprint(w, randomCapsule)
}

func submitContact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	name := r.FormValue("name")
	email := r.FormValue("email")
	message := r.FormValue("message")

	// In a real application, you would send an email or store in a database
	// For now, just log the submission
	fmt.Printf("Contact form submission: %s (%s): %s\n", name, email, message)

	// Return a success message that HTMX can swap into the page
	fmt.Fprint(w, `
		<div id="form-response" class="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500" role="alert">
			<p class="font-bold">Message Sent!</p>
			<p>Thank you for reaching out. I'll get back to you soon.</p>
		</div>
	`)
}

func heroAvatarFragment(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, `
    <div id="hero-avatar-container" class="w-full md:w-1/2 h-[400px] rounded-xl overflow-hidden shadow-xl border-4 border-gray-900 transform rotate-2">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.150.1/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/loaders/GLTFLoader.min.js"></script>
        <script>
            // Hero Avatar using Three.js with GLB model
            (function() {
                // Check if the avatar container exists
                const avatarContainer = document.getElementById('hero-avatar-container');
                if (!avatarContainer) return;

                // Set up Three.js scene
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xfef9c3);

                // Camera
                const camera = new THREE.PerspectiveCamera(75, avatarContainer.clientWidth / avatarContainer.clientHeight, 0.1, 1000);
                camera.position.z = 5;
                camera.position.y = 1;

                // Renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
                avatarContainer.appendChild(renderer.domElement);

                // Lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(1, 1, 1);
                scene.add(directionalLight);

                // Loading indicator
                const loadingElement = document.createElement('div');
                loadingElement.className = 'loading-indicator';
                loadingElement.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Loading 3D Model...</div>';
                loadingElement.style.position = 'absolute';
                loadingElement.style.top = '50%';
                loadingElement.style.left = '50%';
                loadingElement.style.transform = 'translate(-50%, -50%)';
                loadingElement.style.textAlign = 'center';
                loadingElement.style.color = '#2563eb';
                loadingElement.style.fontWeight = 'bold';
                avatarContainer.appendChild(loadingElement);

                // Try to load GLB model
                if (typeof THREE.GLTFLoader === 'function') {
                    const loader = new THREE.GLTFLoader();
                    let model;
                    let mixer;
                    const clock = new THREE.Clock();
                    
                    loader.load('/static/models/avatar.glb', 
                        // Success callback
                        (gltf) => {
                            loadingElement.style.display = 'none';
                            
                            model = gltf.scene;
                            model.scale.set(1.5, 1.5, 1.5);
                            model.position.y = -1;
                            scene.add(model);
                            
                            // Set up animations if they exist
                            if (gltf.animations && gltf.animations.length) {
                                mixer = new THREE.AnimationMixer(model);
                                const action = mixer.clipAction(gltf.animations[0]);
                                action.play();
                            }
                        },
                        // Progress callback
                        (xhr) => {
                            const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                            loadingElement.querySelector('.loading-text').textContent = 'Loading 3D Model... ' + percent + '%';
                        },
                        // Error callback
                        (error) => {
                            console.error('Error loading GLB:', error);
                            loadingElement.innerHTML = '<div style="color: #ef4444; padding: 20px; background: rgba(254, 226, 226, 0.8); border-radius: 8px;"><p>Error loading 3D model</p></div>';
                            
                            // Fall back to a simple cube
                            const geometry = new THREE.BoxGeometry(2, 2, 2);
                            const material = new THREE.MeshStandardMaterial({ color: 0x2563eb });
                            const cube = new THREE.Mesh(geometry, material);
                            scene.add(cube);
                        }
                    );
                    
                    // Animation loop
                    function animate() {
                        requestAnimationFrame(animate);
                        
                        // Update the animation mixer on each frame
                        if (mixer) {
                            mixer.update(clock.getDelta());
                        }
                        
                        // Add subtle floating animation to the model if it exists
                        if (model) {
                            model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
                            model.rotation.y = Math.sin(Date.now() * 0.0005) * 0.5;
                        }
                        
                        renderer.render(scene, camera);
                    }
                    
                    animate();
                } else {
                    // Fallback if GLTFLoader is not available
                    loadingElement.style.display = 'none';
                    
                    const geometry = new THREE.BoxGeometry(2, 2, 2);
                    const material = new THREE.MeshStandardMaterial({ color: 0x2563eb });
                    const cube = new THREE.Mesh(geometry, material);
                    scene.add(cube);
                    
                    function animate() {
                        requestAnimationFrame(animate);
                        cube.rotation.x += 0.01;
                        cube.rotation.y += 0.01;
                        renderer.render(scene, camera);
                    }
                    
                    animate();
                }
                
                // Handle window resize
                window.addEventListener('resize', () => {
                    camera.aspect = avatarContainer.clientWidth / avatarContainer.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
                });
            })();
        </script>
    </div>
    `)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", renderIndex)
	mux.HandleFunc("/api/user", fetchUser)
	mux.HandleFunc("/api/events", postEvent)
	mux.HandleFunc("/fragment/devcapsule", devCapsule)
	mux.HandleFunc("/api/contact", submitContact)
	mux.HandleFunc("/fragment/hero-avatar", heroAvatarFragment)

	fs := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	handler := requestLogger(corsMiddleware(mux))

	fmt.Println("🌐 HTMX-MFE running at http://localhost:" + port)
	http.ListenAndServe(":"+port, handler)
}
