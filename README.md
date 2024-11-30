# [camping.gr!](https://camping-gr.onrender.com/)

**_initial load may take up to 1 min, due to free Render deploy instance_**

## Overview:

**Camping.gr** is a full-stack web application where users can share and review camping sites. Inspired by Yelp, camping.gr allows campers and outdoor enthusiasts to explore a wide range of campgrounds in the Greek region, view campground details, leave reviews, and upload images. Built with Node.js, Express, MongoDB, and Bootstrap, this project demonstrates core web development skills such as RESTful routing, database design, and user authentication.
This project was developed to help me practice backend and frontend skills, including setting up an MVC architecture, handling form data, managing databases, and implementing secure user authentication.

## Features

- **User Authentication**: Allows users to register and log in securely, using Passport.js for authentication, with unique user profiles and credential management.
- **Admin Functionality**: Admin users have extended permissions, enabling them to modify or delete any campground or review, allowing for streamlined content moderation.
- **Profile and Activity Management**: Users can view, edit, and delete their profiles. Profiles include displaying their created campgrounds and reviews with timestamps for tracking.
- **Campground Listings**: Users can create, read, update, and delete campgrounds (CRUD functionality) and see their campgrounds on a visually organized listings page.
- **Image Uploads with Cloudinary Integration**: Users can upload images for each campground to provide a visual representation. Images are stored in Cloudinary, with validation checks and file size limits to manage storage usage.
- **Reviews and Ratings**: Users can leave, edit, and delete reviews for campgrounds, providing feedback and ratings. Each review includes a timestamp, allowing users to track review history.
- **Interactive Map Integration**: Integrated map to show the location of each campground using the Mapbox API for mapping and Google Geocoding API for geocoding.
- **RESTful Routing**: Follows RESTful principles for clear and logical URL routing across all user and campground actions.
- **Responsive Design**: The application is styled with BootstrapCSS for a responsive and mobile-friendly layout, ensuring usability across devices.
- **Data Validation and Error Handling**: Validates form submissions for secure and complete data entry, while handling errors gracefully for a smooth user experience.
- **Enhanced Security Features**: Implements secure password hashing, input validation, session management, and user authorization to protect against unauthorized actions and enhance data integrity.
