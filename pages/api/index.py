from flask import Flask
import subprocess
import os
import signal
import ngrok
import re

app = Flask(__name__)

# Global variables
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

AUTH_TOKEN = "1k9GncCxk1oLRBG9jq1kI4AdFlL_4BKeuF5hrZKnUGRXXoYJG"
MAP_TOKEN = "2ZIMlZ5cneXXYxq6qSAipH9kg9r_5PUNQ7betkxS7NS4gmqiu"
SERVER_DIRECTORY = os.path.join(SCRIPT_DIR, "../../ALL_SERVERS/SERVER/")
START_FILE = "run.sh"
SERVER_STATUS = 0
ADDRESS = False
MAP_ADDRESS = False
minecraft_process = False

STARTED = "[Server thread/INFO] [net.minecraft.server.dedicated.DedicatedServer/]: Done"
STARTING = "ModLauncher running: args"
STOPPING = "[Server thread/INFO] [minecraft/MinecraftServer]: Stopping the server"
STOPPED = "[Server thread/INFO] [xaero.pac.OpenPartiesAndClaims/]: Stopped IO worker!"
CRASHED = "[Server thread/INFO] [minecraft/MinecraftServer]: Stopping server due to crash"
SERVER_STATUSES = ["offline", "starting", "online", "stopping", "crashed"]

@app.route("/api/status")
def status():
    global SERVER_STATUS
    log_dir = os.path.join(SCRIPT_DIR, SERVER_DIRECTORY, "logs/latest.log")
    
    try:
        with open(log_dir, "r") as f:
            # Read the lines out as an array
            lines = f.readlines()

            # Filter out lines that have [Server thread/INFO] or [main/INFO] in them
            lines_s = list(filter(lambda x: "[Server thread/INFO]" in x, lines))
            lines_i = list(filter(lambda x: "[main/INFO]" in x, lines))
            lines_server = lines_s + lines_i

            # Check for STARTED, STARTING, STOPPING, STOPPED and return the appropriate status from SERVER_STATUSES
            is_started = any(STARTED in line for line in lines_server)
            is_starting = any(STARTING in line for line in lines_server)
            is_stopping = any(STOPPING in line for line in lines_server)
            is_stopped = any(STOPPED in line for line in lines_server)

            if is_stopped:
                SERVER_STATUS = 0
            elif is_stopping:
                SERVER_STATUS = 3
            elif is_started:
                SERVER_STATUS = 2
            elif is_starting:
                SERVER_STATUS = 1
            else:
                SERVER_STATUS = 4

            return {"status": SERVER_STATUSES[SERVER_STATUS]}
    except Exception as e:
        print("Error:", e)
        SERVER_STATUS = 0
        return {"status": SERVER_STATUSES[SERVER_STATUS]}

@app.route("/api/start")
def start_server():
    global minecraft_process
    global SERVER_STATUS

    if not minecraft_process:
        # Run the minecraft_process with "sh", os.path.join(SCRIPT_DIR, "../../KIH SMP/SERVER/run.sh"
        minecraft_process = subprocess.Popen(["sh", START_FILE], cwd=SERVER_DIRECTORY, stdin=subprocess.PIPE, stderr=subprocess.PIPE, preexec_fn=os.setsid)
        SERVER_STATUS = 1

    return "Starting server..."

@app.route("/api/ip")
def get_ip():
    global SERVER_STATUS
    global ADDRESS

    if not ADDRESS:
        listener = ngrok.forward(25565, "tcp", authtoken=AUTH_TOKEN)
        ADDRESS = listener.url()
        return {"ip": listener.url()}
    else:
        return {"ip": ADDRESS}

@app.route("/api/map")
def get_map():
    global SERVER_STATUS
    global MAP_ADDRESS

    if not MAP_ADDRESS:
        listener = ngrok.forward(8123, "http", authtoken=MAP_TOKEN)
        MAP_ADDRESS = listener.url()
        return {"map": listener.url()}
    else:
        return {"map": MAP_ADDRESS}

@app.route("/api/stop")
def stop_server():
    global minecraft_process
    global SERVER_STATUS
    global ADDRESS
    global MAP_ADDRESS

    ngrok.disconnect()

    if SERVER_STATUS == 2:
        # force kill the minecraft_process
        os.killpg(os.getpgid(minecraft_process.pid), signal.SIGTERM)
        minecraft_process = False
        ngrok.disconnect()
        SERVER_STATUS = 0
        ADDRESS = False
        MAP_ADDRESS = False

    return {"message": "Server stop command sent"}

@app.route("/api/players")
def get_online_players():
    log_dir = os.path.join(SCRIPT_DIR, SERVER_DIRECTORY, "logs/latest.log")
    
    try:
        with open(log_dir, "r") as f:
            # Read the lines out as an array
            lines = f.readlines()

            # Define regular expressions for player join and leave messages eg. 
            join_pattern = re.compile(r"(.*) joined the game")
            leave_pattern = re.compile(r"(.*) left the game")
            
            online_players = set()

            for line in lines:
                join_match = join_pattern.search(line)
                leave_match = leave_pattern.search(line)

                if join_match:
                    online_players.add(join_match.group(1))
                elif leave_match:
                    online_players.remove(leave_match.group(1))
            
            return {"players": list(online_players)}

    except FileNotFoundError:
        print(f"Error: Log file not found at {log_dir}")
        return {"players": []}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"players": []}

# When the program ends run this code
def exit_handler():
    global minecraft_process

    # force kill the minecraft_process
    try:
        os.killpg(os.getpgid(minecraft_process.pid), signal.SIGTERM)
    except:
        pass

    print("Killing processes...")

# Register the exit handler
import atexit
atexit.register(exit_handler)
