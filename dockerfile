# Use an official Go image
FROM golang:1.24.1-alpine AS builder

WORKDIR /app

# Copy go.mod and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the Go app
RUN go build -o htmx-mfe

# Create a minimal final image
FROM alpine:latest
WORKDIR /root/

# Copy the built binary from the builder stage
COPY --from=builder /app/htmx-mfe .

# Set execution permissions (fixes "Permission Denied" errors)
RUN chmod +x /root/htmx-mfe

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Set PORT environment variable (Cloud Run will override this)
ENV PORT=8080

# Run the application
CMD ["./htmx-mfe"]
