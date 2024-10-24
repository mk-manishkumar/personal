import "dotenv/config";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

async function fetchUserProfile() {
  const username = process.env.GITHUB_USERNAME;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    const avatarUrl = data.avatar_url;
    return avatarUrl;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

app.get("/", async (req, res) => {
  try {
    const avatarUrl = await fetchUserProfile();
    res.render("index", { avatarUrl });
  } catch (error) {
    console.error("Error rendering index:", error);
    res.status(500).render("error");
  }
});

// SOCIAL LINKS
const socialRoutes = [
  { path: "/twitter", url: "https://twitter.com/_manishmk" },
  { path: "/github", url: "https://github.com/mk-manishkumar" },
  { path: "/linkedin", url: "https://www.linkedin.com/in/mk-manishkumar/" },
  { path: "/blogs", url: "https://manishmk.hashnode.dev/" },
  { path: "/portfolio", url: "https://manishmk.netlify.app/" },
];

socialRoutes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.redirect(route.url);
  });
});

// BACKEND DEPLOYED PROJECTS
const projectRoutes = [
  { path: "/coinkeeper", url: "https://coinkeeper-ngmb.onrender.com/" },
  { path: "/notenexus", url: "https://notenexus-nmow.onrender.com/" },
];

projectRoutes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.redirect(route.url);
  });
});

// 404 Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  res.status(404).render("error", { error: err.message });
  next(error);
});

// global error handler
app.use((err, req, res, next) => {
  res.status(500).render("error", { error: err.message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
