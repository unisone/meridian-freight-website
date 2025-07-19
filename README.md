# Meridian Export Website

A modern, responsive website for Meridian Export - a professional export services company. Built with React, Tailwind CSS, and modern web technologies.

## 🚀 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive Layout**: Fully responsive across all devices
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Contact Forms**: Functional contact forms with validation
- **Product Showcase**: Interactive product filtering and display
- **Service Pages**: Comprehensive service descriptions
- **Global Offices**: Multi-location contact information
- **Newsletter Signup**: Email subscription functionality
- **SEO Optimized**: Meta tags, structured data, and performance optimized

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Smooth animations and transitions
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meridian-export-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation component
│   ├── Hero.js         # Hero section
│   ├── Services.js     # Services showcase
│   ├── About.js        # About section
│   ├── Products.js     # Products display
│   ├── Contact.js      # Contact form
│   └── Footer.js       # Footer component
├── pages/              # Page components
│   └── HomePage.js     # Main homepage
├── App.js              # Main app component
├── index.js            # React entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Gray scale (#f8fafc to #0f172a)
- **Accent**: Yellow (#eab308)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

### Components
- **Buttons**: Primary and secondary variants
- **Cards**: Rounded corners with shadows
- **Forms**: Clean, accessible form elements
- **Navigation**: Sticky header with scroll effects

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to modify the color palette:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... other shades
    900: '#0c4a6e',
  }
}
```

### Content
Update component files to modify:
- Company information
- Contact details
- Service descriptions
- Product listings
- Office locations

### Styling
Modify `src/index.css` for custom styles and component classes.

## 📄 Pages

- **Home** (`/`): Landing page with all sections
- **About** (`/about`): Company information and values
- **Services** (`/services`): Detailed service offerings
- **Products** (`/products`): Product catalog with filtering
- **Contact** (`/contact`): Contact form and information

## 🎯 Key Features

### Hero Section
- Animated background with gradient effects
- Compelling copy and call-to-action buttons
- Statistics showcase
- Scroll indicator

### Services Section
- 6 main service categories
- Feature lists for each service
- Interactive cards with hover effects
- CTA section

### About Section
- Company story and mission
- Key statistics
- Core values
- Certifications and credentials

### Products Section
- Category filtering
- Product cards with images
- Rating and view counts
- Feature tags

### Contact Section
- Functional contact form
- Contact information cards
- Global office locations
- Newsletter signup

### Footer
- Comprehensive link structure
- Social media links
- Newsletter subscription
- Legal links

## 🔍 SEO Features

- Semantic HTML structure
- Meta tags and descriptions
- Open Graph tags
- Structured data
- Performance optimized

## 🎨 Animation Features

- Smooth scroll behavior
- Hover effects on cards and buttons
- Fade-in animations
- Transform effects
- Loading states

## 📞 Support

For questions or support, please contact:
- Email: info@meridianexport.com
- Phone: +1 (555) 123-4567

## 📄 License

This project is licensed under the MIT License.

---

**Meridian Export** - Connecting Global Markets with Quality Products 