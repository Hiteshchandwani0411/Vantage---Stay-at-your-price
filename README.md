# Vantage 🏡

> **Stay-at-your-price.**

Vantage is a modern accommodation marketplace where users can explore stays, save favorite listings, review the places they visit, and list properties for others to discover. Built around the idea of finding a place that fits the right budget and travel needs, Vantage combines a clean, responsive interface with a robust Node.js backend.

[![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)](http://www.passportjs.org/)
[![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

---

## ✨ Features

### For Guests
- 🔍 Browse, search, and explore property listings
- 🗂️ Filter stays by category and trending picks (26+ categories)
- 💜 Save listings to a personal wishlist
- ⭐ Add reviews and ratings to listings you've stayed at
- 🗺️ View map-based location support powered by MapTiler

### For Hosts
- 🏠 List new properties with rich descriptions
- 🖼️ Upload images with storage handled by Cloudinary + Multer
- 📍 Attach map coordinates to every listing
- ✏️ Edit or remove your own listings
- 🔐 Secure authentication with Passport.js (sign up / login / logout)

---

## 🛠️ Tech Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| **Backend**   | Node.js, Express.js                               |
| **Database**  | MongoDB, Mongoose                                 |
| **Auth**      | Passport.js, Passport-Local-Mongoose              |
| **Templates** | EJS, EJS Mate                                     |
| **Frontend**  | Bootstrap 5, Vanilla JS                           |
| **Media**     | Cloudinary, Multer, Multer-Cloudinary-Storage     |
| **Maps**      | MapTiler                                          |
| **Validation**| Joi                                              |
| **Sessions**  | express-session, connect-mongo, connect-flash     |

---

## 📸 Screenshots

> _Add screenshots of the home page, listing grid, listing detail, wishlist, and login page here._

![Home Page](docs/screenshots/home.png)
![Listing Detail](docs/screenshots/show.png)

---

## 🚀 Getting Started

Follow these steps to get a copy of Vantage running locally.

### Prerequisites

Before you begin, make sure you have the following installed and set up:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)
- A [MapTiler](https://www.maptiler.com/) API key (for map rendering)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/vantage.git
   cd vantage
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root and populate it (see the [Environment Variables](#-environment-variables) section below):

   ```env
   PORT=4000
   MONGODB_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAPTILER_API_KEY=your_maptiler_api_key
   ```

4. **(Optional) Seed the database with sample listings**

   ```bash
   node init/index.js
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Or run in production mode:

   ```bash
   npm start
   ```

6. **Open the app**

   Visit [`http://localhost:4000`](http://localhost:4000) in your browser.

---

## 🔐 Environment Variables

All configuration is loaded from a `.env` file using [dotenv](https://www.npmjs.com/package/dotenv).

| Variable           | Description                                          | Required |
| ------------------ | ---------------------------------------------------- | :------: |
| `PORT`             | Port the server runs on                              |    ✅    |
| `MONGODB_URL`      | MongoDB connection string                            |    ✅    |
| `SECRET_KEY`       | Secret used to sign session cookies                  |    ✅    |
| `CLOUD_NAME`       | Cloudinary cloud name                                |    ✅    |
| `CLOUD_API_KEY`    | Cloudinary API key                                   |    ✅    |
| `CLOUD_API_SECRET` | Cloudinary API secret                                |    ✅    |
| `MAPTILER_API_KEY` | MapTiler API key for rendering maps                  |    ✅    |

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore` to keep your secrets safe.

---

## 📁 Project Structure

```bash
.
├── app.js                      # Server entry point & app setup
├── cloudConfig.js              # Cloudinary + Multer storage config
├── middleware.js               # Auth & authorization middleware
├── schema.js                   # Joi validation schemas
├── package.json
├── .env                        # Environment variables (git-ignored)
├── controllers/                # Route handlers / business logic
│   ├── listing.controller.js
│   ├── review.controller.js
│   ├── user.controller.js
│   └── wishlist.controller.js
├── init/                       # Database seeding
│   ├── data.js
│   └── index.js
├── models/                     # Mongoose models
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── wishlist.js
├── public/                     # Static assets
│   ├── css/
│   └── js/
├── router/                     # Express routers
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   └── wishlist.js
├── utils/                      # Helpers & constants
│   ├── categories.js
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/                      # EJS templates
│   ├── error.ejs
│   ├── home.ejs
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
└── README.md
```

---

## 🧭 Routes

| Method | Route                 | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/`                   | Landing page                 |
| GET    | `/listings`           | Explore all listings         |
| GET    | `/listings/new`       | Form to host a new property  |
| GET    | `/listings/:id`       | Property details page        |
| GET    | `/signup`             | Create an account            |
| GET    | `/login`              | Log in                       |
| GET    | `/logout`             | Log out                      |
| GET    | `/user/wishlist`      | View your personal wishlist  |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place. Any contributions you make are **greatly appreciated**.

1. Fork the project (`https://github.com/Hiteshchandwani0411/vantage/fork`)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/), the backbone of this project
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) for data persistence
- [Passport.js](http://www.passportjs.org/) for authentication
- [Cloudinary](https://cloudinary.com/) & [Multer](https://github.com/expressjs/multer) for media uploads
- [MapTiler](https://www.maptiler.com/) for map rendering
- [Bootstrap](https://getbootstrap.com/) & [Font Awesome](https://fontawesome.com/) for the UI
- YelpCamp-inspired project architecture (Colt Steele's Web Developer Bootcamp)

---

## 📄 License

Distributed under the [ISC License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/Hiteshchandwani0411">Hitesh Chandwani</a></p>
