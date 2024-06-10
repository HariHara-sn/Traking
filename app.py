from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

users = {}  # Dictionary to store user locations

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('location_update')
def handle_location_update(data):
    user_id = data['user_id']
    users[user_id] = {'lat': data['lat'], 'lng': data['lng']}
    emit('location_update', {'user_id': user_id, 'lat': data['lat'], 'lng': data['lng']}, broadcast=True)

@socketio.on('request_user_location')
def handle_request_user_location(data):
    user_id = data['user_id']
    if user_id in users:
        emit('location_update', {'user_id': user_id, 'lat': users[user_id]['lat'], 'lng': users[user_id]['lng']})

if __name__ == '__main__':
    socketio.run(app, debug=True,host='0.0.0.0')
