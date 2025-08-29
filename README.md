# Face Recognition Attendance System - Frontend

This is the frontend component of the Face Recognition Attendance System. It's a Next.js web application that provides a user interface for the face recognition attendance system, allowing users to register faces, view attendance logs, and interact with the camera feed for real-time face recognition.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Docker Deployment](#docker-deployment)
7. [Connecting to the Backend](#connecting-to-the-backend)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

## Overview

The frontend service provides a web-based interface for the Face Recognition Attendance System. It communicates with the backend API to perform face recognition, retrieve attendance logs, and manage user registrations. The interface is built with Next.js and provides a responsive design that works on both desktop and mobile devices.

## Features

- Real-time face recognition with camera feed
- Visual face detection overlay with bounding boxes
- Attendance log display with timestamps
- User registration interface
- User management dashboard
- Responsive design for various screen sizes
- Docker support for easy deployment

## Requirements

### Hardware

- Webcam or camera for face capture
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Software

- Node.js 18+
- npm, yarn, or pnpm package manager
- Docker (optional, for containerized deployment)

### Dependencies

All required packages are listed in `package.json`:

- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS
- ESLint

## Installation

### Option 1: Direct Installation

1. Navigate to the website directory:

   ```bash
   cd website
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Option 2: Using Docker

See [Docker Deployment](#docker-deployment) section below.

## Usage

### Development Mode

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Docker Deployment

### Production Dockerfile

The frontend includes a production Dockerfile (`Dockerfile.prod`) that creates an optimized build for deployment.

### Building the Docker Image

```bash
# From the website directory
docker build -f Dockerfile.prod -t face-recognition-frontend .
```

### Running with Docker

```bash
docker run -p 3000:3000 face-recognition-frontend
```

### Docker Compose

When using the full project with docker-compose:

```bash
# From the root project directory
docker-compose up -d frontend
```

### Running Frontend Independently

To run the frontend service independently using the dedicated docker-compose file:

```bash
# From the website directory
docker-compose up -d
```

This will start only the frontend service and make it accessible at `http://localhost:3000`.

**Important:** When running the frontend independently, you need to have the backend service running separately. By default, the frontend will try to connect to the backend at `http://host.docker.internal:5000` (which points to your host machine).

If your backend is running on a different host or port, you can modify the `NEXT_PUBLIC_API_URL` environment variable in the `website/docker-compose.yml` file.

## Connecting to the Backend

The frontend connects to the backend API service to perform face recognition and retrieve attendance data.

### API Configuration

The frontend uses the following environment variable to determine the backend API URL:

- `NEXT_PUBLIC_API_URL`: The base URL for the backend API (default: `http://localhost:5000`)

### Service Communication

In a Docker environment, the frontend communicates with the backend through the Docker network. The backend service is accessible at `http://backend:5000` within the Docker network.

For local development, the frontend connects to `http://localhost:5000` by default.

### API Endpoints Used

The frontend uses the following backend API endpoints:

1. `POST /api/recognize` - Sends camera frames for face recognition
2. `GET /api/logs` - Retrieves attendance records
3. `GET /api/users` - Retrieves registered users
4. `POST /api/register` - Registers new faces
5. `DELETE /api/users/<name>` - Deletes a user

## Environment Variables

The frontend uses the following environment variables:

| Variable              | Default Value           | Description          |
| --------------------- | ----------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API base URL |

To set environment variables, create a `.env.local` file in the website directory:

```env
NEXT_PUBLIC_API_URL=http://your-backend-url:5000
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch" or "Network Error" messages**

   - Ensure the backend service is running
   - Check that the API URL is correctly configured
   - Verify network connectivity between frontend and backend

2. **Camera access denied**

   - Ensure you have granted camera permissions in your browser
   - Check that no other applications are using the camera
   - Try refreshing the page

3. **Face recognition not working**

   - Ensure adequate lighting conditions
   - Check that faces are properly registered in the system
   - Verify that the backend service is functioning correctly

4. **Docker container fails to start**

   - Check Docker logs: `docker logs <container_name>`
   - Ensure all required files are present
   - Verify Docker has sufficient resources

5. **Page not loading or blank screen**

   - Check browser console for JavaScript errors
   - Ensure all dependencies are installed: `npm install`
   - Restart the development server

### Browser Compatibility

The application is tested and works best on modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

### Performance Optimization

1. **For better performance:**

   - Close other CPU-intensive applications
   - Use a modern browser with good WebRTC support
   - Ensure good lighting conditions for face recognition

2. **For development:**
   - Use the `--turbopack` flag for faster builds: `npm run dev --turbopack`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

Please ensure your code follows the existing style and includes appropriate tests.
