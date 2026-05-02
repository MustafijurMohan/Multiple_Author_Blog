# ✍️ QuillPress — Multi-Author Blog Platform

<div align="center">

![QuillPress Banner](https://img.shields.io/badge/QuillPress-Multi--Author%20Blog-ea580c?style=for-the-badge&logo=feather&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Upload-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)

**A modern, full-stack multi-author blogging platform built with the MERN stack.**
Write beautifully. Read deeply. Connect meaningfully.

[Live Demo](#) · [Backend Repo](#) · [Frontend Repo](#) · [Report Bug](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

QuillPress is a full-featured, production-ready multi-author blog application. Any registered user can become a writer — publish rich-text articles, manage their own posts, interact with the community through likes and comments, and build their public profile. Readers can explore stories, search by author or keyword, and engage with content they love.

---

## ✨ Features

### 🔐 Authentication & Security

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure stateless authentication using JSON Web Tokens with 7-day expiry |
| **Password Hashing** | All passwords hashed using `bcrypt` with salt rounds before storage |
| **Protected Routes** | Middleware-guarded API routes — only authenticated users can create, update, or delete |
| **Token Persistence** | Token stored in `localStorage`, synced globally via React Context API |
| **Forgot Password** | Full 3-step OTP flow: email verification → 6-digit OTP → reset password |
| **OTP Security** | OTP codes are single-use, tracked with status flags (unsent / sent / used / expired) |
| **Email Delivery** | OTP sent via NodeMailer to the user's registered email address |

### 📝 Blog / Posts

| Feature | Description |
|---|---|
| **Create Post** | Rich-text editor (TipTap) with full formatting — headings, bold, italic, lists, blockquotes, code blocks, links |
| **Cover Image Upload** | Drag-and-drop or click-to-upload cover image, stored on Cloudinary |
| **Edit Post** | Authors can edit their own posts inline with the same rich-text editor |
| **Delete Post** | Authors can permanently delete their own posts with a confirmation modal |
| **Ownership Check** | Backend enforces that only the post author can update or delete |
| **All Posts** | Public endpoint — no auth required to view the blog listing |
| **Single Post** | Full post view with rich HTML content, author info, reading time |
| **Reading Time** | Automatically calculated from word count (avg 200 wpm) |

### 👍 Likes

| Feature | Description |
|---|---|
| **Toggle Like** | One click to like or unlike — duplicate likes prevented at database level via unique index |
| **Optimistic UI** | Like count and state update instantly in the UI before server confirms |
| **Live Count** | Total like count displayed on each post card and on the single post page |
| **Guest Redirect** | Unauthenticated users are redirected to sign in when they try to like |

### 💬 Comments

| Feature | Description |
|---|---|
| **Add Comment** | Authenticated users can comment on any post |
| **Delete Comment** | Users can delete only their own comments |
| **Comment Author Info** | Each comment displays the author's avatar (or initials) and username |
| **Real-time List** | New comments appear at the top immediately after posting |
| **Skeleton Loading** | Placeholder skeleton shown while comments are fetching |
| **Guest Prompt** | Unauthenticated visitors see a sign-in prompt instead of the comment form |

### 👤 User Profile

| Feature | Description |
|---|---|
| **Update Profile** | Change username, country, and profile photo |
| **Profile Image Upload** | Photo uploaded to Cloudinary via `multer` |
| **Email Read-only** | Email address is shown but cannot be changed for security |
| **My Posts** | Profile page displays only the logged-in user's own posts |
| **Post Count Badge** | Total published posts shown prominently on the profile header |

### 🎨 Frontend UX

| Feature | Description |
|---|---|
| **Responsive Design** | Fully mobile-responsive — hamburger drawer nav on mobile, grid layout adjusts on all breakpoints |
| **Floating Label Inputs** | Labels animate upward on focus for a clean, modern form feel |
| **Skeleton Loading** | Skeleton placeholder cards shown while data loads — no blank screens |
| **Pagination** | Blog listing shows 6 posts per page with numbered pagination and ellipsis |
| **Search** | Filter blog posts by title or author name in real time |
| **Post Slider** | Featured stories carousel with custom Prev/Next buttons, dot indicators, thumbnail strip, and 5s auto-play |
| **Toast Notifications** | Global toast system (success / error / info / warning) used across all pages |
| **Password Strength Bar** | Visual strength indicator on the reset password form |
| **OTP Input Boxes** | 6 individual digit boxes with auto-focus, backspace navigation, and paste support |
| **Dark Navbar** | Sticky navbar with auth-aware avatar dropdown and mobile drawer |
| **Rich Text Editor** | TipTap editor with toolbar for full content formatting in create and edit flows |
| **Share Post** | Copy link to clipboard or share directly to Twitter from any post |
| **404 Page** | Custom not-found page with 10-second auto-redirect countdown |

### 🛡️ Backend

| Feature | Description |
|---|---|
| **Global Error Handler** | Centralised Express error middleware catches all errors and returns consistent JSON responses |
| **Input Validation** | All inputs validated (email regex, password length, required fields) before hitting the database |
| **Cloudinary Integration** | Images uploaded via `multer` → Cloudinary, local temp files deleted after upload |
| **Multer Middleware** | Handles `multipart/form-data` for both post cover images and profile photos |
| **CORS** | Configured to allow requests from the frontend origin |
| **Environment Config** | All secrets managed via `.env` — never hardcoded |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework and routing |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB schema and queries |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **bcrypt** | Password hashing |
| **Multer** | File upload handling |
| **Cloudinary** | Cloud image storage and delivery |
| **NodeMailer** | OTP email delivery |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library (latest version) |
| **React Router v7** | Client-side routing and navigation |
| **Tailwind CSS** | Utility-first CSS framework |
| **TipTap** | Rich text editor (ProseMirror-based) |
| **Axios** | HTTP client for API calls |
| **React Context API** | Global auth state (token, user, login, logout) |

---

## 📁 Project Structure

```
quillpress/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # register, login, forgot password, OTP, reset
│   │   ├── postController.js       # CRUD for blog posts
│   │   ├── commentController.js    # add, get, delete comments
│   │   └── likeController.js       # toggle like, get like count
│   ├── middleware/
│   │   ├── authVerify.js           # JWT verification middleware
│   │   ├── uploadImage.js          # multer config for image fields
│   │   └── errorHandler.js         # global error handler
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── PostModel.js
│   │   ├── CommentModel.js
│   │   ├── LikeModel.js
│   │   └── OTPModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── utils/
│   │   └── emailSend.js            # NodeMailer helper
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── images/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PostCard.jsx         # card with like, share, reading time
    │   │   ├── PostSlider.jsx       # featured posts carousel
    │   │   ├── TipTapEditor.jsx     # rich text editor with toolbar
    │   │   └── ProtectedRoute.jsx   # auth guard wrapper
    │   ├── context/
    │   │   ├── Auth.jsx             # AuthContext — token, user, login, logout
    │   │   └── ToastContext.jsx     # global toast notification system
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Blog.jsx             # listing with search + pagination
    │   │   ├── SinglePost.jsx       # full post + comments + likes + share
    │   │   ├── AddBlog.jsx          # create post with TipTap + image upload
    │   │   ├── Profile.jsx          # edit profile + user's posts
    │   │   ├── AuthPage.jsx         # sign in / sign up (single page)
    │   │   ├── EmailVerify.jsx      # 3-step forgot password flow
    │   │   └── NotFound.jsx         # 404 with countdown redirect
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quillpress.git
cd quillpress
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables)).

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory.

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quillpress
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NodeMailer (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `POST` | `/verifyEamil/:email` | ❌ | Send OTP to email |
| `POST` | `/verifyOtp` | ❌ | Verify OTP code |
| `POST` | `/resetPassword` | ❌ | Reset password with verified OTP |
| `POST` | `/update-profile` | ✅ | Update username, country, and photo |

### Post Routes — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/AllPost` | ❌ | Get all posts (sorted newest first) |
| `GET` | `/SignlePost/:id` | ❌ | Get single post by ID |
| `POST` | `/create-post` | ✅ | Create a new post (with image) |
| `POST` | `/UpdatePost/:id` | ✅ | Update own post |
| `DELETE` | `/DeletePost/:id` | ✅ | Delete own post |

### Comment Routes — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/comments/:postId` | ✅ | Add a comment to a post |
| `GET` | `/comments/:postId` | ❌ | Get all comments for a post |
| `DELETE` | `/comments/delete/:commentId` | ✅ | Delete own comment |

### Like Routes — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/like/:postId` | ✅ | Toggle like on a post |
| `GET` | `/likes/:postId` | ❌ | Get like count + user's like status |

---

## 📸 Screenshots

> _Add screenshots of your app here after deployment._

| Page | Description |
|---|---|
| **Home** | Hero section, featured slider, latest posts grid |
| **Blog** | Paginated post listing with search |
| **Single Post** | Rich content, like button, share, comments |
| **Add Blog** | TipTap editor with image upload |
| **Profile** | Edit profile, user's own posts |
| **Sign In / Up** | Animated floating label form |
| **Forgot Password** | 3-step OTP verification flow |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

Please follow the existing code style and make sure all features are tested before submitting a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using the MERN Stack

**[⬆ Back to top](#️-quillpress--multi-author-blog-platform)**

</div>