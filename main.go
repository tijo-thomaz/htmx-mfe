package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Middleware for Logging Requests
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		duration := time.Since(start)

		log.Info().
			Str("method", r.Method).
			Str("url", r.URL.Path).
			Dur("duration", duration).
			Msg("Handled request")
	})
}

// CORS Middleware (Handles Preflight)
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization")

		// Handle preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Fetch Data Handler (Handles Multiple Calls)
func fetchDataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	log.Info().Msg("Fetch-data endpoint hit!")
	time.Sleep(1 * time.Second) // Simulate processing delay

	fmt.Fprintf(w, `<p>HTMX Data Loaded at: %s</p>`, time.Now().Format(time.RFC1123))
}

// HTMX Main Page Handler
func htmxHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	host := r.Host
	protocol := "http"

	// For Cloud Run, ensure HTTPS
	if os.Getenv("CLOUD_RUN_SERVICE") != "" {
		host = os.Getenv("CLOUD_RUN_SERVICE") + ".run.app"
		protocol = "https"
	}

	fmt.Fprintf(w, `
        <div>
            <h2>HTMX MFE from Cloud Run</h2>
            <button id="loadDataBtn" hx-get="%s://%s/fetch-data"
                    hx-trigger="click"
                    hx-target="#data"
                    hx-swap="innerHTML">
                Click Me
            </button>
            <div id="data"></div>
            
        </div>
    `, protocol, host)
}

// Start Server
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	mux := http.NewServeMux()
	mux.HandleFunc("/", htmxHandler)
	mux.HandleFunc("/fetch-data", fetchDataHandler)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: requestLogger(corsMiddleware(mux)),
	}

	serviceURL := "http://localhost:" + port
	if os.Getenv("CLOUD_RUN_SERVICE") != "" {
		serviceURL = "https://" + os.Getenv("CLOUD_RUN_SERVICE") + ".run.app"
	}

	log.Info().Str("serviceURL", serviceURL).Msg("Server is running")

	if err := server.ListenAndServe(); err != nil {
		log.Fatal().Err(err).Msg("Failed to start server")
	}
}
