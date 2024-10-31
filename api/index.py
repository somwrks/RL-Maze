from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg') 


import numpy as np
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt

from io import BytesIO
import base64

# Add these global variable declarations after the imports
actions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
log = []
text = []
text_logs = []
maze = None
agent = None
train_epochs = None
test_epochs = None
maze_layout = None
starting = None
ending = None
goal_reward = None
wall_penalty = None
step_penalty = None
app = Flask(__name__)
CORS(app)
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
    global text_logs, maze_layout, starting, ending 
    if not train:
        text_logs.append(f"Starting episode {current_episode + 1} at position {current_state}")
        text_logs.append(f"Maze setup :\nMaze layout : {maze_layout.tolist()}\nStarting point : {starting}\nEnding point : {ending}\nWall Penalty : {wall_penalty}\nStep Penalty : {step_penalty}\nGoal Reward : {goal_reward}\nTrain EPOCH : {train_epochs}\nTest EPOCH : {test_epochs}")
        

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
            if not train:
                text_logs.append(f"Reached goal at position {next_state} with reward {reward}")
        else:
            path.append(next_state)
            reward = step_penalty
            if not train:
                text_logs.append(f"Moved to position {next_state} with reward {reward}")

        episode_reward += reward
        episode_step += 1

        if train:
            agent.update_q_table(current_state, action, next_state, reward)

        current_state = next_state

    if  not train :
        setText(text_logs)
    return episode_reward, episode_step, path

def test_agent(agent, maze, epochs):
    episode_reward, episode_step, path = finish_episode(agent, maze, epochs, train=False)
    plt.figure(figsize=(5,5))
    plt.imshow(maze.maze, cmap='gray')
    
    plt.text(maze.start_position[0], maze.start_position[1], 'S', ha="center", va='center',color='red',fontsize=20)
    plt.text(maze.end_position[0], maze.end_position[1], 'G', ha="center", va='center',color='green',fontsize=20)
    
    for position in path:
        plt.text(position[0], position[1],"#",va="center",color="blue",fontsize=20)
    
    plt.xticks([])
    plt.yticks([])
    plt.grid(color='black',linewidth=2)
    plt.savefig('test_temp.png', bbox_inches='tight')  # Save instead of show
    plt.close()  # Close the figure
    return episode_step, episode_reward, path

def train_agent(agent, maze, epochs):
    episode_rewards = []
    episode_steps = []
    
    for episode in range(epochs):
        episode_reward, episode_step, path = finish_episode(agent, maze, episode, train=True)
        episode_rewards.append(episode_reward)
        episode_steps.append(episode_step)
    
    plt.figure(figsize=(10,5))
    plt.subplot(1,2,1)
    plt.plot(episode_rewards)
    plt.xlabel("episode")
    plt.ylabel("cumulative reward")
    plt.title("reward per episode")
    average_reward = sum(episode_rewards) / len(episode_rewards)
    print(f"the average reward is : {average_reward}")
    
    plt.subplot(1,2,2)
    plt.plot(episode_steps)
    plt.xlabel("Episode")
    plt.ylabel("Steps taken")
    plt.ylim(0,100)
    plt.title("Steps per episode")
    
    average_steps = sum(episode_steps) / len(episode_steps)
    print(f"The average steps is : {average_steps}")
    
    plt.tight_layout()
    plt.savefig('train_temp.png')
    plt.close()
    
    global text_logs
    text_logs.append(f"Trained Agent on EPOCHS = {train_epochs}")
    setText(text_logs)    
    episode_rewards = []
    episode_steps = []
    
    for episode in range(epochs):
        episode_reward, episode_step, path = finish_episode(agent, maze, episode, train=True)
        episode_rewards.append(episode_reward)
        episode_steps.append(episode_step)
    
    plt.figure(figsize=(10,5))
    plt.subplot(1,2,1)
    plt.plot(episode_rewards)
    plt.xlabel("episode")
    plt.ylabel("cumulative reward")
    plt.title("reward per episode")
    average_reward = sum(episode_rewards) / len(episode_rewards)
    print(f"the average reward is : {average_reward}")
    
    plt.subplot(1,2,2)
    plt.plot(episode_steps)
    plt.xlabel("Episode")
    plt.ylabel("Steps taken")
    plt.ylim(0,100)
    plt.title("Steps per episode")
    
    average_steps = sum(episode_steps) / len(episode_steps)
    print(f"The average steps is : {average_steps}")
    
    plt.tight_layout()
    plt.savefig('train_temp.png')  # Save instead of show
    plt.close()  # Close the figure to free memory
    
    text_logs.append(f"Trained Agent on EPOCHS = {train_epochs}")
    setText(text_logs)    
    episode_rewards = []
    episode_steps = []
    
    for episode in range(epochs):
        episode_reward, episode_step, path = finish_episode(agent, maze, episode, train=True)
        
        episode_rewards.append(episode_reward)
        episode_steps.append(episode_step)
        
    plt.figure(figsize=(10,5))
    plt.subplot(1,2,1)
    plt.plot(episode_rewards)
    plt.xlabel("episode")
    plt.ylabel("cumulative reward")
    plt.title("reward per episode")
    average_reward = sum(episode_rewards) / len(episode_rewards)
    print(f"the average reward is : {average_reward}")
    plt.subplot(1,2,2)
    plt.plot(episode_steps)
    plt.xlabel("Episode")
    plt.ylabel("Steps taken")
    plt.ylim(0,100)
    plt.title("Steps per episode")
    
    average_steps = sum(episode_steps) / len(episode_steps)
    print(f"The average steps is : {average_steps}")
    
    plt.tight_layout()
    plt.show()
    
    plt.savefig('train_temp.png', format='png', bbox_inches='tight')
    # Add the "Trained Agent on EPOCHS" message after training is complete
    text_logs.append(f"Trained Agent on EPOCHS = {train_epochs}")
    setText(text_logs)
def setlog(path):
    global log
    log = path

def getlog():
    return log

def setText(path):
    global text
    text = path

def gettext():
    return text


@app.route('/api/store', methods=['POST'])
def handle_maze():
    print("input recieved")
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    global maze, agent, goal_reward, wall_penalty, step_penalty, train_epochs, test_epochs, maze_layout,starting,ending

    try:
        maze_layout = np.array(data.get('maze'))
        starting = tuple(data.get('starting'))
        ending = tuple(data.get('ending'))
        goal_reward = int(data.get('reward'))
        wall_penalty = int(data.get('wallpenalty'))
        step_penalty = int(data.get('steppenalty'))
        train_epochs = int(data.get('train_epoch'))
        test_epochs = int(data.get('test_epoch'))
    except (TypeError, ValueError) as e:
        return jsonify({"error": "Invalid input types", "details": str(e)}), 400

    maze = Maze(maze_layout, starting, ending)
    agent = Agent(maze)
    print("Agent", agent)
    print ("Maze", maze)
    return jsonify({"status": "success", 
                    "maze_layout": maze_layout.tolist(),
                    "starting": starting,
                    "ending": ending,
                    "goal_reward": goal_reward,
                    "wall_penalty": wall_penalty,
                    "step_penalty": step_penalty,
                    "train_epochs": train_epochs,
                    "test_epochs": test_epochs}), 200
    
@app.route('/api/train', methods=['POST'])
def train_maze():
    global agent, maze, train_epochs, text_logs
    
    if not all([agent, maze, train_epochs]):
        return jsonify({
            "error": "Required parameters not initialized. Please call /api/store first"
        }), 400

    try:
        train_agent(agent, maze, train_epochs)
        text_logs.append(f"Trained Agent on EPOCHS = {train_epochs}")
        setText(text_logs)
        return jsonify({"status": "success", "message": "Training completed"}), 200
    except Exception as e:
        return jsonify({
            "error": "Training failed",
            "details": str(e)
        }), 500

@app.route('/api/test', methods=['POST'])
def test_maze():
    global agent, maze, test_epochs
    if test_epochs is None:
        return jsonify({"error": "Testing epochs not set"}), 400

    steps, reward, path = test_agent(agent, maze, test_epochs)
    setlog(path)
    global text_logs
    text_logs.append(f"Total Number of Steps :  {steps}")
    text_logs.append(f"Total Reward :  {reward}")
    
    setText(text_logs)
    
    return jsonify({"status": "success", "message": "Test completed", "steps": steps, "reward": reward}), 200

@app.route('/api/getlogs', methods=['GET'])
def get_log():
    logs = getlog()
    return jsonify({"status": "success", "log": logs}), 200

@app.route('/api/gettext', methods=['GET'])
def get_text():
    global text
    if text:
        return jsonify({"status": "success", "text": text.pop(0)}), 200
    else:
        return jsonify({"status": "success", "text": ""}), 200
    
@app.route('/api/getimage', methods=['GET'])
def get_image():
    img_type = request.args.get('type', 'test')  # Default to 'test' if no type is provided

    if img_type == 'train':
        img_file = 'train_temp.png'
    else:
        img_file = 'test_temp.png'

    try:
        with open(img_file, 'rb') as f:
            img_data = f.read()
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "Image file not found"}), 404

    img_base64 = base64.b64encode(img_data).decode('utf-8')

    return jsonify({"status": "success", "image": img_base64}), 200

@app.route('/api/getalltexts', methods=['GET'])
def get_all_texts():
    global text
    all_texts = []
    while text:
        all_texts.append(text.pop(0))
    return jsonify({"status": "success", "texts": all_texts}), 200

@app.route('/api/getallimages', methods=['GET'])
def get_all_images():
    try:
        with open('train_temp.png', 'rb') as f_train:
            train_img_data = base64.b64encode(f_train.read()).decode('utf-8')
        with open('test_temp.png', 'rb') as f_test:
            test_img_data = base64.b64encode(f_test.read()).decode('utf-8')
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "Image file not found"}), 404

    return jsonify({"status": "success", "train_image": train_img_data, "test_image": test_img_data}), 200

if __name__ == '__main__':
    app.run(debug=True, port= 5328)
