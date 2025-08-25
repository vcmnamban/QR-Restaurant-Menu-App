# QR-Based Restaurant Menu Web App

A comprehensive digital menu and ordering system designed specifically for restaurants in Saudi Arabia, featuring QR code access, bilingual support (Arabic/English), and integrated payment systems.

## 🚀 Features

### Core Functionality
- **QR Code Menu Access** - Single QR code for all tables
- **Bilingual Support** - Full Arabic (RTL) and English localization
- **Real-time Menu Management** - Add, modify, hide products instantly
- **Multi-period Menus** - Breakfast, Lunch, Dinner configurations
- **Allergen Information** - Comprehensive food safety details

### Ordering System
- **In-house Ordering** - Direct table ordering via QR
- **Takeout Orders** - Customer pickup system
- **Home Delivery** - Zone-based pricing and delivery management
- **WhatsApp Integration** - Share orders via WhatsApp
- **Waiting List Management** - Queue system with order numbers

### Payment & Compliance
- **Saudi VAT Integration** - KSA tax system compliance
- **Local Payment Methods** - Apple Pay, Mada, Credit/Debit cards
- **Cash on Delivery** - Traditional payment option

### Business Features
- **Sales Analytics** - Daily/weekly/monthly reports
- **Customer Reviews** - Rating system with Google Maps integration
- **Branding Customization** - Logo, colors, fonts, social links
- **Promotional Tools** - Advertising bar for special offers

## 💰 Pricing Tiers

### Plan 1 – Basic (SAR 199/month)
- Up to 20 tables
- Basic menu listing (unlimited products)
- Unified QR code
- Basic branding (logo + colors)
- Social media links
- Takeout ordering

### Plan 2 – Standard (SAR 499/month)
- Up to 50 tables
- Product periods (Breakfast/Lunch/Dinner)
- Waiting list management
- Featured items display
- In-house ordering
- WhatsApp order sharing
- Customer reviews & Google Maps QR
- Sales reports

### Plan 3 – Premium (SAR 749/month)
- Unlimited tables
- Advanced table reservations
- Home delivery ordering with zone-based pricing
- Private domain option
- Advertising bar
- Full payment methods (Apple Pay, Mada)
- Full bilingual support (Arabic/English)
- VAT system integration

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework with responsive design
- **Arabic RTL Support** - Full right-to-left language support
- **Progressive Web App** - Mobile-first responsive design

### Backend
- **Node.js/Express** - Robust server framework
- **RESTful APIs** - Clean, scalable API architecture
- **JWT Authentication** - Secure user management

### Database
- **PostgreSQL** - Reliable relational database
- **MongoDB** - Flexible document storage (alternative option)

### Infrastructure
- **AWS/Azure** - Scalable cloud hosting
- **SSL Encryption** - Secure data transmission
- **GDPR & KSA Compliance** - Data protection standards

## 📱 User Flows

### Restaurant Admin
1. Register & choose pricing plan
2. Set up branding (logo, colors, social links)
3. Add menu categories, products, pricing, allergen info
4. Print/download QR code
5. Track orders (in-house, delivery, takeout)
6. View reports & manage subscription

### Customer
1. Scan QR code at table
2. Browse menu (filtered by time periods)
3. Add items to cart
4. Choose order type (dine-in, takeout, delivery)
5. Select payment method
6. Confirm order
7. Receive order number/waiting list update
8. Optionally leave review/share via WhatsApp

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL or MongoDB
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd QR-Restaurant-Menu-App
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Database setup**
   ```bash
   # Run database migrations
   npm run migrate
   ```

5. **Start development servers**
   ```bash
   # Frontend (Port 3000)
   cd frontend && npm start
   
   # Backend (Port 5000)
   cd backend && npm run dev
   ```

## 📁 Project Structure

```
QR-Restaurant-Menu-App/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   ├── styles/         # CSS and styling files
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js backend application
│   ├── src/                # Source code
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── docs/                   # Documentation
└── assets/                 # Project assets
```

## 🌟 Key Benefits

### For Restaurants
- **Cost-effective** digital transformation
- **Real-time updates** without printing costs
- **Enhanced customer experience** with interactive menus
- **Data insights** for business optimization
- **Multi-language support** for diverse customer base

### For Customers
- **Convenient access** via smartphone
- **Detailed information** including allergens and photos
- **Easy ordering** with multiple payment options
- **Social sharing** capabilities
- **Review system** for community feedback

## 🔒 Security & Compliance

- **SSL/TLS encryption** for all data transmission
- **JWT token authentication** for secure access
- **Saudi VAT compliance** for tax reporting
- **GDPR compliance** for data protection
- **Regular security audits** and updates

## 📞 Support

For technical support or business inquiries:
- **Email**: support@qrrestaurantmenu.com
- **Phone**: +966-XX-XXX-XXXX
- **WhatsApp**: +966-XX-XXX-XXXX

## 📄 License

This project is proprietary software. All rights reserved.

---

**Developed by Vaseem** | **Date**: 23/08/2025 | **Target Market**: Saudi Arabia
