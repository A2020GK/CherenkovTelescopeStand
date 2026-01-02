from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# import socketio

# sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[]) 
# socket_app = socketio.ASGIApp(sio)

app = FastAPI(title="Cherenkov Telescope Stand API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/socket.io", socket_app)

# ip_to_sid = {}

# @sio.on("connect")
# async def connect(sid, t):
#     ip = t["asgi.scope"]["client"][0]
#     ip_to_sid[ip] = sid
    
#     print(f"CONNECT\t{ip}\t{sid}")

    
# @sio.on("disconnect")
# async def disconnect(sid, *args):
#     try:
#         ip = (list(ip_to_sid.keys())[list(ip_to_sid.values()).index(sid)]) # Get IP by sid
#         del ip_to_sid[ip]
#         print(f"DISCONNECT\t{ip}\t{sid}")
#     except:
#         pass
    
from .settings import *
from .event import *