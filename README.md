# LLM Chat Application

This project is a simple chat application that utilizes a Large Language Model (LLM) for generating responses. It consists of a frontend built with Vite and Vue.js, and a backend implemented in Python.

## Project Structure

```
llm-chat-app
├── backend
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── main.js
│       └── App.vue
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the backend server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the Vite development server:
   ```
   npm run dev
   ```

## Usage

Once both the backend and frontend servers are running, you can access the chat application in your web browser at `http://localhost:3000` (or the port specified in your Vite configuration).

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License.