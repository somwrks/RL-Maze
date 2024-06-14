from flask import Flask, request, jsonify

app = Flask(__name__)
@app.route('/api/python', methods=['POST'])
def handle_maze():
    data = request.get_json()  # Get the JSON data from the request
    if not data:
        return jsonify({"error": "Invalid input"}), 400
    
    maze = data.get('maze')
    starting = data.get('starting')
    ending = data.get('ending')

    print("Maze:", maze)
    print("Starting Point:", starting)
    print("Ending Point:", ending)

    return jsonify({"status": "success", "message": "Data received"}), 200

if __name__ == '__main__':
    app.run(debug=True)
