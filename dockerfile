FROM golang:1.19-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/htmx-mfe

# Final stage
FROM alpine:3.16

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/htmx-mfe /app/htmx-mfe

# Copy static files and templates
COPY --from=builder /app/static /app/static
COPY --from=builder /app/templates /app/templates

# Expose port
EXPOSE 8080

# Run the application
CMD ["/app/htmx-mfe"]