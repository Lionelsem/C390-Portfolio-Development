const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/resume", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pdf", "Lionel-Resume.docx"));
});

app.get("/certificates", (req, res) => {
  const certificates = [
    {
      title: "CSS (Basic)",
      issuer: "HackerRank",
      date: "2026-01-26",
      file: "css certificate.pdf",
      link: "https://www.hackerrank.com/certificates/iframe/97e3b5aea3cd",
    },
    {
      title: "JavaScript (Basic)",
      issuer: "HackerRank",
      date: "2026-01-26",
      file: "javascript_basic certificate.pdf",
      link: "https://www.hackerrank.com/certificates/iframe/fe1a0cbf25bf",
    },
    {
      title: "React (Basic)",
      issuer: "HackerRank",
      date: "2026-01-26",
      file: "react_basic certificate (1).pdf",
      link: "https://www.hackerrank.com/certificates/iframe/40ae7171e81f",
    },
    {
      title: "SQL (Basic)",
      issuer: "HackerRank",
      date: "2026-01-26",
      file: "sql_basic certificate.pdf",
      link: "https://www.hackerrank.com/certificates/iframe/db35a5ed4f19",
    },
  ];

  res.render("certificates", {
    title: "Certificates",
    certificates,
  });
});


// Static files (CSS/JS/Images) from /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Lionel — Portfolio" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
