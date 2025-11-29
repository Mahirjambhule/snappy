⚡ Snappy - Real-Time Chat Application

Snappy is a full-stack, real-time messaging application built to provide a seamless chat experience. It features instant messaging, group chats, media sharing, and live online status indicators, all wrapped in a premium dark-mode interface.

🔗 Live Demo

📸 Screenshots

(Replace these links with your actual screenshots or remove this section)

Login / Register

Chat Interface





✨ Key Features

🔒 Secure Authentication: User registration and login with password encryption (Bcrypt).

⚡ Real-Time Messaging: Instant delivery of messages using Socket.io.

🟢 Online Presence: Real-time Online/Offline status indicators for friends.

👥 Group Chats: Create named groups, add multiple members, and identify senders within the group.

📷 Media Sharing: Seamless image uploads powered by Multer and Cloudinary.

🤖 Dynamic Avatars: Unique, procedurally generated avatars using Robohash API.

🎨 Modern UI: Fully responsive, dark-mode design using Styled-Components.

🛠️ Tech Stack

Frontend

React.js (Vite): Fast, component-based UI library.

Styled-Components: For scoped, dynamic CSS styling.

Axios: Handling API requests.

Socket.io-Client: Managing WebSocket connections on the client.

React-Toastify: For elegant notification popups.

Backend

Node.js & Express.js: RESTful API server.

MongoDB & Mongoose: NoSQL database for flexible data storage.

Socket.io: Enabling bi-directional, real-time communication.

Bcrypt: For hashing and securing passwords.

Multer & Cloudinary: Handling multipart form data and cloud image storage.

⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your .env file in the server directory.

server/.env

Variable

Description

PORT

The port the server runs on (e.g., 3001)

MONGO_URL

Your MongoDB Connection String (Atlas or Local)

CLOUDINARY_CLOUD_NAME

Your Cloudinary Cloud Name

CLOUDINARY_API_KEY

Your Cloudinary API Key

CLOUDINARY_API_SECRET

Your Cloudinary API Secret

🚀 Installation & Local Setup

Follow these steps to get a local copy up and running.

1. Clone the Repository

git clone [https://github.com/your-username/snappy-chat.git](https://github.com/your-username/snappy-chat.git)
cd snappy-chat


2. Backend Setup

Navigate to the server folder and install dependencies.

cd server
npm install


Start the server.

npm run dev


Server should run on http://localhost:3001

3. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies.

cd client
npm install


Start the React app.

npm run dev


Client should run on http://localhost:5173

📂 Project Structure

snappy-chat/
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # ChatContainer, Contacts, Inputs...
│   │   ├── pages/      # Login, Register, Chat
│   │   ├── utils/      # API Routes configuration
│   └── ...
└── server/             # Node Backend
    ├── controllers/    # Logic for Auth, Messages, Groups
    ├── models/         # Mongoose Schemas
    ├── routes/         # API Endpoints
    └── index.js        # Server Entry Point


🔮 Future Improvements

Search Functionality: Filter contacts and messages.

Voice/Video Calls: WebRTC integration.

Message Reactions: React to specific messages with emojis.

Read Receipts: Double ticks when a message is read.

👤 Author

Your Name

GitHub: @YourUsername

LinkedIn: Your Profile

Made with ❤️ using the MERN Stack.