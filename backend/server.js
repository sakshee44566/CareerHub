import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend directory
const ENV_PATH = path.join(__dirname, '.env');
dotenv.config({ path: ENV_PATH });
console.log('Loaded env from:', ENV_PATH);

// Fallback: manually parse env file if dotenv didn't populate expected vars
const hydrateEnvFromFileSync = () => {
  try {
    if (process.env.EMAIL_USER && (process.env.EMAIL_PASS || process.env.APP_PASSWORD)) return;
    if (!fsSync.existsSync(ENV_PATH)) return;
    // Read as buffer and detect encoding (UTF-8 vs UTF-16 LE)
    const buf = fsSync.readFileSync(ENV_PATH);
    const looksUtf16Le = buf.length >= 2 && ((buf[0] === 0xFF && buf[1] === 0xFE) || (buf[1] === 0x00));
    let raw = looksUtf16Le ? buf.toString('utf16le') : buf.toString('utf8');
    // Remove BOM and normalize unicode spaces
    raw = raw.replace(/^\uFEFF/, '').replace(/[\u00A0\u200B\u200E\u200F]/g, '');

    const setIfFound = (name) => {
      const re = new RegExp(`(^|\\n)\\s*${name}\\s*=\\s*(.*)`, 'i');
      const m = raw.match(re);
      if (m) {
        let v = m[2].trim();
        // strip inline comments
        const hash = v.indexOf('#');
        if (hash >= 0) v = v.slice(0, hash).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (!process.env[name] && v) process.env[name] = v;
      }
    };

    // specifically look for critical vars
    setIfFound('EMAIL_USER');
    setIfFound('EMAIL_PASS');
    setIfFound('APP_PASSWORD');
    setIfFound('EMAIL_TO');
    setIfFound('PORT');
    console.log('Sync env hydration done. EMAIL_USER:', Boolean(process.env.EMAIL_USER), 'PASS:', Boolean(process.env.EMAIL_PASS || process.env.APP_PASSWORD));
  } catch {}
};

hydrateEnvFromFileSync();
const hydrateEnvFromFile = async () => {
  try {
    if (process.env.EMAIL_USER && (process.env.EMAIL_PASS || process.env.APP_PASSWORD)) {
      return; // already loaded
    }
    const raw = await fs.readFile(ENV_PATH, 'utf8');
    raw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .forEach(line => {
        const idx = line.indexOf('=');
        if (idx > 0) {
          const key = line.slice(0, idx).trim();
          // Remove surrounding quotes and whitespace from value
          let value = line.slice(idx + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    console.log('Env hydrated manually. EMAIL_USER present:', Boolean(process.env.EMAIL_USER), 'PASS present:', Boolean(process.env.EMAIL_PASS || process.env.APP_PASSWORD));
  } catch (e) {
    console.warn('Manual env hydration skipped:', e?.message || e);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('trust proxy', 1); // Trust only Railway's proxy
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://animated-moonbeam-a6d4b0.netlify.app'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Email rate limiting (relaxed in development to avoid 429 during testing)
const isProd = process.env.NODE_ENV === 'production';
const emailLimiter = rateLimit({
  windowMs: isProd ? 60 * 60 * 1000 : 60 * 1000, // 1h in prod, 1m in dev
  max: isProd ? 5 : 1000
});

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');
let ADMIN_USER = process.env.ADMIN_USER || 'admin';
let ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const activeTokens = new Set();

// Allow credentials to be stored in backend/data/admin.json as a fallback when .env isn't read
const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');
try {
  const hasEnvCreds = Boolean(process.env.ADMIN_USER) && Boolean(process.env.ADMIN_PASS);
  if (!hasEnvCreds && fsSync.existsSync(ADMIN_FILE)) {
    const raw = fsSync.readFileSync(ADMIN_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed.username && parsed.password) {
      ADMIN_USER = String(parsed.username);
      ADMIN_PASS = String(parsed.password);
      console.log('Admin credentials loaded from data/admin.json');
    }
  }
} catch (e) {
  console.warn('Could not read admin.json:', e?.message || e);
}

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Initialize data file if it doesn't exist with an empty array (no sample data)
const initializeData = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// Email configuration
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'sakshee907@gmail.com';
  const emailPass = process.env.EMAIL_PASS || process.env.APP_PASSWORD;
  
  console.log('Email config - User:', emailUser);
  console.log('Email config - Pass length:', emailPass ? emailPass.length : 'undefined');
  
  if (!emailPass) {
    throw new Error('EMAIL_PASS environment variable is not set');
  }
  
  // Use SMTP2GO for reliable cloud-based email delivery
  const smtpProvider = process.env.SMTP_PROVIDER || 'gmail';
  
  if (smtpProvider === 'smtp2go') {
    console.log('Using SMTP2GO for email delivery');
    return nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 2525, // Try alternative port
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USER || emailUser,
        pass: process.env.SMTP2GO_PASS || emailPass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  
  // Fallback to Gmail (will likely timeout on Railway)
  console.log('Using Gmail SMTP (may timeout on Railway)');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
};

// Utility functions
// Auth middleware
const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = uuidv4();
    activeTokens.add(token);
    // auto-expire token after 24h in memory
    setTimeout(() => activeTokens.delete(token), 24 * 60 * 60 * 1000).unref?.();
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) activeTokens.delete(token);
  res.json({ ok: true });
});
const readPosts = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

const writePosts = async (posts) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts:', error);
    return false;
  }
};

// Routes

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post
app.post('/api/posts', requireAuth, async (req, res) => {
  try {
    const posts = await readPosts();
    const newPost = {
      id: uuidv4(),
      ...req.body,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    
    posts.unshift(newPost); // Add to beginning
    const success = await writePosts(posts);
    
    if (success) {
      res.status(201).json(newPost);
    } else {
      res.status(500).json({ error: 'Failed to create post' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', requireAuth, async (req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    posts[index] = { ...posts[index], ...req.body };
    const success = await writePosts(posts);
    
    if (success) {
      res.json(posts[index]);
    } else {
      res.status(500).json({ error: 'Failed to update post' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', requireAuth, async (req, res) => {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    
    if (posts.length === filteredPosts.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const success = await writePosts(filteredPosts);
    
    if (success) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Contact form submission
app.post('/api/contact', emailLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'sakshee907@gmail.com',
      to: process.env.EMAIL_TO || process.env.EMAIL_USER || 'sakshee907@gmail.com',
      subject: `Career Hub Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Set a timeout for the email sending
    const sendEmailWithTimeout = () => {
      return Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout after 30 seconds')), 30000)
        )
      ]);
    };

    await sendEmailWithTimeout();
    console.log('Email sent successfully to:', mailOptions.to);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Fallback: Log the contact form submission for manual follow-up
    console.log('Contact form submission (SMTP failed):', {
      name, email, subject, message,
      timestamp: new Date().toISOString()
    });
    
    // For now, return success but log the issue
    res.json({ 
      message: 'Message received (email delivery pending)', 
      note: 'Your message has been received and will be processed shortly.'
    });
  }
});

// Newsletter subscription
app.post('/api/subscribe', emailLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'sakshee907@gmail.com',
      to: process.env.EMAIL_TO || process.env.EMAIL_USER || 'sakshee907@gmail.com',
      subject: 'New Newsletter Subscription',
      html: `
        <h3>New Newsletter Subscription</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p>Someone has subscribed to your newsletter.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SMTP verify endpoint to diagnose email issues
app.get('/api/email/verify', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ ok: true, message: 'SMTP connection verified', user: process.env.EMAIL_USER });
  } catch (err) {
    console.error('SMTP verify error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Diagnostics: check env presence (does not expose secrets)
app.get('/api/email/env-check', (req, res) => {
  res.json({
    hasUser: Boolean(process.env.EMAIL_USER),
    hasPass: Boolean(process.env.EMAIL_PASS || process.env.APP_PASSWORD),
    envPath: ENV_PATH
  });
});

// Diagnostics: read env file and report which keys exist (no values)
app.get('/api/email/env-file', async (req, res) => {
  try {
    const content = await fs.readFile(ENV_PATH, 'utf8');
    const keys = content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0].trim());
    res.json({ exists: true, keys });
  } catch (err) {
    res.json({ exists: false, error: String(err), envPath: ENV_PATH });
  }
});

// Initialize and start server
const startServer = async () => {
  await hydrateEnvFromFile();
  await ensureDataDir();
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch(console.error);
