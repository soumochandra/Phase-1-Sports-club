# Sports Club Management System

A full-stack Sports Club Management application developed as part of a Phase 1 development assignment.

The main goal of this phase was to build a complete athlete registration pipeline where athlete information can be submitted, stored, reviewed by an administrator and exported for offline management.

## About the Project

The application provides a multi-step registration process for athletes.

After registration, the submitted athlete data is stored in Firebase Firestore. Administrators can securely log in to the admin panel, view registered athletes, open complete athlete profiles and review registration details.

The admin can also approve or reject athlete registrations and export athlete records as a CSV file.

## Phase 1 Scope

The current version focuses on the following workflow:

Athlete Registration → Database → Admin Dashboard → Athlete Review → Data Export

Payment gateway and email notification features are not included in this phase.

## Features

### Athlete Registration

- Multi-step registration form
- Personal details
- Guardian details
- Address information
- Club and representing state details
- Competition selection
- Profile image upload
- Birth certificate upload
- Identity document upload
- Form validation
- Automatic age calculation from date of birth
- Automatic age group calculation

### Admin Panel

- Secure Firebase admin authentication
- Protected admin routes
- Athlete dashboard
- Athlete search
- Total athlete count
- Complete athlete profile view
- Athlete document access
- Approve athlete registration
- Reject athlete registration
- Registration status management
- Admin logout

### Data Export

Athlete records can be exported as a CSV file from the admin dashboard.

The exported file contains the complete athlete registration information and can be opened using spreadsheet applications.

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Firebase Authentication
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- Firebase Admin SDK
- Multer
- Sharp

### Database

- Firebase Firestore

## Project Structure

```text
sports-club-management/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   └── registration/
│   │   │
│   │   ├── config/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md