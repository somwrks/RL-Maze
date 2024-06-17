# RL-Maze Simulation

This project is a Reinforcement Learning (RL) simulation project built with a combination of Next.js, Flask, Tailwind CSS, and OpenCV. The purpose is to provide an educational platform for machine learning enthusiasts, allowing them to learn about RL by building their own mazes and training AI agents to solve them.  

The application allows users to create custom mazes with defined walls, reward points, and step penalties. Users can then select from a variety of RL algorithms and configure their parameters. The website will then visualize the agent learning process as it navigates the maze, aiming to reach the designated endpoint. The goal is to provide an intuitive and interactive way for users to understand the concepts of RL and see how agents learn to solve complex problems.


## Overview

This project is an educational reinforcement learning simulation that allows users to experiment with building mazes and training agents to navigate them. Users can define the maze layout, set reward and penalty points, and observe how the agent learns to find the optimal path to the goal.  The simulation visualizes the agent's progress and provides insights into the reinforcement learning process.  The project leverages NextJS for the frontend, Flask for the backend, TailwindCSS for styling, and OpenCV for image processing. Users can build their own mazes, set parameters for their agent, and watch it learn and solve the maze. The simulation visualizes the agent's progress and provides insights into the reinforcement learning process. 


## Dependencies

This project is an educational tool that allows users to build their own mazes and train reinforcement learning agents to solve them. Users can define the maze's layout, set up reward and penalty points, and observe the agent's learning process as it navigates the maze. The project uses NextJS for the frontend, Flask for the backend, and OpenCV for visual processing. This combination creates an interactive and informative experience for users interested in reinforcement learning concepts. The project is under development and welcomes contributions. 


## Usage

1. **Ensure all dependencies are installed.** You can install all dependencies by running `npm install` in the project's root directory.
2. **Build the application** by running `npm run build` in the project's root directory.
3. **Launch the application** by running `npm run start` in the project's root directory. 
4. **Run `python index.py`** in the project's root directory to start the Flask server.
5. **Access the application in your web browser** at `http://localhost:5000/`. 
6. **Build your own maze** using the provided interface, and set parameters for your reinforcement learning agent, including wall positions, step costs, and reward points.
7. **Watch as your agent learns to navigate the maze** and see the progress of its exploration and solution. 


## Code Structure

The key components of the code include:

- **UI:** The application's user interface is built using `NextJS`, which leverages the power of `Next.js` for building web applications and integrates it with `ElectronJS` to create a native desktop application. The UI is styled using `TailwindCSS` for a modern and customizable look.
- **Maze Logic:**  The `index.py` and `main.py` files contain the core logic for generating, displaying, and solving the maze. The `TypingText.tsx` and `middleware.ts` files handle user interaction and data flow between the frontend and backend. 
- **API Integration:** The project uses `OpenCV` for image processing and maze visualization, and the code interacts with the user's provided parameters for maze creation and agent behavior.
- **User Interaction:** Users can input their own maze dimensions, wall positions, reward points, and step penalty values. This allows for customization and exploration of different maze environments.
- **Agent Learning:**  The application utilizes reinforcement learning principles to enable the agent to learn the optimal path through the maze. The progress of the agent is visualized on the website as it learns and navigates the maze. 



## Folder Structure

- `.gitignore`: Contains version control information for the project.
- `index.py`: Main Python file for the simulation logic.
- `main.py`:  Entry point for the Flask server.
- `TypingText.tsx`:  Component for displaying and managing text typing animation.
- `middleware.ts`:  Middleware functions for handling requests and responses.
- `next.config.js`:  Configuration file for Next.js, defining build settings and optimizations.
- `package-lock.json`: Contains information about the project's dependencies and their versions.
- `package.json`: The project's manifest file, defining dependencies, scripts, and other configuration.
- `pnpm-lock.yaml`:  Pnpm lock file managing package dependencies.
- `postcss.config.js`: Configuration file for PostCSS, defining styling rules and plugins.
- `requirements.txt`: Lists Python dependencies for the project.
- `tailwind.config.js`: Configuration file for TailwindCSS, defining the styling framework.
- `tsconfig.json`: TypeScript configuration file, defining compiler settings.
- `renderer`: Contains the frontend code built with Next.js, TailwindCSS, and OpenCV. 
- `components`: Contains reusable UI components for the web application.
- `pages`: Contains the application's pages including the homepage for user interaction with the maze simulation.
- `api`: Contains API routes for interacting with the simulation logic and managing user input.
- `public`: Contains static assets for the application like images.
- `styles`: Contains global styles for the application.
- `globals.css`: Global CSS styles.


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to modify and distribute the code as per the terms of the license. 


