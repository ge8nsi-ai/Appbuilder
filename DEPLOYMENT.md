# Whop Deployment Guide - UVZ Course Launchpad AI

## 🚀 Quick Deployment

Your Whop app is ready for deployment! Here's how to upload it to Whop:

### 1. Build and Package the App

```bash
# Run the deployment script
./deploy-whop.sh
```

This will create a `whop-deploy` directory with all necessary files.

### 2. Upload to Whop

1. **Go to your Whop Developer Dashboard**
   - Visit: https://whop.com/developers
   - Sign in with your Whop account

2. **Find Your App**
   - Look for app ID: `app_1CSGwlh2Of6r50`
   - Click "Edit App" or "Manage"

3. **Upload Files**
   - Upload all files from the `whop-deploy` directory
   - Make sure `index.html` is the entry point
   - Upload `manifest.json` for app configuration

### 3. Configure App Settings

In your Whop app settings, add:

**Required Environment Variables:**
```
WHOP_API_KEY=fUaz0J7H-ixhluIyo7FpGhhDSBa_50_5Cw6xlA48E38
NEXT_PUBLIC_WHOP_APP_ID=app_1CSGwlh2Of6r50
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_qBykJdUrk3W1wv
```

**Gemini API Key:**
- Go to App Settings → Environment Variables
- Add: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
- Get your Gemini API key from: https://makersuite.google.com/app/apikey

### 4. App Permissions

Ensure your app has these permissions:
- ✅ `courses:create` - Create courses
- ✅ `courses:read` - Read course data
- ✅ `courses:update` - Update courses
- ✅ `products:create` - Create products
- ✅ `products:read` - Read product data
- ✅ `products:update` - Update products
- ✅ `experiences:read` - Read experience data

### 5. Test Your App

1. **Preview Mode**: Test in Whop's preview environment
2. **Live Testing**: Deploy to a test experience first
3. **Full Deployment**: Once tested, make it live

## 📋 App Configuration

**App Details:**
- **Name**: UVZ Course Launchpad AI
- **ID**: app_1CSGwlh2Of6r50
- **Company**: biz_qBykJdUrk3W1wv
- **Category**: Education
- **Type**: iframe

**Features:**
- AI-powered UVZ analysis
- Automated course creation
- Real Whop API integration
- FrostUI components
- Complete marketing asset generation

## 🔧 Troubleshooting

### Common Issues:

1. **API Key Errors**
   - Verify your Gemini API key is correct
   - Check Whop API key permissions

2. **Build Errors**
   - Run `npm install` before building
   - Check for missing dependencies

3. **Whop Integration Issues**
   - Verify app permissions
   - Check environment variables
   - Ensure proper iframe configuration

### Support:
- Check Whop Developer Docs: https://docs.whop.com
- Gemini API Docs: https://ai.google.dev/docs

## 🎯 Post-Deployment

After successful deployment:

1. **Test the Complete Flow**
   - UVZ input collection
   - AI course concept generation
   - Course creation on Whop
   - Product listing

2. **Monitor Performance**
   - Check API usage
   - Monitor error logs
   - Track user engagement

3. **Iterate and Improve**
   - Gather user feedback
   - Optimize AI prompts
   - Enhance UI/UX

## 📊 Success Metrics

Track these metrics:
- Courses created per day
- User completion rate
- API response times
- Error rates
- User satisfaction

---

**Your app is now ready for Whop! 🎉**

The UVZ Course Launchpad AI will automate the entire digital product creation process, from UVZ analysis to live course publishing on Whop.