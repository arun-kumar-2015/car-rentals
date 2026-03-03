# Arun Car Rentals

A premium car rental application built with Next.js, Tailwind CSS, and Firebase.

## Features
- **Fleet Management**: Browse luxury and affordable cars.
- **Booking System**: Daily and Hourly (6hr/12hr) rental options.
- **Admin Dashboard**: Manage bookings, update statuses, and track revenue.
- **Mobile Optimized**: Responsive design for Android and iOS (Safari/Chrome).

## How to Push to GitHub

To save your code and version control it on GitHub, follow these steps:

1. **Create a new repository on GitHub:**
   - Log in to your [GitHub account](https://github.com/).
   - Click the **+** icon in the top right and select **New repository**.
   - Name it `arun-car-rentals` and click **Create repository**.
   - Copy the repository URL (it looks like `https://github.com/your-username/arun-car-rentals.git`).

2. **Run these commands in your terminal:**
   Open the terminal in your development environment and run:
   ```bash
   # Add your GitHub repository as the remote destination
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

   # Rename the default branch to main
   git branch -M main

   # Push your code to GitHub
   git push -u origin main
   ```
   *(Replace the URL with the one you copied from GitHub)*

## Deployment
This project is pre-configured for **Firebase App Hosting**. 
The configuration is located in `apphosting.yaml`.

## Local Development
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:9002](http://localhost:9002) in your browser.
