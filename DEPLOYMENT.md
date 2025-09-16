# Civix App - Deployment Guide

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop Deployment
1. Build the project locally:
   ```bash
   cd civix-app
   npm install
   npm run build
   ```
2. Drag the `build` folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 2: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `civix-app`

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd civix-app
npm install
npm run build

# Deploy
netlify deploy --prod --dir=build
```

## ▲ Deploy to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from civix-app directory
cd civix-app
vercel --prod
```

### Option 2: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to [Vercel](https://vercel.com)
3. Build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `civix-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

## 📱 Features Optimized for Deployment

- ✅ Mobile-responsive design with bottom navigation
- ✅ Progressive Web App (PWA) ready
- ✅ SEO optimized with meta tags
- ✅ Social media sharing optimization
- ✅ Performance optimized with proper caching headers
- ✅ SPA routing configured for both platforms

## 🔧 Configuration Files Included

- `netlify.toml` - Netlify configuration with redirects and headers
- `vercel.json` - Vercel configuration with routing and security headers
- `public/_redirects` - Netlify fallback redirects file
- Updated `manifest.json` - PWA configuration
- Enhanced `index.html` - SEO and social media meta tags

## 🌐 Environment Variables

### Google Maps API
The app now includes GPS location tagging functionality that requires Google Maps API.

**API Key**: `AIzaSyDcuX-NYTvG27ulhP77GzDgJea-QPQsW5g`
**Libraries**: Geometry, Places
**Usage**: Reverse geocoding and nearby landmarks detection

### For Production Deployment
If you need to change the API key for production:

### Netlify
- Go to Site Settings > Environment Variables
- Add `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`
- Update `public/index.html` to use the environment variable

### Vercel
- Go to Project Settings > Environment Variables  
- Add `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`
- Update `public/index.html` to use the environment variable

**Note**: The current implementation includes the API key directly in the HTML for immediate deployment. For production, consider using environment variables for better security.

## 📊 Performance Tips

1. The build output is optimized for production
2. Static assets are configured for long-term caching
3. Security headers are included for both platforms
4. The app is configured as a Single Page Application (SPA)

## 🔍 Testing Your Deployment

After deployment, test these features:
- [ ] All screens load correctly (Home, Reports, Leaderboard, Profile)
- [ ] Bottom navigation works on mobile devices
- [ ] App works offline (PWA features)
- [ ] All responsive breakpoints function properly
- [ ] Social media sharing displays correct information

## 📞 Support

If you encounter any deployment issues:
1. Check the build logs in your deployment platform
2. Ensure all dependencies are properly installed
3. Verify that the build command completes successfully locally
4. Check browser console for any runtime errors

Happy deploying! 🎉