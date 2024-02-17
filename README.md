# ChatFZ

ChatFZ is a Full Stack Realtime Chatting Web Application that utilizes Socket.io for real-time communication and securely stores user details in encrypted format in a MongoDB Database.

## Tech Stack

- **Client:** React JS
- **Server:** Node JS, Express JS
- **Database:** MongoDB


## Run Locally

### Clone the project

```bash
git clone https://github.com/RKR0/ChatFZ.git
```

### Go to the project directory

```bash
cd chatFZ
```

### Install dependencies

```bash
npm install
```

```bash
cd frontend/
npm install
```

### Configure Environment Variables:
- Rename the .env.dummy file to .env:
```bash
mv .env.dummy .env
```
```dotenv
PORT=5000
MONGODB_URI=your_mongo_db_uri
...
```


### Start the server/Backend
```bash
cd backend
npm start

```
Start the Client/Frontend

```bash
  //open a new terminal
cd frontend
npm start
```

  
## Features

### Real-Time Chat Functionality
- Implemented instant communication using Socket.io for real-time chatting.
- Incorporated typing indicators for a dynamic and responsive user experience.

### Secure User Data Storage
- Implemented encryption techniques in MongoDB for secure storage of user details.
- Prioritized user data protection through robust encryption practices.

### Responsive User Interface
- Developed a responsive and user-friendly interface using React JS.
- Ensured an enhanced user experience by focusing on design and usability aspects.

### Server-Side Logic and API Endpoints
- Implemented server-side logic and designed API endpoints using Node JS and Express JS.
- Ensured smooth data flow and efficient communication between frontend and backend.

### Enhanced Application Security
- Integrated JSON Web Token (JWT) authentication for improved security.
- Implemented measures to safeguard against unauthorized access and data breaches.

### Authentication Features
- Developed a robust authentication system to secure user access.
- Implemented multi-layered authentication processes to enhance overall security.

### Real-Time One-to-One Chat
- Implemented one-to-one chat functionality for personalized communication.
- Ensured seamless and instantaneous message exchange between users.

### User Search Functionality
- Integrated a user search feature for easy discovery and connection.
- Optimized search algorithms for quick and efficient user lookup.

### Group Chat Creation
- Implemented the ability to create and manage group chats.
- Enhanced collaboration by allowing users to form and participate in group discussions.

### AWS S3 for Image Storage
- Efficiently stored images in AWS S3 for scalable and reliable image hosting.

### Welcome Mail for New Users
- Implemented a welcome mail feature to enhance the onboarding experience for new users.

