# Railway Deployment Guide (customer-backend)

This backend is ready to run on Railway with container-safe host/port binding.

## 1) Create Railway service

1. Open Railway dashboard.
2. New Project -> Deploy from GitHub Repo.
3. Select `officialkitter/Food-Delivery-Platform`.
4. Set the **Root Directory** to `customer-backend`.
5. Railway will detect Node, install dependencies, and start the service with `node server.js`.

## 2) Required environment variables

Set these in Railway service Variables:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=8000` (Railway may override automatically; keeping this is fine)
- `MONGODB_URI=...`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Recommended app variables:

- `SUPABASE_PROFILE_TABLE=account_profiles`
- `SUPABASE_ORDER_TABLE=orders`
- `SUPABASE_ORDER_ITEM_TABLE=order_items`
- `SUPABASE_PAYMENT_TABLE=payments`
- `SUPABASE_COUPON_TABLE=coupons`
- `CORS_ORIGIN=https://<your-frontend-domain>`

Optional integrations (set only if you use them):

- `GOOGLE_EXPO_CLIENT_ID`
- `GOOGLE_WEB_CLIENT_ID`
- `GOOGLE_ANDROID_CLIENT_ID`
- `GOOGLE_IOS_CLIENT_ID`
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_PLACES_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_SECURE=true`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIREBASE_PROFILE_SYNC=false`
- `FIREBASE_WEB_API_KEY`

Firebase on Railway:

- Prefer `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` as Railway variables.
- Only set `FIREBASE_SERVICE_ACCOUNT_PATH` if you are actually shipping a JSON file inside the container.
- If your private key was pasted without PEM headers, the backend now repairs common malformed values automatically.

## 3) Health checks

Railway health check path is configured as:

- `/api/v1/health`

Infra deep health endpoint (optional monitoring):

- `/api/v1/health/infrastructure`

## 4) Verify deploy

After deployment:

1. Open service logs and confirm line similar to:
   - `Backend delivery server running on 0.0.0.0:<PORT> (production)`
2. Open deployed URL + `/api/v1/health` and confirm HTTP 200.

## 5) Connect mobile app to Railway backend

In your frontend environment (`customer-app`):

- `EXPO_PUBLIC_API_BASE_URL=https://<your-railway-backend-domain>/api/v1`

Then restart Expo with cache clear.

## 6) Common failure fixes

- `npm warn config production Use --omit=dev instead.`:
  - This is an npm warning, not an application failure.
  - It appears when Railway starts the app through `npm` with legacy production config.
  - This service is configured to start with `node server.js`, which avoids the warning at runtime.

- Build fails on Node version:
  - This project sets `engines.node >=22`. Ensure Railway uses Node 22+.
- 503 on vendor endpoints:
  - Check `MONGODB_URI` is valid and DB network access allows Railway.
- CORS errors:
  - Set `CORS_ORIGIN` to exact frontend origin(s), comma-separated.
- Firebase init warning:
  - If Firebase features are used, set service account vars; otherwise warning is expected.
