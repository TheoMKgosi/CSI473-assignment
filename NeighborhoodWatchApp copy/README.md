Neighborhood Watch App

A comprehensive community security application built with React Native and Django REST Framework to enhance neighborhood safety through real-time communication, emergency alerts, and patrol management.

🎯 Project Overview

This repository contains the Neighborhood Watch Member mobile application - part of a larger security ecosystem designed to connect community members with security services and enable proactive safety monitoring.

🛡️ For Neighborhood Watch Members

The mobile app empowers community members to:

· Monitor security patrols in real-time
· Receive emergency alerts and notifications
· Participate in community forums
· Manage subscription plans
· Trigger emergency SOS when in danger

🏗️ System Architecture

Frontend (Mobile App)

· Framework: React Native with Expo
· Navigation: React Navigation Stack
· HTTP Client: Axios
· State Management: React Hooks
· Styling: React Native StyleSheet

Backend (API Server)

· Framework: Django REST Framework
· Database: SQLite (Development)
· Authentication: Token-based Auth
· CORS: django-cors-headers

📱 Features

Member Features

· ✅ User Authentication (Login/Signup with admin approval)
· ✅ Community Forum - Post updates and communicate with neighbors
· ✅ Patrol Statistics - View security patrol metrics and coverage
· ✅ Emergency Panic Button - Instant SOS with location sharing
· ✅ Subscription Management - Monthly plans with payment integration
· ✅ Real-time Notifications - Alerts for incidents and patrol updates

Security Features

· 🔐 Secure Authentication with token-based sessions
· 🚨 Emergency Alert System with push notifications
· 📊 Compliance Monitoring for security patrols
· 💳 PCI DSS Compliant payment processing
· 🔒 Data Encryption in transit and at rest

🚀 Quick Start

Prerequisites

· Node.js 16+
· Python 3.8+
· Expo CLI
· Git

Installation

1. Clone the repository

```bash
git clone <repository-url>
cd NeighborhoodWatchApp
```

1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

1. Frontend Setup

```bash
cd frontend
npm install
npx expo start --tunnel --port 8081
```

Environment Configuration

Create backend/.env:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.github.dev
```

📁 Project Structure

```
NeighborhoodWatchApp/
├── backend/                 # Django REST API
│   ├── api/                # App modules
│   ├── backend/            # Project settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React Native App
│   ├── screens/            # App screens
│   ├── assets/             # Fonts, images
│   ├── App.js              # Main app component
│   └── package.json
└── README.md
```

🎨 UI Components

Authentication Screens

· Login Screen - Secure member authentication
· Signup Screen - New member registration with admin approval

Main Application

· Home Dashboard - Quick access to all features
· Community Forum - Neighborhood discussions
· Patrol Statistics - Security metrics and reports
· Emergency Alert - SOS panic button
· Subscription - Plan management and payments

🔐 API Endpoints

Endpoint Method Description
/api/signup/ POST Member registration
/api/login/ POST User authentication
/api/forum/ GET/POST Community posts
/api/patrol-stats/ GET Patrol statistics
/api/panic/ POST Emergency alert trigger
/api/pay-subscription/ POST Subscription payment
/api/cancel-subscription/ POST Cancel subscription

👥 User Roles

🏘️ Neighborhood Watch Members

· Register and await admin approval
· Pay monthly subscription (P100/month)
· Access community features and alerts
· Trigger emergency SOS
· View patrol statistics

🔐 Administrators (Web App)

· Approve/reject member registrations
· Manage security officers
· Monitor system health
· Generate reports

👮 Security Officers (Mobile App)

· Patrol route management
· QR code scanning for checkpoints
· Incident reporting
· Real-time location tracking

💳 Subscription Model

· Monthly Fee: P100
· Payment Methods: Orange Money, MyZaka, Visa
· Auto-suspension: After 2 months non-payment
· Features: Full app access, emergency alerts, community forum

🛠️ Development

Running in Development

```bash
# Backend (Port 8000)
cd backend && python manage.py runserver

# Frontend (Port 8081)  
cd frontend && npx expo start --tunnel
```

Testing

```bash
# Backend tests
cd backend && python manage.py test

# Frontend testing
# Use Expo Go app on mobile device
```

📋 Current Status

✅ Completed

· Member authentication system
· Community forum functionality
· Patrol statistics display
· Emergency panic button
· Subscription management UI
· Responsive mobile design
· API integration framework

🚧 In Progress

· Real payment gateway integration
· Push notification system
· Admin approval workflow
· Advanced reporting features

🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Team

· Theo Kgosiemang (Project Leader) - 202201557
· Boitsholo Ramokhua - 202202152
· Ruth Akanyang - 201701204

📞 Support

For support and queries regarding the Neighborhood Watch Member app, please contact the development team or create an issue in this repository.

---

Built with ❤️ for safer communities