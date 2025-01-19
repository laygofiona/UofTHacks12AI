terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host = "npipe:////.//pipe//docker_engine"
}

resource "docker_image" "application_image" {
  name = "application"
  build {
    context    = "${path.module}/../"
    dockerfile = "${path.module}/../Dockerfile"
  }
}

resource "docker_container" "application_container" {
  name  = "frontend"
  image = docker_image.application_image.image_id
  ports {
    internal = 5173
    external = 3000
  }
}