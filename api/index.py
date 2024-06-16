from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

class Maze:
    def __init__(self, maze, start_position, end_position):
        self.maze = maze
        self.start_position = start_position
        self.end_position = end_position
        self.maze_width = maze.shape[1]
        self.maze_height = maze.shape[0]

class Agent:
    def __init__(self, maze, learning_rate=0.1, discount_factor=0.9, exploration_start=1.0, exploration_end=0.01, epochs=100):
        self.q_table = np.zeros((maze.maze_height, maze.maze_width, 4))
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_start = exploration_start
        self.exploration_end = exploration_end
        self.epochs = epochs

    def get_exploration_rate(self, current_episode):
        exploration_rate = self.exploration_start * (self.exploration_end / self.exploration_start) ** (current_episode / self.epochs)
        return exploration_rate

    def get_action(self, state, current_episode):
        exploration_rate = self.get_exploration_rate(current_episode)
        if np.random.rand() < exploration_rate:
            return np.random.randint(4)
        else:
            return np.argmax(self.q_table[state])

    def update_q_table(self, state, action, next_state, reward):
        best_next_action = np.argmax(self.q_table[next_state])
        current_q_value = self.q_table[state][action]
        new_q_value = current_q_value + self.learning_rate * (reward + self.discount_factor * self.q_table[next_state][best_next_action] - current_q_value)
        self.q_table[state][action] = new_q_value

def finish_episode(agent, maze, current_episode, train=True):
    current_state = maze.start_position
    is_done = False
    episode_reward = 0
    episode_step = 0
    path = [current_state]

    while not is_done:
        action = agent.get_action(current_state, current_episode)
        next_state = (current_state[0] + actions[action][0], current_state[1] + actions[action][1])
        if next_state[0] < 0 or next_state[0] >= maze.maze_height or next_state[1] < 0 or next_state[1] >= maze.maze_width or maze.maze[next_state[0]][next_state[1]] == 1:
            reward = wall_penalty
            next_state = current_state
        elif next_state == maze.end_position:
            path.append(next_state)
            reward = goal_reward
            is_done = True
        else:
            path.append(next_state)
            reward = step_penalty

        episode_reward += reward
        episode_step += 1

        if train:
            agent.update_q_table(current_state, action, next_state, reward)

        current_state = next_state

    return episode_reward, episode_step, path

def test_agent(agent, maze, epochs=1):
    episode_reward, episode_step, path = finish_episode(agent, maze, epochs, train=False)
    return episode_step, episode_reward, path

def train_agent(agent, maze, epochs=100):
    for episode in range(epochs):
        finish_episode(agent, maze, episode, train=True)

def setlog(path):
    global log
    log = path

def getlog():
    return log

actions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
log = []

app = Flask(__name__)
CORS(app)

@app.route('/api/store', methods=['POST'])
def handle_maze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    global maze, agent, goal_reward, wall_penalty, step_penalty

    maze_layout = np.array(data.get('maze'))
    starting = tuple(data.get('starting'))
    ending = tuple(data.get('ending'))
    goal_reward = data.get('reward')
    wall_penalty = data.get('wallpenalty')
    step_penalty = data.get('steppenalty')

    maze = Maze(maze_layout, starting, ending)
    agent = Agent(maze)


    return jsonify({"status": "success", 
                    "maze_layout": maze_layout.tolist(),
                    "starting": starting,
                    "ending": ending,
                    "goal_reward": goal_reward,
                    "wall_penalty": wall_penalty,
                    "step_penalty": step_penalty,
                    }), 200
    
@app.route('/api/train', methods=['POST'])
def train_maze():
    global agent, maze
    train_agent(agent, maze, epochs=30)
    return jsonify({"status": "success", "message": "Training completed"}), 200

@app.route('/api/test', methods=['POST'])
def test_maze():
    global agent, maze
    steps, reward, path = test_agent(agent, maze, epochs=1)
    setlog(path)
    return jsonify({"status": "success", "message": "Test completed", "steps": steps, "reward": reward}), 200

@app.route('/api/getlogs', methods=['GET'])
def get_log():
    logs = getlog()
    return jsonify({"status": "success", "log": logs}), 200

if __name__ == '__main__':
    app.run(debug=True)
