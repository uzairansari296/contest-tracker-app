# Contest Tracker

A real-time coding contest tracker for Codeforces, LeetCode, and CodeChef.

## Features

- Real-time contest updates
- Platform-specific filtering
- Contest bookmarking
- Dark/Light theme
- Solution management
- Mobile responsive design

## Tech Stack

- Frontend: React.js, Socket.IO Client
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time: Socket.IO

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/contest-tracker.git
cd contest-tracker
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Set up environment variables:

- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables with your values

5. Run the application:

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm start
```

## Deployment

- Backend: Render/Vercel
- Frontend: Vercel
- Database: MongoDB Atlas

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
