const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

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
  {
    title: "ISTQB Foundation Cert Prep",
    issuer: "LinkedIn Learning",
    date: "2025-11-03",
    file: "CertificateOfCompletion_ISTQB Foundation Cert Prep.pdf",
    link: "",
  },
  {
    title: "Programming Foundations: Software Testing/QA",
    issuer: "LinkedIn Learning",
    date: "2025-11-17",
    file: "CertificateOfCompletion_Programming Foundations Software TestingQA.pdf",
    link: "",
  },
  {
    title: "Software Testing Foundations: Bug Writing and Management",
    issuer: "LinkedIn Learning",
    date: "2025-10-31",
    file: "CertificateOfCompletion_Software Testing Foundations Bug Writing and Management.pdf",
    link: "",
  },
  {
    title: "Software Testing Foundations: Test Planning",
    issuer: "LinkedIn Learning",
    date: "2025-11-03",
    file: "CertificateOfCompletion_Software Testing Foundations Test Planning.pdf",
    link: "",
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const projectsPath = path.join(__dirname, "public", "data", "projects.json");

function readProjects() {
  try {
    const raw = fs.readFileSync(projectsPath, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Projects JSON read error:", err);
    return [];
  }
}

app.get("/resume", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pdf", "Lionel-Resume.docx"));
});

app.get("/certificates", (req, res) => {
  res.render("certificates", {
    title: "Certificates",
    certificates,
  });
});


// Static files (CSS/JS/Images) from /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const latestCertificates = [...certificates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  res.render("index", {
    title: "Lionel — Portfolio",
    latestCertificates,
    certCount: certificates.length,
    projectCount: readProjects().length,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));


