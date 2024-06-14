from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/python', methods=['POST'])
def handle_maze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400
    
    maze = data.get('maze')
    starting = data.get('starting')
    ending = data.get('ending')


    return jsonify({"status": "success", "message": "Data received"}), 200

if __name__ == '__main__':
    app.run(debug=True)
