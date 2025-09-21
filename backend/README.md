# LLM Chat App Backend

## Overview
This is the backend component of the LLM Chat Application. It is designed to handle chat interactions with a Large Language Model (LLM) and serve as the API for the frontend.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/llm-chat-app.git
   cd llm-chat-app/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

To start the backend server, run:
```
python app.py
```

The server will start and listen for incoming requests.

## API Endpoints

- **POST /chat**: Send a message to the LLM and receive a response.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.