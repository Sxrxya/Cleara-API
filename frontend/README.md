# Cleara Dashboard - Frontend

Modern, responsive dashboard for the Cleara AI-Powered Data Cleaning Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── page.tsx        # Overview
│   │   │   ├── api-keys/       # API Keys management
│   │   │   ├── usage/          # Usage analytics
│   │   │   ├── billing/        # Billing & subscription
│   │   │   └── layout.tsx      # Dashboard layout
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── page.tsx            # Landing page
│   └── components/             # Reusable components
│       ├── dashboard/
│       │   ├── Sidebar.tsx
│       │   └── Header.tsx
│       └── Providers.tsx
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
└── package.json
```

## 🎨 Features

### Authentication
- ✅ Beautiful login/signup pages
- ✅ Social authentication (Google, GitHub)
- ✅ Password visibility toggle
- ✅ Form validation

### Dashboard
- ✅ Overview with analytics
- ✅ Real-time usage charts
- ✅ API endpoint distribution
- ✅ Recent activity feed
- ✅ Quick actions

### API Keys Management
- ✅ Create new API keys
- ✅ Copy to clipboard
- ✅ Reveal/hide keys
- ✅ Delete keys
- ✅ Track last usage

### Usage Analytics
- ✅ Monthly usage trends
- ✅ Endpoint distribution charts
- ✅ Daily request graphs
- ✅ Detailed breakdown table
- ✅ Export functionality

### Billing
- ✅ Current subscription display
- ✅ Pricing plans comparison
- ✅ Monthly/Annual toggle
- ✅ Payment method management
- ✅ Invoice history
- ✅ Download invoices

### UI/UX
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Toast notifications
- ✅ Loading states
- ✅ Collapsible sidebar
- ✅ Search functionality

## 🎨 Design System

### Colors
- **Primary Blue**: `#2D6CDF`
- **Success Green**: `#00C482`
- **Background Light**: `#F8FAFC`
- **Background Dark**: `#0A0A0A`

### Typography
- **UI Font**: Inter
- **Code Font**: JetBrains Mono

### Components
- Buttons (primary, secondary, outline, success)
- Cards (with hover effects)
- Inputs (with focus states)
- Badges (primary, success, warning, danger)
- Modals
- Tables

## 📊 Charts & Visualizations

Using **Recharts** for data visualization:
- Line charts (usage trends)
- Area charts (API usage)
- Bar charts (endpoint distribution)
- Pie charts (usage breakdown)

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Tailwind Configuration

Custom theme with:
- Extended color palette
- Custom animations
- Glassmorphism utilities
- Custom shadows

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All pages are fully responsive with mobile-first approach.

## 🎯 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Theme**: next-themes
- **Authentication**: NextAuth.js

## 🌟 Features Highlights

### Performance
- Server-side rendering
- Optimized images
- Code splitting
- Lazy loading

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

### Developer Experience
- TypeScript for type safety
- ESLint for code quality
- Hot reload
- Auto-import

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🎨 Customization

### Adding New Pages

1. Create file in `src/app/dashboard/[page-name]/page.tsx`
2. Add route to sidebar navigation
3. Implement page component

### Styling

- Use Tailwind utility classes
- Follow design system colors
- Use predefined component classes (btn, card, input, etc.)

## 🔐 Authentication

Currently using mock authentication. To integrate real auth:

1. Set up NextAuth.js providers
2. Configure API routes
3. Add session management
4. Protect routes with middleware

## 📈 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced filtering
- [ ] Custom date ranges
- [ ] Team management
- [ ] Webhook configuration
- [ ] API playground
- [ ] Documentation viewer

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run type-check
```

## 📞 Support

For support, email support@cleara.io

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ by the Cleara Team**
