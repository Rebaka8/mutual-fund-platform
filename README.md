# Mutual Fund Platform

A comprehensive mutual fund investment platform built with React and Vite, featuring role-based access control and real-time fund data visualization.

## Features

- **Authentication System**: Session storage-based authentication (no backend required)
- **Role-Based Access**: 
  - Admin Panel - User management and platform settings
  - Investor Dashboard - Browse and invest in mutual funds
  - Advisor Section - Connect with certified financial advisors
  - Data Analyst Dashboard - Visualize investment trends
- **Data**: The app uses bundled sample data and synthetic NAV charts by default (no external API required).
  - Sample fund information (name, scheme code, category) is bundled with the app
  - Historical NAV charts are generated synthetically for visualization
  - The app gracefully falls back to local data if no external API is configured
- **Investment Calculator**: Calculate returns based on historical NAV data
- **Interactive Charts**: Visualize fund performance using Recharts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mutual-fund-platform
```

2. Install dependencies:
```bash
npm install
```

-3. Start the development server:
```bash
npm run dev
```
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Data / API

The project is configured to run without an external API by default. It uses synthetic NAV data and bundled sample funds so you can run and test the app locally without configuring API keys. If you later decide to enable a live mutual fund API, you can add an environment variable and re-enable API integration in the service modules.

## Usage

### Creating an Account

1. Click "Sign Up" on the landing page
2. Enter your full name, email, and password (minimum 6 characters)
3. Click "Sign Up" - you'll be automatically logged in

### Logging In

1. Click "Login" on the landing page
2. Enter your email and password
3. Click "Login" to access the platform

### User Roles

The platform assigns roles based on email addresses:
- `rebakameda@gmail.com` - Admin access
- `userb@example.com` - Financial Advisor access
- `userc@example.com` - Data Analyst access
- All other emails - Investor access

### Session Management

- User data is stored in browser's session storage
- Sessions persist across page refreshes
- Click "Logout" to clear your session

## Project Structure

```
mutual-fund-platform/
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx         # Admin user management
│   │   ├── AdvisorSection.jsx     # Financial advisor directory
│   │   ├── AuthLanding.jsx        # Landing page
│   │   ├── DataAnalystDashboard.jsx # Analytics dashboard
│   │   ├── InvestorDashboard.jsx  # Fund browsing and investment
│   │   ├── LoginPage.jsx          # Login form
│   │   └── SignUpPage.jsx         # Registration form
│   ├── App.jsx                     # Main app component with routing
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
└── vite.config.js                  # Vite configuration
```

## Technologies Used

- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **API Ninjas** - Mutual Fund data API integration

## Key Changes from Previous Version

### Removed
- Backend server (`otp-backend/`)
- OTP authentication system
- All API calls to localhost:5000
- Email verification flow

### Added
- Session storage-based authentication
- Local user registration and login
- Persistent sessions across page refreshes
- Simplified authentication flow

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Compatibility

This application uses session storage and modern JavaScript features. Ensure you're using a modern browser:
- Chrome 61+
- Firefox 55+
- Safari 11+
- Edge 16+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

