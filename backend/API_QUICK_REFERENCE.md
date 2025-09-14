# 🚀 KalaMitrah API - Quick Reference Card

## 🌐 Base URL: `http://localhost:5000`

---

## 🔑 **Authentication**
```
POST /api/auth/buyers/register      // Buyer signup
POST /api/auth/buyers/login         // Buyer login
POST /api/auth/sellers/register     // Seller signup  
POST /api/auth/sellers/login        // Seller login

GET  /api/auth/google/buyer         // Google OAuth (Buyer)
GET  /api/auth/google/seller        // Google OAuth (Seller)
```

## 🛍️ **Products**
```
GET  /api/products                  // All products (public)
GET  /api/products/trending         // Trending products (public)
GET  /api/products/:id              // Single product (public)
POST /api/products                  // Create product (seller only)
GET  /api/products/seller/my-products // Seller's products
```

## 🤖 **AI Features** (Seller only)
```
POST /api/products/ai/description        // AI product description
POST /api/products/ai/price-suggestion   // AI price suggestion
POST /api/products/:id/ai/image-edit     // AI image analysis
POST /api/products/trends/:id/ai/video-edit // AI video analysis
```

## 🛒 **Cart** (Auth required)
```
GET    /api/cart                    // Get cart
POST   /api/cart/add                // Add to cart
PUT    /api/cart/update             // Update cart
DELETE /api/cart/remove/:productId  // Remove from cart
```

## 📦 **Orders**
```
POST  /api/orders/place-order       // Place order (buyer)
GET   /api/orders/my-orders         // My orders (buyer)
GET   /api/orders/seller-sales      // Sales (seller)
PATCH /api/orders/:id/status        // Update status (seller)
```

## 🎥 **Trends**
```
GET   /api/trends                   // All trends (public)
POST  /api/trends                   // Create trend (seller)
PATCH /api/trends/:id/like          // Like trend (auth)
```

## 📂 **Categories**
```
GET  /api/categories                // All categories (public)
GET  /api/categories/:id/products   // Products by category (public)
POST /api/categories                // Create category (seller)
```

## 📰 **News** (Auth required)
```
GET  /api/news                      // Art news articles
```

## 📊 **Analytics** (Seller only)
```
GET  /api/artisan/insights          // Business insights
POST /api/artisan/insights/generate-plan // Growth plan
```

---

## 🔐 **Auth Header Format**
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📤 **File Upload Fields**
- **Product Images**: `images` (max 5 files)
- **Profile Image**: `image` (single file)
- **Trend Video**: `video` (single file)

---

**🎯 Key Features:**
- ✅ JWT Authentication
- ✅ Role-based Access (Buyer/Seller)
- ✅ Google OAuth Integration
- ✅ AI-powered Product Tools
- ✅ Real-time News Integration
- ✅ File Upload Support
- ✅ Complete E-commerce Flow

**📞 Need help? Check the full API documentation!**
