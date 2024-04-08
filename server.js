import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
    res.status(500).send("Internal Server Error");
  }
});

app.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com/_manishmk");
});

app.get("/github", (req, res) => {
  res.redirect("https://github.com/mk-manishkumar");
});

app.get("/linkedin", (req, res) => {
  res.redirect("https://www.linkedin.com/in/mk-manishkumar/");
});

app.get("/blogs", (req, res) => {
  res.redirect("https://manishmk.hashnode.dev/");
});

app.get("/portfolio", (req, res) => {
  res.redirect("https://manishmk.netlify.app/");
});

app.use((err, req, res, next) => {
  res.status(404).render("error", { error: err.message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
