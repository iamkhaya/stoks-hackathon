#!/bin/bash

WORK_DIR=`pwd`

# Function to open a new terminal window and run a command
run_in_new_terminal() {
  osascript <<EOF
    tell application "Terminal"
        do script "cd $WORK_DIR && $1"
    end tell
EOF
}

# Run each TigerBeetle instance in a new terminal window
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_0.tigerbeetle"
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_1.tigerbeetle"
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_2.tigerbeetle"
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_3.tigerbeetle"
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_4.tigerbeetle"
run_in_new_terminal "cd ./data/ && ./tigerbeetle start --addresses=127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003,127.0.0.1:3004,127.0.0.1:3005 --development 0_5.tigerbeetle"

# Run docker-compose in another terminal window
run_in_new_terminal "docker-compose up --build"
