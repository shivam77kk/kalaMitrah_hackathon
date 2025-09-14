# 🚀 KalaMitrah API Documentation for Frontend Integration

## 🌐 Base URL
```
http://localhost:5000
```

## 🔐 Authentication
- **JWT Token**: Required for protected routes
- **Header**: `Authorization: Bearer <token>`
- **Role-based**: Some routes require specific roles (buyer/seller)

---

## 📋 **Complete API Routes List**

### 🔑 **Authentication Routes**

#### **Buyer Authentication** (`/api/auth/buyers`)
```javascript
// Registration & Login
POST   /api/auth/buyers/register           // Register new buyer
POST   /api/auth/buyers/login              // Login buyer
GET    /api/auth/buyers/refresh-token      // Refresh access token
GET    /api/auth/buyers/logout             // Logout buyer

// Profile Management (🔒 Auth Required)
POST   /api/auth/buyers/profile/update           // Update buyer profile
POST   /api/auth/buyers/profile/upload-image     // Upload profile image
POST   /api/auth/buyers/profile/change-password  // Change password
```

#### **Seller Authentication** (`/api/auth/sellers`)
```javascript
// Registration & Login
POST   /api/auth/sellers/register          // Register new seller
POST   /api/auth/sellers/login             // Login seller
POST   /api/auth/sellers/refresh           // Refresh access token

// Profile Management (🔒 Auth Required + Seller Role)
PUT    /api/auth/sellers/profile           // Update seller profile
POST   /api/auth/sellers/profile/image     // Upload profile image
PUT    /api/auth/sellers/password          // Change password
POST   /api/auth/sellers/logout            // Logout seller
```

#### **Google OAuth** (`/api/auth/google`)
```javascript
// Buyer Google Auth
GET    /api/auth/google/buyer                    // Initiate buyer Google login
GET    /api/auth/google/callback/buyer           // Buyer Google callback
POST   /api/auth/google/logout                   // Google logout

// Seller Google Auth
GET    /api/auth/google/seller                   // Initiate seller Google login
GET    /api/auth/google/callback/seller          // Seller Google callback
POST   /api/auth/google/logout                   // Google logout
```

---

### 🛍️ **Product Management** (`/api/products`)

#### **Public Product Routes**
```javascript
GET    /api/products                       // Get all products
GET    /api/products/trending              // Get trending products
GET    /api/products/:productId            // Get product by ID
```

#### **Seller Product Routes** (🔒 Auth Required + Seller Role)
```javascript
POST   /api/products                       // Create new product (with image upload)
GET    /api/products/seller/my-products    // Get seller's products
```

#### **🤖 AI-Powered Features** (🔒 Auth Required + Seller Role)
```javascript
POST   /api/products/ai/description              // Generate AI product description
POST   /api/products/ai/price-suggestion         // Get AI price suggestion
POST   /api/products/:productId/ai/image-edit    // AI image analysis & suggestions
POST   /api/products/trends/:trendId/ai/video-edit // AI video analysis & suggestions
```

---

### 🛒 **Shopping Cart** (`/api/cart`) (🔒 All routes require authentication)
```javascript
GET    /api/cart                          // Get user's cart
POST   /api/cart/add                      // Add item to cart
PUT    /api/cart/update                   // Update cart item
DELETE /api/cart/remove/:productId        // Remove item from cart
```

---

### 📦 **Order Management** (`/api/orders`)

#### **Buyer Order Routes** (🔒 Auth Required)
```javascript
POST   /api/orders/place-order            // Place new order
GET    /api/orders/my-orders              // Get buyer's orders
```

#### **Seller Order Routes** (🔒 Auth Required + Seller Role)
```javascript
GET    /api/orders/seller-sales           // Get seller's sales
PATCH  /api/orders/:orderId/status        // Update order status
```

---

### 🎥 **Trends/Videos** (`/api/trends`)
```javascript
// Public Routes
GET    /api/trends                        // Get all trends

// Seller Routes (🔒 Auth Required + Seller Role)
POST   /api/trends                        // Create new trend (with video upload)

// User Interaction (🔒 Auth Required)
PATCH  /api/trends/:trendId/like          // Like/unlike a trend
```

---

### 📂 **Categories** (`/api/categories`)
```javascript
// Public Routes
GET    /api/categories                    // Get all categories
GET    /api/categories/:categoryId/products // Get products by category

// Admin Routes (🔒 Auth Required + Seller Role)
POST   /api/categories                    // Create new category
```

---

### 📰 **Global Art News** (`/api/news`) (🔒 Auth Required)
```javascript
GET    /api/news                          // Get art-related news articles
```

---

### 📊 **Artisan Insights** (`/api/artisan`) (🔒 Auth Required + Seller Role)
```javascript
GET    /api/artisan/insights              // Get artisan business insights
POST   /api/artisan/insights/generate-plan // Generate growth plan
```

---

## 🔧 **Request/Response Examples**

### **1. User Registration (Buyer)**
```javascript
// POST /api/auth/buyers/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+91-9876543210",
  "address": "123 Street, City, State"
}

// Response
{
  "success": true,
  "message": "Buyer registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  }
}
```

### **2. Product Creation (Seller)**
```javascript
// POST /api/products
// Content-Type: multipart/form-data
FormData {
  name: "Hand-carved Wooden Bowl",
  description: "Beautiful traditional bowl...",
  price: 1500,
  category: "categoryId",
  stock: 10,
  images: [File1, File2, File3] // Max 5 images
}

// Response
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "...",
    "name": "Hand-carved Wooden Bowl",
    "price": 1500,
    "images": ["cloudinary-url1", "cloudinary-url2"],
    "seller": {...}
  }
}
```

### **3. AI Description Generation**
```javascript
// POST /api/products/ai/description
{
  "productName": "Hand-carved Wooden Bowl",
  "productCategory": "Kitchenware",
  "keyFeatures": "Made from mango wood, food-safe finish, traditional carving"
}

// Response
{
  "success": true,
  "message": "Description generated successfully",
  "description": "Discover the exquisite Hand-carved Wooden Bowl..."
}
```

### **4. AI Price Suggestion**
```javascript
// POST /api/products/ai/price-suggestion
{
  "productName": "Silk Scarf",
  "productCategory": "Fashion",
  "material": "Pure silk",
  "craftsmanship": "Hand-woven",
  "targetMarket": "Premium"
}

// Response
{
  "success": true,
  "message": "Price suggestion generated successfully",
  "data": {
    "price": 1840,
    "reasoning": "Based on premium materials and traditional craftsmanship..."
  }
}
```

### **5. Cart Operations**
```javascript
// POST /api/cart/add
{
  "productId": "productId123",
  "quantity": 2
}

// GET /api/cart Response
{
  "success": true,
  "data": {
    "items": [
      {
        "product": {...},
        "quantity": 2,
        "price": 1500
      }
    ],
    "totalAmount": 3000
  }
}
```

---

## 🔒 **Authentication Headers**

For all protected routes, include:
```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

For file uploads:
```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
  // Don't set Content-Type for FormData, browser will set it automatically
}
```

---

## 📤 **File Upload Endpoints**

### **Product Images**
- **Endpoint**: `POST /api/products`
- **Field Name**: `images` (array, max 5 files)
- **Types**: JPG, PNG, WEBP
- **Max Size**: 10MB per file

### **Profile Images**
- **Buyer**: `POST /api/auth/buyers/profile/upload-image`
- **Seller**: `POST /api/auth/sellers/profile/image`
- **Field Name**: `image` (single file)
- **Types**: JPG, PNG, WEBP
- **Max Size**: 5MB

### **Trend Videos**
- **Endpoint**: `POST /api/trends`
- **Field Name**: `video` (single file)
- **Types**: MP4, MOV, AVI
- **Max Size**: 50MB

---

## ⚠️ **Error Handling**

### **Common Error Responses**
```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Validation error message"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Access token required"
}

// 403 Forbidden
{
  "success": false,
  "message": "Insufficient permissions"
}

// 404 Not Found
{
  "success": false,
  "message": "Resource not found"
}

// 500 Server Error
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🌟 **Special Features**

### **🤖 AI Features** (All require seller authentication)
1. **AI Description Generator** - Creates compelling product descriptions
2. **AI Price Suggestion** - Suggests optimal pricing based on materials/craftsmanship
3. **AI Image Analysis** - Provides image enhancement suggestions
4. **AI Video Analysis** - Offers video improvement recommendations

### **📰 Real-time News Integration**
- Fetches live art-related news from external APIs
- Quality filtering and curation

### **🔄 Google OAuth Integration**
- Separate flows for buyers and sellers
- Automatic profile creation and linking

---

## 🚀 **Frontend Integration Tips**

1. **Token Management**: Store JWT in localStorage/sessionStorage
2. **File Uploads**: Use FormData for multipart requests
3. **Error Handling**: Always check `success` field in responses
4. **Role-based UI**: Show/hide features based on user role
5. **Real-time Updates**: Consider WebSocket for live features (future)

---

**🎉 All endpoints are production-ready and tested!**
**Base URL: `http://localhost:5000`**
