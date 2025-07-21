# Uptime Monitoring Service

A modern, full-stack uptime monitoring platform built with Next.js. Effortlessly track the uptime and health of your websites and APIs, get instant alerts, view incident history, and more—all with a beautiful, intuitive dashboard.

<img width="1919" height="822" alt="example" src="https://github.com/user-attachments/assets/cbfd794f-7c4c-4842-a3c0-855fdfcb2939" />


---

## 🚀 Features

- **Real-Time Uptime Monitoring:** Track the status and response time of your websites and APIs 24/7.
- **Instant Notifications:** Receive email alerts when your site goes down or recovers.
- **Incident History:** View a full history of downtime, incidents, and recoveries for all your monitors.
- **Beautiful Dashboard:** Modern, responsive UI with detailed stats, incident logs, and per-monitor analytics.
- **Easy Setup:** Add new monitors in seconds with a simple, intuitive interface.
- **Secure Authentication:** User accounts and secure login/signup flows.
- **Responsive Design:** Works great on desktop and mobile.
- **Docker Support:** Easily run the service in a containerized environment.

---

## 🛠 Tech Stack

- **Frontend & Backend:** [Next.js 15](https://nextjs.org/) (App Router, SSR, API routes)
- **Database:** [Supabase](https://supabase.com/) (Postgres, Auth, Realtime)
- **Email:** [Nodemailer](https://nodemailer.com/) for notifications
- **UI:** [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **ORM/DB Client:** [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- **Other:** [Appwrite](https://appwrite.io/) (optional), [pg](https://node-postgres.com/), [node-fetch](https://www.npmjs.com/package/node-fetch)
- **Containerization:** Docker

---

## ⚡️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase, email, and database credentials.

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

4. **Build & Run in Production:**

   ```bash
   npm run build && npm start
   ```

5. **Docker:**

   ```bash
   docker build -t uptime-monitor .
   docker run -p 3000:3000 uptime-monitor
   ```

---

## 📊 Usage

- **Sign up** for an account and log in.
- **Add a monitor** (website or API) from the dashboard.
- **View real-time status, uptime stats, and incident history** for each monitor.
- **Get notified** instantly via email if your site goes down or recovers.
- **Review incidents** and uptime analytics over 24h, 7d, and 30d periods.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

