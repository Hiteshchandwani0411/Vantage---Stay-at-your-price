# Vantage

Vantage is a modern accommodation marketplace where users can explore stays, save favorite listings, and list properties for others to discover. The platform is designed around the idea of finding a place that fits the right budget and travel needs.

## Project tagline

Stay-at-your-price.

## Features

- Browse and search property listings
- Filter by category and trending stays
- User sign up, login, and logout using Passport.js
- Save listings to a personal wishlist
- Add reviews and ratings to listings
- Host new properties with image uploads
- Cloudinary-powered media storage
- Map-based location support with MapTiler
- Responsive EJS frontend

## Tech stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS + EJS Mate
- Passport.js
- Cloudinary
- Multer
- Bootstrap 5
- MapTiler

## Project structure

```bash
.
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── schema.js
├── .env
├── controllers/
│   ├── listing.controller.js
│   ├── review.controller.js
│   ├── user.controller.js
│   └── wishlist.controller.js
├── init/
│   ├── data.js
│   └── index.js
├── models/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── wishlist.js
├── public/
│   ├── css/
│   └── js/
├── router/
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   └── wishlist.js
├── utils/
│   ├── categories.js
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── error.ejs
│   ├── home.ejs
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and add the required environment variables:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAPTILER_API_KEY=your_maptiler_api_key
```

3. Start the project:

```bash
npm run dev
```

Or run in production mode with:

```bash
npm start
```

## Main routes

- `/` - Landing page
- `/listings` - Explore all listings
- `/listings/new` - Host a new property
- `/listings/:id` - Property details page
- `/signup` - Create account
- `/login` - Login
- `/logout` - Logout
- `/user/wishlist` - User wishlist

## Notes

- Image uploads are handled through Cloudinary.
- Listing reviews are stored in MongoDB and linked to each listing.
- The app uses EJS templates and a shared layout for consistent UI rendering.
- Some listing categories and icons are defined in `utils/categories.js`.

## License

ISC
