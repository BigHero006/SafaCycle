
# SafaCycle - Frontend

A role-based Smart Waste Management mobile application built with React Native and Expo for efficient waste collection and management as part of the SafaCycle project.

## 🎯 Project Overview
This app delivers a smart waste management solution with three main user roles:

- **Admin:** Manage users, drivers, routes, and view analytics
- **Driver:** Handle daily collection tasks, track assigned routes, and report issues
- **Customer:** Schedule waste pickups, track drivers, and manage requests


## 🚀 Features

### Current Implementation (Phase 1)
✅ Welcome screen with app introduction
✅ Navigation setup using React Navigation
✅ Placeholder login and signup screens
✅ Modular project structure and reusable components
✅ Custom theme system with environmental colors
✅ Reusable UI components

### Planned Features (Upcoming Phases)
🔄 Complete authentication system with role selection
🔄 Role-based dashboards and navigation
🔄 Driver tracking and route management
🔄 Camera integration for waste scanning
🔄 Push notifications and reminders
🔄 Backend integration with MongoDB
🔄 ML model integration for smart features

## 🛠️ Tech Stack
**Framework:** React Native with Expo
**Navigation:** React Navigation v6
**State Management:** Context API (planned)
**Styling:** StyleSheet with custom theme
**Backend:** MongoDB (future integration)
**ML:** Custom trained model (future integration)

## 📁 Project Structure

```
src/
├── screens/          # Main app screens
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── AdminDashboard.tsx
│   ├── DriverDashboard.tsx
│   └── ...
├── components/       # Reusable UI components
│   ├── CustomButton.tsx
│   ├── AdminNavBar.tsx
│   ├── ThemedText.tsx
│   └── ...
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation
1. Clone the repository:
    git clone <repository-url>
    cd SafaCycle-frontend

2. Install dependencies:

    npm install
    # or
    yarn install

3. Start the development server:

    npm start
    # or
    npx expo start

4. Run on device/simulator:

    # For Android
    npm run android

    # For iOS (macOS only)
    npm run ios

    # For web
    npm run web

## 📱 Available Scripts
npm start - Start the Expo development server
npm run android - Run on Android device/emulator
npm run ios - Run on iOS device/simulator (macOS only)
npm run web- Run in web browser


## 🎨 Design System
- **Primary Color:** Sea Green (#2E8B57) for an environmental theme
- **Typography:** System fonts with consistent sizing
- **Spacing:** Standardized padding and margins
- **Components:** Reusable UI elements with consistent styling


## 🔮 Roadmap
- **Phase 1: Frontend Foundation** ✅
   - Project setup and navigation
   - Welcome screen implementation
   - Basic component structure
- **Phase 2: Authentication & Onboarding** 🔄
   - Complete login/signup forms
   - Role selection system
   - User onboarding flow
- **Phase 3: Core Features** 🔄
   - Role-based dashboards
   - Driver tracking interface
   - Customer management screens
- **Phase 4: Advanced Features** 🔄
   - Camera integration
   - Push notifications
   - Offline support
- **Phase 5: Backend Integration** 🔄
   - MongoDB integration
   - API development
   - Real-time features
- **Phase 6: Smart Features** 🔄
   - ML model integration
   - Automated waste classification
   - Predictive analytics


## 🤝 Contributing
- Use functional components with hooks
- Follow the established folder structure
- Maintain consistent styling with the theme system
- Write clean, readable code with proper comments

## 📄 License
This project is developed as a capstone project for educational purposes.


## 📞 Contact
For questions or suggestions, please reach out to the development team via mail "aayushmanshrestha275@gmail.com"
