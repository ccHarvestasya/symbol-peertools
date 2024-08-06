#!/bin/bash
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
nohup node $SCRIPT_DIR/dist/rest/server.js "$@" &
