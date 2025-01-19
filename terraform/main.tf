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

resource "docker_image" "talktrails" {
  name = "garv1908/talktrails:v1.0"
}

resource "docker_container" "application_container" {
  name  = "frontend"
  image = docker_image.talktrails.image_id
  ports {
    internal = 5173
    external = 3000
  }
}