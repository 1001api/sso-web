![banner](https://i.imgur.com/N1mLxOx.png)

# SSO Web (work in progress, contributions are welcome)

A modern, passwordless Single Sign-On (SSO) authentication frontend built with SvelteKit 5, providing seamless authentication through social providers (Google, GitHub) and email OTP verification.

## ✨ Features

- **🔐 Passwordless Authentication**
  - Email OTP (One-Time Password) verification
  - Google OAuth integration
  - GitHub OAuth integration
  
- **⚡ Modern Tech Stack**
  - SvelteKit 5 with Svelte 5 runes
  - TypeScript for type safety
  - TailwindCSS 4 for styling
  - Flowbite Svelte components
  
- **🎨 Beautiful UI/UX**
  - Responsive design with mobile-first approach
  - Custom background images for auth pages
  - Toast notifications for user feedback
  - Smooth transitions and animations
  
- **🔄 Token Management**
  - Automatic token refresh with Axios interceptors
  - Secure cookie-based authentication
  - Request queuing during token refresh
  
- **🚀 Production Ready**
  - Static site generation with `@sveltejs/adapter-static`
  - SEO optimized with meta tags
  - PWA ready with web manifest
  - Environment variable configuration

## 📋 Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn
- Backend API server (configured via `VITE_API_URL`)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sso_web_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8181/api/v1
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev

# or start and open in browser
npm run dev -- --open
```

The application will be available at `http://localhost:5173` (default Vite port).

## 🏗️ Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
sso_web_v1/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Main login page
│   │   ├── +layout.svelte         # Root layout with SEO
│   │   └── success/
│   │       └── +page.svelte       # Success redirect page
│   ├── helper/
│   │   └── axios.ts               # Axios instance with interceptors
│   ├── lib/
│   │   └── index.ts               # Library exports
│   ├── app.css                    # Global styles & Tailwind config
│   ├── app.html                   # HTML template
│   └── app.d.ts                   # TypeScript declarations
├── static/                        # Static assets
│   ├── bg-auth-2.png             # Login background
│   ├── bg-auth-success.png       # Success background
│   ├── favicon.ico               # Favicon
│   └── site.webmanifest          # PWA manifest
├── package.json
├── svelte.config.js              # SvelteKit configuration
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔑 Authentication Flow

### Email OTP Flow
1. User enters email address
2. System sends OTP to email
3. User enters 6-digit OTP code
4. System verifies OTP and authenticates
5. User redirected to success page
6. Auto-redirect to original destination

### Social OAuth Flow
1. User clicks Google/GitHub login button
2. Popup window opens with OAuth provider
3. User authenticates with provider
4. Popup sends message to parent window
5. Access token stored in localStorage
6. User redirected to success page

## 🔧 Configuration

### API Endpoints

The application expects the following backend endpoints:

- `POST /auth/otp` - Request OTP code
- `POST /auth/otp/verify` - Verify OTP code
- `GET /auth/social/google` - Google OAuth
- `GET /auth/social/github` - GitHub OAuth
- `POST /auth/refresh` - Refresh access token

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8181/api/v1` |

## 🎨 Customization

### Branding

Update branding in `src/routes/+layout.svelte`:
- Site title and description
- OG tags for social sharing
- Theme colors
- Favicon references

### Styling

Modify `src/app.css` to customize:
- Primary color palette
- Font family (currently Poppins)
- Tailwind theme extensions

### Background Images

Replace images in `static/` directory:
- `bg-auth-2.png` - Login page background
- `bg-auth-success.png` - Success page background

## 📦 Dependencies

### Core
- **SvelteKit** `^2.16.0` - Full-stack framework
- **Svelte** `^5.0.0` - UI framework
- **TypeScript** `^5.5.0` - Type safety

### UI Components
- **Flowbite Svelte** `^0.48.4` - Component library
- **Flowbite Svelte Icons** `^2.1.0` - Icon set
- **TailwindCSS** `^4.0.0` - Utility-first CSS

### Utilities
- **Axios** `^1.9.0` - HTTP client
- **@k4ung/svelte-otp** `^0.0.9` - OTP input component

## 🔒 Security Features

- **CSRF Protection**: Cookie-based authentication with credentials
- **Token Refresh**: Automatic token renewal with request queuing
- **Secure Storage**: Access tokens stored in localStorage (consider httpOnly cookies for production)
- **Origin Validation**: Message validation for OAuth popup (commented, enable in production)
- **Request Retry**: Failed requests automatically retried after token refresh

## 🚢 Deployment

This project uses `@sveltejs/adapter-static` for static site generation. Deploy to:

- **Netlify**: `npm run build` → Deploy `build/` directory
- **Vercel**: Auto-detected SvelteKit project
- **GitHub Pages**: Configure base path in `svelte.config.js`
- **Any static host**: Upload `build/` directory

### Build Output

The static adapter generates:
- Pre-rendered HTML pages
- Client-side JavaScript bundles
- Optimized CSS
- Static assets

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run type checking |
| `npm run check:watch` | Type checking in watch mode |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Tips

- **OTP Timer**: Default 1:30 minutes, configurable in `+page.svelte`
- **Redirect URL**: Pass via `?redirect=` query parameter
- **Default Redirect**: Falls back to `https://1001api.com`
- **Popup Blockers**: Users must allow popups for social login

## 🐛 Troubleshooting

### Popup Blocked
Enable popups in browser settings for the application domain.

### OTP Not Received
- Check spam/promotions folder
- Verify email address is correct
- Wait for timer to expire and resend

### Token Refresh Failed
- Check backend `/auth/refresh` endpoint
- Verify cookies are enabled
- Check CORS configuration