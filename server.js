const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
let lastContact = null;

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_TO);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = decoded.split(':');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
}

app.use('/admin', authenticateAdmin);
app.use('/api/admin', authenticateAdmin);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      skills TEXT NOT NULL,
      projects TEXT NOT NULL,
      experience TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  const existing = await get('SELECT * FROM portfolio WHERE id = 1');

  if (!existing) {
    const defaultPortfolio = {
      name: 'Akula Sanjay Kumar',
      title: 'Software Engineer',
      summary: 'Aspiring Software Engineer passionate about building scalable products and modern web applications.',
      skills: ['Python', 'C', 'C++', 'SQL', 'HTML5', 'CSS3', 'JavaScript', 'GitHub'],
      projects: [
        {
          name: 'TechFest 2025',
          description: 'Responsive event management website with registration, login, payment, and dashboard features.',
          liveDemo: 'https://sanjaykumar-akula.github.io/techfest/'
        }
      ],
      experience: [
        'Python Developer Intern - YAICESS Solutions',
        'Cyber Security Intern - BIST Technologies',
        'Python Programming Intern - CodingMissions IT Solutions'
      ]
    };

    await run(
      'INSERT INTO portfolio (id, name, title, summary, skills, projects, experience) VALUES (1, ?, ?, ?, ?, ?, ?)',
      [
        defaultPortfolio.name,
        defaultPortfolio.title,
        defaultPortfolio.summary,
        JSON.stringify(defaultPortfolio.skills),
        JSON.stringify(defaultPortfolio.projects),
        JSON.stringify(defaultPortfolio.experience)
      ]
    );
  }
}

async function getPortfolioPayload() {
  const row = await get('SELECT * FROM portfolio WHERE id = 1');

  return {
    name: row.name,
    title: row.title,
    summary: row.summary,
    skills: JSON.parse(row.skills),
    projects: JSON.parse(row.projects),
    experience: JSON.parse(row.experience)
  };
}

async function sendContactEmail({ name, email, message }) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'not-configured' };
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.MAIL_TO,
      subject: `New contact message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    return { sent: true };
  } catch (error) {
    console.error(error);
    return { sent: false, reason: 'send-failed' };
  }
}

app.get('/api/portfolio', async (req, res) => {
  try {
    res.json(await getPortfolioPayload());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load portfolio data.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, email, and a message.'
    });
  }

  try {
    const createdAt = new Date().toISOString();

    await run(
      'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
      [name, email, message, createdAt]
    );

    const emailResult = await sendContactEmail({ name, email, message });
    lastContact = { name, email, message, createdAt, emailSent: emailResult.sent };

    res.json({
      success: true,
      stored: true,
      emailed: emailResult.sent,
      message: emailResult.sent
        ? 'Message received successfully and emailed to your inbox.'
        : emailResult.reason === 'not-configured'
          ? 'Message saved successfully. Email delivery is not configured yet.'
          : 'Message was saved, but email delivery failed. Please verify your Resend API key and MAIL_TO settings.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to save your message.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    lastContact,
    emailConfigured: isEmailConfigured()
  });
});

app.get('/api/admin/messages', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM messages ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load messages.' });
  }
});

app.post('/api/admin/portfolio', async (req, res) => {
  const { name, title, summary, skills, projects, experience } = req.body;

  try {
    const parsedSkills = Array.isArray(skills) ? skills : String(skills || '').split(',').map((item) => item.trim()).filter(Boolean);
    const parsedProjects = Array.isArray(projects) ? projects : [];
    const parsedExperience = Array.isArray(experience) ? experience : [];

    await run(
      'UPDATE portfolio SET name = ?, title = ?, summary = ?, skills = ?, projects = ?, experience = ? WHERE id = 1',
      [
        name || 'Akula Sanjay Kumar',
        title || 'Software Engineer',
        summary || 'Aspiring Software Engineer passionate about building scalable products and modern web applications.',
        JSON.stringify(parsedSkills),
        JSON.stringify(parsedProjects),
        JSON.stringify(parsedExperience)
      ]
    );

    res.json({ success: true, message: 'Portfolio updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to update portfolio.' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Portfolio server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please stop the other process or choose a different port.`);
      process.exit(1);
    } else {
      console.error('Server startup failed:', error);
      process.exit(1);
    }
  });
}

initializeDatabase()
  .then(() => {
    startServer(Number(PORT));
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
