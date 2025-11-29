Snappy ⚡

Snappy is a fully functional, real-time messaging platform built with the MERN stack. It features instant messaging, secure authentication, group chats, and seamless media sharing.

🚀 Live Demo

Check out the live application running in production:

Frontend (Client): https://snappy-woad.vercel.app

Backend (API): https://snappy-8ien.onrender.com

📸 Screenshots

Login Screen
![Login Screen](./screenshots/login.png)

Chat Interface
![Chat Screen](./screenshots/chat.png)





✨ Features

💬 Chat Experience

Real-Time Messaging: Instant bi-directional communication powered by Socket.io.

Group Chats: Create named groups, add multiple friends, and interact with sender identities.

Online Presence: Live status indicators (Online/Offline) for all contacts.

Message Management: Delete messages instantly for both sender and receiver.

Dynamic Avatars: Unique, procedurally generated avatars for every user via Robohash.

⚙️ Technical & Security

Secure Authentication: User registration and login using JWT and Bcrypt encryption.

Media Sharing: Drag-and-drop or select images to send in chat.

Cloud Storage: Images are optimized and stored securely using Cloudinary.

Modern UI: A premium, responsive dark-mode interface built with Styled-Components.

🛠️ Tech Stack

Frontend:

React.js (Vite)

Styled-Components (CSS-in-JS)

Axios (API Requests)

Socket.io-Client

React-Toastify

React Icons

Backend:

Node.js

Express.js

MongoDB & Mongoose

Socket.io (WebSockets)

JSON Web Token (JWT)

Multer & Cloudinary (File Uploads)

DevOps & Deployment:

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

🔧 Environment Variables

To run this project locally, you will need to add the following environment variables to your .env file in the server folder:

PORT=3001
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


💻 Run Locally

Follow these steps to set up the project locally on your machine.

1. Clone the repository
```bash
git clone [https://github.com/Mahirjambhule/snappy.git]
cd snappy
```

2. Install Dependencies
```bash
# Install Backend dependencies
cd server
npm install

# Install Frontend dependencies
cd ../client
npm install
```

3. Start the Application
```bash
Terminal 1 (Backend):
cd server
npm run dev

Terminal 2 (Frontend):
cd client
npm run dev
```

4. Access the App
```bash
Open your browser and navigate to:
http://localhost:5173
```