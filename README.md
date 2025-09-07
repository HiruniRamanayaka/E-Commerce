# 🛡️ Secure E-Commerce Web Application  

This project is a **secure e-commerce web application** built as part of **Assessment: Secure Web Application Development**.  
It implements **authentication & access control using Auth0 (OIDC)** and **Google login**, follows the **OWASP Top 10 security guidelines**, and ensures users can only manage their own orders. 

---

## 🚀 Features  

- ✅ **Authentication & Logout** using **Auth0 OIDC** and **Google Social Login**  
- ✅ **Signup** & store user profile metadata (name, email, phone, country) in Auth0  
- ✅ **User Roles**:  
  - **User** → Browse products, add to cart, purchase, view own orders, view profile  
  - **Admin** → View/manage all orders, assign roles  
- ✅ **Products**:  
  - View all products and product details (public, no login required)  
  - Add products to cart (requires login)  
  - Checkout & purchase  
- ✅ **Orders**:  
  - Place order with: username (from IDP claim), date (no past dates, exclude Sundays), delivery time (10/11/12 AM), delivery location (district), quantity, custom message  
  - View purchase history (past + upcoming)  
- ✅ **Profile**: Display authenticated user info (name, email, contact number, country) from Auth0 metadata  
- ✅ **Security**:  
  - Role-based access control (RBAC)  
  - Only users can see their own orders  
  - Admin has elevated privileges  
  - Protected against **OWASP Top 10 vulnerabilities**  

---

## 🛠️ Tech Stack  

- **Frontend**: React + Vite + Auth0 SDK  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Authentication**: Auth0 (OIDC, RS256) + Google OAuth2  
- **Deployment-ready**: HTTPS supported  

---

## ⚙️ Setup Instructions  

### Prerequisites  

- Node.js (v18+)  
- MongoDB (local or Atlas)  
- Auth0 Account → [https://auth0.com](https://auth0.com)  
- Google Cloud Account → [https://console.cloud.google.com/](for Google login)  

---

### 1️⃣ Clone the Repository
- git clone <your-repo-url>
- cd <project-root>

- Configure Environment Variables
    Both backend and frontend have their own .env files. (Create .env)

---

### 2️⃣ Auth0 Setup  

1. **Create Auth0 Account**  
   - Sign up at [Auth0 Dashboard](https://manage.auth0.com/)  

2. **Create Application (Frontend)**  
   - Type: **Single Page App (SPA)**  
   - Allowed Callback URLs: `https://localhost:5173`  
   - Allowed Logout URLs: `https://localhost:5173`  
   - Save **Domain** & **Client ID** → put into `frontend/.env`  

3. **Create API (Backend)**  
   - Name: `ECommerceAPI`  
   - Identifier: `https://ecommerce-api`  
   - Signing Algorithm: **RS256**  

4. **Enable RBAC**  
   - Go to API → Settings → Enable **RBAC** and **Add Permissions in Access Token**  

5. **Create Roles**  
   - **User** → default role for new signups  
   - **Admin** → elevated privileges  
   - Assign roles to users manually or via post-login actions  

6. **Post-Login Action (Optional)**  
   - Create action to assign `User` role by default on signup  

7. **Extend User Profile Metadata**  
   - Enable **Classic Login**  
   - Customize signup form to collect: name, phone, country  
   - Store them in `user_metadata`  

---

### 3️⃣ Google OAuth Setup  

1. Go to [Google Cloud Console](https://console.cloud.google.com/)  
2. Create **OAuth 2.0 Client ID** (type: Web Application)  
3. Add redirect URIs:  
   - `https://localhost:5173`  
   - `https://localhost:4000/callback` (if backend handles exchange)  
4. Get **Client ID** & **Client Secret**  
5. Add to Auth0 as a **Google Social Connection**  

---

### 4️⃣ Machine-to-Machine App (Optional for Admin API)  

1. In Auth0 → Applications → Create **M2M Application**  
2. Authorize it to access `ECommerceAPI`  
3. Assign it `Ecommerce M2M` role  

---

### 5️⃣ Configure Environment Variables  

#### 🔹 Backend `.env`  

    PORT=4000
    MONGO_URI=mongodb://127.0.0.1:27017/ecom
    DOMAIN=your-auth0-domain
    ISSUER_BASE_URL=https://your-auth0-domain
    API_AUDIENCE=https://ecommerce-api
    FRONTEND_URL=https://localhost:5173
    AUTH0_ROLES_NAMESPACE=https://ecommerce-api.com/roles

#### 🔹 Frontend .env

    VITE_API_BASE_URL=https://localhost:4000
    VITE_AUTH0_DOMAIN=your-auth0-domain
    VITE_AUTH0_CLIENT_ID=your-auth0-client-id
    VITE_AUTH0_AUDIENCE=https://ecommerce-api
    VITE_AUTH0_ROLES_NAMESPACE=https://ecommerce-api/roles
    VITE_CUSTOM_CLAIMS_URL=https://ecommerce-api.com/

---

### 6️⃣ Database Setup

1. Install MongoDB or create a free MongoDB Atlas cluster
2. Create database: ecom
3. Seed sample products:

    cd backend
    node seed.js

---


### 5️⃣ Run the Application
#### Backend
    cd backend
    npm install
    node index.js (for development npx nodmon index.js)

#### Frontend
    cd frontend
    npm install
    npm run dev

Now open 👉 http://localhost:5173

---

### 🔒 Security Considerations
   -  ✅ Input validation & sanitization (no SQLi / injection risks)
   -  ✅ CSRF protection on sensitive requests
   -  ✅ HTTPS enforced in production
   -  ✅ Access Control → users can only manage their own orders
   -  ✅ RBAC with roles/permissions
   -  ✅ No secrets in repo (all in .env)
   -  ✅ Tokens validated using Auth0 JWKS
   -  ✅ No hardcoded credentials

---

### 🧪 Testing & Manual Checks
  -  Login & logout works with Auth0
  -  User profile correctly displays IDP claims
  -  Order creation validates date/time constraints
  -  Orders tied to the authenticated user only
  -  Role-based access works (if roles enabled)
  -  No OWASP Top 10 vulnerabilities detected via manual tests

--- 

### 📦 Project Structure
project-root/
│── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── index.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
│── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
│
│── SE2021XXX.json
│── README.md

---

### 📝 Blog

👉 My Blog on Medium
 [](replace with actual link)

#### Covers:
  -  OWASP Top 10 mitigations
  -  OIDC authentication with Auth0
  -  Role-based access control (RBAC)
  -  Implementation details & challenges
  -  Learnings from the project


### ⚠️ Notes

-  Replace all **your-auth0-** placeholders with real values from your Auth0 tenant.
-  Configure Google OAuth correctly in **both Google Cloud & Auth0**.
-  Assign default roles using post-login actions for easier onboarding.
-  Keep .env files private. Never commit secrets to GitHub. (Use gitignore)
-  Configure HTTPS if deploying to production.


### 👤 Author
## R.K.H.K.Ramanayaka
