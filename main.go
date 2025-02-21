package main

import (
	"fmt"
	"net/http"
)

func htmxHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	fmt.Fprint(w, `
        <div>
            <h2>HTMX MFE Loaded via Go</h2>
            <button hx-get="/fetch-data" hx-trigger="click" hx-target="#data">Click Me</button>
            <div id="data"></div>
            <script src="https://unpkg.com/htmx.org@1.9.5"></script>
        </div>
    `)
}

func fetchDataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow CORS
	fmt.Fprint(w, `<p>HTMX Data Fetched from Go Server!</p>`)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", htmxHandler)
	mux.HandleFunc("/fetch-data", fetchDataHandler)

	fmt.Println("HTMX MFE running on http://localhost:3001")

	http.ListenAndServe(":3001", corsMiddleware(mux))
}
