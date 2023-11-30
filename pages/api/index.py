from flask import Flask
import subprocess
import os
import signal
import ngrok
app = Flask(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

STARTED = "[Server thread/INFO] [net.minecraft.server.dedicated.DedicatedServer/]: Done"
STARTING = "ModLauncher running: args"
STOPPING = "[Server thread/INFO] [minecraft/MinecraftServer]: Stopping the server"
STOPPED = "[Server thread/INFO] [xaero.pac.OpenPartiesAndClaims/]: Stopped IO worker!"
ADDRESS = False

SERVER_STATUSES = ["offline", "starting", "online", "stopping", "unknown"] 

# Global variables
SERVER_STATUS = 0
minecraft_process = None

@app.route("/api/status")
def status():
  global SERVER_STATUS
  log_dir = os.path.join(SCRIPT_DIR, "../../KIH SMP/SERVER/logs/latest.log")
  with open(log_dir, "r") as f:
    # Read the lines out as an array
    lines = f.readlines()

    # Filter out lines that have [Server thread/INFO] or [main/INFO] in them
    lines_s = list(filter(lambda x: "[Server thread/INFO]" in x, lines))
    lines_i = list(filter(lambda x: "[main/INFO]" in x, lines))
    lines_server = lines_s + lines_i

    # Check for STARTED, STARTING, STOPPING, STOPPED and return the appropriate status from SERVER_STATUSES
    is_started = False
    is_starting = False
    is_stopping = False
    is_stopped = False

    for line in lines_server:
      if STARTED in line:
        is_started = True
    
    for line in lines_server:
      if STARTING in line:
        is_starting = True
    
    for line in lines_server:
      if STOPPING in line:
        is_stopping = True
    
    for line in lines_server:
      if STOPPED in line:
        is_stopped = True
    
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

    return {
      "status": SERVER_STATUSES[SERVER_STATUS]
    }

@app.route("/api/start")
def start_server():
  global minecraft_process
  global SERVER_STATUS

  if SERVER_STATUS == 0:
    # Run the minecraft_process with "sh", os.path.join(SCRIPT_DIR, "../../KIH SMP/SERVER/run.sh"
    minecraft_process = subprocess.Popen(["sh", "run.sh"], cwd=os.path.join(SCRIPT_DIR, "../../KIH SMP/SERVER/"), stdin=subprocess.PIPE, stderr=subprocess.PIPE, preexec_fn=os.setsid)
    SERVER_STATUS = 1
  return "Starting server..."

@app.route("/api/ip")
def get_ip():
  global SERVER_STATUS
  global ADDRESS
  if (not ADDRESS):
    listener = ngrok.forward(25565, "tcp", authtoken="1k9GncCxk1oLRBG9jq1kI4AdFlL_4BKeuF5hrZKnUGRXXoYJG")
    ADDRESS = listener.url()

    return {"ip": listener.url()}
  else:
    return {"ip": ADDRESS}

@app.route("/api/stop")
def stop_server():
    global minecraft_process
    global SERVER_STATUS
    global ADDRESS
    ngrok.disconnect()
    if SERVER_STATUS == 2:
      # force kill the minecraft_process
      os.killpg(os.getpgid(minecraft_process.pid), signal.SIGTERM)
      ngrok.disconnect()
      SERVER_STATUS = 0
      ADDRESS = False

    return {"message": "Server stop command sent"}

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