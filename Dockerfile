# Use an official lightweight Linux distribution as base
FROM ubuntu:22.04

# Set environment variables for non-interactive builds
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create a working directory inside the container
WORKDIR /app

# Copy the source code and CMakeLists.txt to the container
COPY ./backend /app/backend
COPY ./CMakeLists.txt /app

# Build the C++ project
RUN cmake . && make

# Expose the port if the application runs as a server
EXPOSE 8080

# Set the default command to run your application
CMD ["./my_app"]
