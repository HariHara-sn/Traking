from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('location_update')
def handle_location_update(data):
    # Broadcast the location update to all clients
    emit('location_update', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
