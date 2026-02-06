# 🚕 BS Travel Delhi Cabs — Official Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Desktop%20First-blueviolet?style=for-the-badge)

> A fully modern, ultra-premium cab booking website for **BS Travel Delhi Cabs** — Delhi's trusted cab service for sightseeing, outstation tours, and airport transfers.

---

## 🌐 Live Preview

🔗 **[Visit Website](https://suraj-creation.github.io/Mahadevcab/)**

---

## 📸 Screenshots

| Hero Section | Fleet Section | Packages |
|:---:|:---:|:---:|
| Delhi skyline with 3D car visual | Glassmorphism car cards | Tour package cards |

---

## ✨ Features

### 🎨 Design System
- **Glassmorphism** — Frosted-glass UI elements with `backdrop-filter: blur()` and semi-transparent backgrounds
- **Claymorphism** — Soft 3D card effects with opposing box-shadows for a clay-like depth
- **Gradient Glow Buttons** — Animated CTAs with hover glow and pulse effects
- **80+ CSS Custom Properties** — Fully themeable design tokens for colors, spacing, typography, shadows, and z-index
- **Desktop-First Responsive** — Optimized for large screens, gracefully scales down to mobile

### 📄 Website Sections (12 Total)

| # | Section | Description |
|---|---------|-------------|
| 1 | **Sticky Header** | Glassmorphism navbar with logo, navigation, phone CTA, and hamburger menu |
| 2 | **Hero** | Full-screen parallax background with Delhi skyline, 3D floating car visual, trust badges, and animated stats |
| 3 | **Booking Form** | Quick quote form with pickup, destination, date/time, and WhatsApp redirect |
| 4 | **Services** | 3 service cards — Delhi Sightseeing, Outstation Tours, Airport Transfers |
| 5 | **Fleet** | 3 car options (Dzire, Ertiga, Crysta) with specs, pricing, and comparison table |
| 6 | **Packages** | 4 popular tour packages — Delhi Full Day, Agra, Jaipur, Vrindavan-Mathura |
| 7 | **Why Choose Us** | 6 feature cards highlighting professional drivers, clean cars, 24/7 support, etc. |
| 8 | **How It Works** | 3-step visual timeline — Book → Confirm → Ride |
| 9 | **Reviews** | 5-card carousel with auto-play, manual controls, and dot navigation |
| 10 | **FAQ** | 8-item accordion for common questions about pricing, safety, cancellation |
| 11 | **Final CTA** | Full-width call-to-action with Delhi night background |
| 12 | **Footer** | Contact info, quick links, social media, and copyright |

### ⚡ Interactive Features
- **Smooth Scroll Navigation** — Click nav links to glide to sections
- **Scroll Reveal Animations** — Elements fade in (up, left, right, scale) on scroll via IntersectionObserver
- **Counter Animation** — Stats count up when scrolled into view
- **Reviews Carousel** — Auto-rotating testimonials with swipe/click controls
- **FAQ Accordion** — Expandable Q&A with smooth open/close transitions
- **Parallax Background** — Subtle depth effect on hero background (desktop)
- **Tilt Effect** — 3D card tilt on hover for fleet and service cards (desktop)
- **Cursor Glow** — Ambient glow following cursor movement (desktop)
- **Back-to-Top Button** — Appears on scroll with smooth return
- **WhatsApp Integration** — Booking form submits directly via WhatsApp message
- **Image Preloading** — All critical images preloaded for instant rendering

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic markup with BEM-like class naming |
| **CSS3** | Custom properties, Grid, Flexbox, animations, `backdrop-filter`, `clip-path` |
| **Vanilla JavaScript** | No frameworks — IntersectionObserver, DOM manipulation, event handling |
| **Google Fonts** | Poppins (headings, 300–900) + Inter (body, 300–600) |
| **Font Awesome 6.5.1** | Icon library via CDN |

---

## 📁 Project Structure

```
Mahadevcab/
├── index.html                          # Main HTML file (all 12 sections)
├── README.md                           # This file
├── Reference.md                        # Design reference & requirements doc
│
├── css/
│   └── style.css                       # Complete design system (~3400+ lines)
│
├── js/
│   └── main.js                         # All interactions & animations (~475 lines)
│
└── assets/
    ├── IMAGE_UPLOAD_GUIDE.md           # Image naming & size reference
    └── images/
        ├── hero-bg-delhi-skyline.jpg   # Hero parallax background
        ├── hero-car.jpg                # Hero 3D car visual
        ├── service-airport-transfer.jpg
        ├── service-delhi-sightseeing.jpg
        ├── service-outstation-tours.jpg
        ├── car-dzire.jpg               # Fleet: Maruti Dzire
        ├── car-ertiga.jpg              # Fleet: Maruti Ertiga
        ├── car-crysta.jpg              # Fleet: Toyota Crysta
        ├── fleet-bg-road.jpg           # Fleet section background
        ├── pkg-delhi-fullday.jpg       # Package: Delhi tour
        ├── pkg-agra-daytrip.jpg        # Package: Agra tour
        ├── pkg-jaipur-daytrip.jpg      # Package: Jaipur tour
        ├── pkg-vrindavan-mathura.jpg    # Package: Vrindavan tour
        ├── why-us-bg-landmarks.jpg     # Why Choose Us background
        └── cta-bg-delhi-night.jpg      # Final CTA background
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools, package managers, or servers required

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Suraj-creation/Mahadevcab.git

# Navigate to the project
cd Mahadevcab

# Open in browser (any of these methods)
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux

# Or use VS Code Live Server
code . && # Install "Live Server" extension → Right-click index.html → "Open with Live Server"
```

### Deploy on GitHub Pages

1. Go to **Settings** → **Pages** in your GitHub repository
2. Under **Source**, select `main` branch and `/ (root)` folder
3. Click **Save** — your site will be live at `https://suraj-creation.github.io/Mahadevcab/`

---

## 🎨 Design Tokens (CSS Custom Properties)

The design system is fully configurable via CSS custom properties defined in `:root`:

```css
/* Colors */
--clr-primary: #ff6b35;          /* Orange — primary brand color */
--clr-primary-light: #ff8c5a;    /* Lighter orange for hovers */
--clr-secondary: #0ea5a0;        /* Teal — secondary accent */
--clr-gold: #f59e0b;             /* Gold — ratings & highlights */
--clr-dark: #0f172a;             /* Dark navy — backgrounds */

/* Typography */
--ff-primary: 'Poppins', sans-serif;   /* Headings */
--ff-secondary: 'Inter', sans-serif;   /* Body text */
--fs-hero: clamp(2.5rem, 5vw, 4rem);  /* Hero title */

/* Spacing */
--section-py: clamp(60px, 8vw, 120px); /* Section padding */
--container-max: 1320px;               /* Max content width */

/* Effects */
--glass-bg: rgba(255, 255, 255, 0.06); /* Glassmorphism fill */
--glass-blur: blur(20px);              /* Glass blur strength */
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target | Key Changes |
|------------|--------|-------------|
| `> 1024px` | Desktop | Full grid layouts, tilt effects, parallax, cursor glow |
| `≤ 1024px` | Tablet | 2-column grids, reduced spacing, hamburger menu |
| `≤ 768px` | Mobile | Single-column stacking, smaller fonts, touch-optimized |
| `≤ 480px` | Small Mobile | Compact cards, minimal padding, full-width buttons |

---

## 📞 Business Information

| Detail | Value |
|--------|-------|
| **Business Name** | BS Travel Delhi Cabs |
| **Owner** | Mahadev |
| **Phone** | +91-9999-999999 |
| **Services** | Delhi Sightseeing, Outstation Tours, Airport Transfers |
| **Fleet** | Maruti Dzire, Maruti Ertiga, Toyota Innova Crysta |
| **Coverage** | Delhi NCR, Agra, Jaipur, Vrindavan, Mathura, and more |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary to **BS Travel Delhi Cabs**. All rights reserved.

---

## 🙏 Acknowledgments

- **Google Fonts** — [Poppins](https://fonts.google.com/specimen/Poppins) & [Inter](https://fonts.google.com/specimen/Inter)
- **Font Awesome** — [Icon Library](https://fontawesome.com/)
- Design inspired by modern glassmorphism and claymorphism UI trends

---

<p align="center">
  Made with ❤️ for <strong>BS Travel Delhi Cabs</strong> — Delhi's Most Trusted Cab Service
</p>
