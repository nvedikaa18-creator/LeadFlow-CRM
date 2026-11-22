# LeadFlow CRM

A simple and modern Lead Management CRM built to help organize potential customers, track lead progress, and manage business enquiries efficiently.

## Overview

LeadFlow is a full-stack web application that allows users to manage leads from a single dashboard. It provides a clean interface for adding, viewing, updating, searching, filtering, and deleting leads.

## Features

- Dashboard with lead statistics
- Add new leads
- View all leads in a table
- Edit existing lead details
- Delete leads with confirmation
- Search leads by information such as name
- Filter leads by status
- Update lead status
- Form validation
- MongoDB database integration
- Responsive user interface

## Tech Stack

### Frontend
- React.js
- Vite
- CSS
- Lucide React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

## Lead Information

Each lead can contain:

- Name
- Email
- Phone
- Company
- Source
- Status

### Lead Sources
- Website
- LinkedIn
- Referral
- Instagram
- Other

### Lead Statuses
- New
- Contacted
- Qualified
- Lost

## Project Structure

```text
LeadFlow/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── models/
│   │   └── Lead.js
│   ├── routes/
│   │   └── leadRoutes.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/nvedikaa18-creator/LeadFlow-CRM.git
cd LeadFlow-CRM
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Add your MongoDB connection string to `MONGO_URI`.

Start the backend:

```bash
node server.js
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL provided by Vite to access LeadFlow.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | Fetch all leads |
| GET | `/api/leads/:id` | Fetch a lead by ID |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

## Future Improvements

- User authentication
- Pagination
- Lead sorting
- Advanced dashboard analytics
- Deployment and hosting

## Author

Developed as a Full Stack Development project using React, Node.js, Express, and MongoDB.