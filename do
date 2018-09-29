#!/usr/bin/env bash

project="naans_api"

if [ -f "docker/$1.yml" ]; then
  docker-compose -p "${project}_$1" -f "docker/default.yml" -f "docker/$1.yml" up --abort-on-container-exit --exit-code-from app
else
  CMD="$@" docker-compose -p "${project}_default" -f "docker/default.yml" up --abort-on-container-exit --exit-code-from app
fi
