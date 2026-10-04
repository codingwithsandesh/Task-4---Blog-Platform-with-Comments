import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { User, SafeUser, Post, Comment } from '../types';

let mysqlPool: mysql.Pool | null = null;
let isUsingMySQL = false;

// Safe user projection helper
export function toSafeUser(user: User): SafeUser {
  const { password_hash, ...safe } = user;
  return safe;
}

// -------------------------------------------------------------
// Disk-backed persistent JSON Store (Initialized with seeds)
// -------------------------------------------------------------
interface DbStore {
  users: User[];
  posts: Post[];
  comments: Comment[];
  nextIds: {
    users: number;
    posts: number;
    comments: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'blogsphere_db.json');

function getInitialStore(): DbStore {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

  // Password123! hashed with bcrypt (10 rounds)
  const defaultHash = '$2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO';

  return {
    users: [
      {
        id: 1,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@blogsphere.in',
        password_hash: defaultHash,
        bio: 'Principal Systems Architect based in Koramangala, Bengaluru. Writing about India Stack, high-throughput distributed systems, and deliberate craftsmanship.',
        role: 'admin',
        created_at: daysAgo(30),
        updated_at: daysAgo(30),
      },
      {
        id: 2,
        name: 'Ananya Deshmukh',
        email: 'ananya.deshmukh@blogsphere.in',
        password_hash: defaultHash,
        bio: 'Staff Infrastructure Engineer & Digital Public Infrastructure (DPI) researcher in Pune. Exploring consensus protocols and financial rail scalability.',
        role: 'user',
        created_at: daysAgo(25),
        updated_at: daysAgo(25),
      },
      {
        id: 3,
        name: 'Vikramaditya Sen',
        email: 'vikramaditya.sen@blogsphere.in',
        password_hash: defaultHash,
        bio: 'Indic script researcher and editorial designer from Kolkata & Shantiniketan. Designing digital typography for a multilingual nation.',
        role: 'user',
        created_at: daysAgo(20),
        updated_at: daysAgo(20),
      },
      {
        id: 4,
        name: 'Priya Nair',
        email: 'priya.nair@blogsphere.in',
        password_hash: defaultHash,
        bio: 'Architecture critic and essayist from Kochi & Bengaluru. Exploring climate-responsive workspaces and contemplative engineering.',
        role: 'user',
        created_at: daysAgo(15),
        updated_at: daysAgo(15),
      },
    ],
    posts: [
      {
        id: 1,
        author_id: 1,
        title: 'The Architecture of India Stack: How UPI and Open Financial Rails Scaled to 15 Billion Transactions',
        slug: 'architecture-of-india-stack-upi-scale',
        excerpt: 'Inside the architectural breakthroughs of India’s Digital Public Infrastructure: asynchronous settlement buffers, federated identity, and zero-trust security that redefined digital commerce worldwide.',
        content: `In the history of digital infrastructure, few systems have matched the meteoric scale of India Stack. What began as a bold blueprint in Bengaluru has transformed into the world’s most voluminous real-time payment ecosystem, orchestrating over 15 billion transactions monthly with sub-second finality.\n\nWhile Silicon Valley models favored centralized, walled-garden platforms designed for ad monetization, India took a fundamentally different path: building open, interoperable protocols as Digital Public Infrastructure (DPI).\n\n### The Architectural Philosophy of Open Rails\n\nThe fundamental premise of the Unified Payments Interface (UPI) was decoupling identity from the underlying store of value. By abstracting the complex banking rails behind standardized virtual payment addresses (VPAs), the system unlocked atomic routing across hundreds of disparate legacy banking cores.\n\nKey architectural pillars include:\n\n1. **Federated Orchestration**: No single entity holds complete state. The National Payments Corporation of India (NPCI) acts as an ultra-high-speed routing switch, enforcing protocol consensus without storing customer credentials.\n2. **Resilient Asynchronous Buffering**: When localized bank CBS systems face transient spikes during festive seasons (like Diwali sales), backpressure queues and tokenized retries absorb the shock rather than cascading failures.\n3. **Zero-Trust Security**: Multi-factor cryptographic attestation ensures that device fingerprints, SIM hardware binding, and PIN verification occur without exposing account secrets to merchant endpoints.\n\n### The Global Ripple Effect\n\nFrom Singapore to France and the UAE, central banks across the world are now studying and adopting UPI protocols. India has demonstrated that public digital rails, built with rigorous computer science principles and deliberate craftsmanship, can deliver financial inclusion at planetary scale.`,
        cover_image_url: '/src/assets/images/india_bangalore_tech_1791102059470.jpg',
        category: 'Engineering',
        tags: 'India Stack, UPI, Distributed Systems, Bengaluru Tech',
        reading_time_minutes: 7,
        status: 'published',
        published_at: daysAgo(4),
        created_at: daysAgo(4),
        updated_at: daysAgo(4),
      },
      {
        id: 2,
        author_id: 4,
        title: 'Brick, Jali, and Passive Cooling: Architectural Wisdom for Modern Indian Tech Sanctuaries',
        slug: 'brick-jali-passive-cooling-indian-architecture',
        excerpt: 'How pioneering Indian architects like Laurie Baker and Charles Correa solved thermal comfort through terracotta jalis and courtyards—and what modern engineering studios can learn from them.',
        content: `Step into an old courtyard home in Chettinad, or a Laurie Baker brick pavilion in Thiruvananthapuram on a scorching May afternoon, and you immediately feel the ambient temperature drop by four to six degrees Celsius—without a single kilowatt of compressor air conditioning running.\n\nLong before green certifications and carbon offsets became corporate buzzwords, Indian vernacular architecture had mastered the science of climate-responsive thermodynamics.\n\n### The Physics of the Jali Screen\n\nThe perforated jali screen—a signature element of Mughal, Gujarati, and Rajasthani architecture—is an exquisite acoustic and thermal filter. By forcing breezes through tapered apertures, the screen utilizes the Venturi effect: as air velocity increases through the constriction, pressure drops and thermal energy dissipates.\n\nWhen combined with exposed terracotta brick cavities that act as thermal dampeners, natural ventilation sweeps stale heat upward through central courtyards, creating continuous, quiet air displacement.\n\n### Reclaiming Calm for Deep Engineering Work\n\nMany modern software offices across Bengaluru, Hyderabad, and Gurugram have become hermetically sealed glass greenhouse towers requiring deafening HVAC machinery. By contrast, designing engineering studios with open verandas, natural brickwork, rain-harvested water courts, and native foliage creates serene acoustic sanctuaries where focus and craftsmanship flourish naturally.`,
        cover_image_url: '/src/assets/images/india_ahmedabad_studio_1791102080383.jpg',
        category: 'Design',
        tags: 'Architecture, Sustainable Design, Laurie Baker, Ahmedabad',
        reading_time_minutes: 6,
        status: 'published',
        published_at: daysAgo(3),
        created_at: daysAgo(3),
        updated_at: daysAgo(3),
      },
      {
        id: 3,
        author_id: 3,
        title: 'The Resurgence of Indic Typography: Crafting Digital Interfaces for a Multilingual Bharat',
        slug: 'resurgence-of-indic-typography-multilingual',
        excerpt: 'With hundreds of millions of readers coming online in Hindi, Bengali, Tamil, Telugu, and Kannada, digital type design in India is experiencing an unprecedented golden age.',
        content: `For decades, digital interfaces in India were designed predominantly in Latin typefaces, with Indic scripts relegated to crude, unhinted fallback fonts that stripped them of their calligraphic soul and harmonic proportions.\n\nYet Indic scripts—from the flowing shirorekha (top headline) of Devanagari to the curvilinear grace of Telugu and Malayalam—possess structural and ligatural complexities that demand deep typographic respect.\n\n### The Math of Indic Glyphs and Matras\n\nUnlike Latin scripts that align neatly to a single baseline and x-height, Indic scripts operate along multi-tiered vertical zones: the headline, core character body, upper matras (vowel signs), and lower subscript conjuncts. Rendering a complex ligature like "क्ष्मा" or "श्री" requires OpenType feature tables with sophisticated contextual substitution (GSUB) and glyph positioning (GPOS).\n\nWhen web platforms fail to calibrate vertical line leading for Indic scripts, upper and lower diacritics clip into adjacent lines, inducing cognitive eye strain.\n\n### Designing for the Next 500 Million Readers\n\nAs India’s next half-billion citizens access knowledge, governance, and commerce on smartphones, type design becomes a civic duty. When typography honors the natural rhythm of our mother tongues, digital literacy ceases to be a barrier and becomes an invitation.`,
        cover_image_url: '/src/assets/images/india_letterpress_indic_1791102092824.jpg',
        category: 'Culture',
        tags: 'Typography, Indic Scripts, Devanagari, Multilingual UI',
        reading_time_minutes: 5,
        status: 'published',
        published_at: daysAgo(2),
        created_at: daysAgo(2),
        updated_at: daysAgo(2),
      },
      {
        id: 4,
        author_id: 2,
        title: 'Filter Coffee, Verandas, and Slow Software: Deep Work Lessons from Mysore & Malnad',
        slug: 'filter-coffee-verandas-slow-software-deep-work',
        excerpt: 'Why escaping the frantic noise of hyper-growth sprints for the contemplative rhythm of Karnataka coffee estates cultivates clearer thinking and enduring engineering decisions.',
        content: `There is a deliberate ritual to brewing South Indian filter coffee in a brass dabarah: dark-roast peaberry grounds steeped slowly with boiling water in a gravity decoction vessel, poured in frothy arcs between tumbler and katora.\n\nIt cannot be rushed. If you force the water through prematurely, you ruin the extraction.\n\n### The Antidote to Sprint Mania\n\nIn our startup hubs across India, we frequently glorify the relentless 70-hour grind and shipping half-baked features every forty-eight hours. Yet the most resilient codebases in our industry were never conceived in frantic panic.\n\nTaking time to step back—whether on a quiet veranda in Mysuru overlooking chamundi hills, or under the canopy of Chikmagalur coffee plantations—allows the subconscious mind to synthesize complex distributed state machines.\n\nWhen we cultivate stillness, we stop accumulating technical debt and start building software that stands the test of decades.`,
        cover_image_url: '/src/assets/images/india_minimalist_desk_1791102112270.jpg',
        category: 'Philosophy',
        tags: 'Deep Work, Slow Software, Mysore, Craft',
        reading_time_minutes: 4,
        status: 'published',
        published_at: hoursAgo(10),
        created_at: hoursAgo(10),
        updated_at: hoursAgo(10),
      },
    ],
    comments: [
      {
        id: 1,
        post_id: 1,
        user_id: 2,
        author_name: 'Ananya Deshmukh',
        author_role: 'user',
        content: 'Remarkable breakdown, Aarav! The asynchronous buffering during Diwali flash sales is truly where UPI’s engineering outshines traditional credit card rails. Glad to see India’s DPI getting rigorous architectural credit.',
        created_at: daysAgo(3),
        updated_at: daysAgo(3),
      },
      {
        id: 2,
        post_id: 1,
        user_id: 3,
        author_name: 'Vikramaditya Sen',
        author_role: 'user',
        content: 'The zero-trust attestation layer in UPI should be a case study in every computer science curriculum in our universities. Proud to see this published on BlogSphere!',
        created_at: daysAgo(2),
        updated_at: daysAgo(2),
      },
      {
        id: 3,
        post_id: 3,
        user_id: 1,
        author_name: 'Aarav Sharma',
        author_role: 'admin',
        content: 'Vikramaditya, the point on GPOS and matra clipping in multi-script interfaces is so critical. We need more Indian frontend engineers treating Indic font rendering as a first-class engineering constraint.',
        created_at: hoursAgo(14),
        updated_at: hoursAgo(14),
      },
    ],
    nextIds: {
      users: 5,
      posts: 5,
      comments: 4,
    },
  };
}

function readStore(): DbStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading disk store, re-initializing...', err);
    const initial = getInitialStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeStore(store: DbStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

// -------------------------------------------------------------
// Database Initialization: Try MySQL first, fallback to JSON
// -------------------------------------------------------------
export async function initializeDatabase(): Promise<{ engine: 'mysql' | 'persistent-disk'; status: string }> {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME || 'blogsphere_db';
  const port = Number(process.env.DB_PORT) || 3306;

  if (host && user) {
    try {
      const pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test connection
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();

      mysqlPool = pool;
      isUsingMySQL = true;
      console.log(`[BlogSphere DB] Connected to MySQL database "${database}" on ${host}:${port}`);
      return { engine: 'mysql', status: `Connected to MySQL 8.0 on ${host}` };
    } catch (err: any) {
      console.warn(`[BlogSphere DB] MySQL connection could not be established (${err.message}). Using persistent disk store.`);
    }
  }

  // Fallback to disk store
  readStore();
  console.log('[BlogSphere DB] Initialized persistent disk store (.data/blogsphere_db.json). Fully functional.');
  return { engine: 'persistent-disk', status: 'Persistent disk relational store active.' };
}

export function getDatabaseStatus() {
  return {
    isUsingMySQL,
    engine: isUsingMySQL ? 'mysql' : 'persistent-disk',
    databaseName: isUsingMySQL ? (process.env.DB_NAME || 'blogsphere_db') : 'blogsphere_db.json',
  };
}

// -------------------------------------------------------------
// Repository Implementation
// -------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1',
      [normalizedEmail]
    );
    return (rows[0] as User) || null;
  }

  const store = readStore();
  const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  return user || null;
}

export async function findUserById(id: number): Promise<User | null> {
  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return (rows[0] as User) || null;
  }

  const store = readStore();
  const user = store.users.find((u) => u.id === id);
  return user || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password_hash: string;
  bio?: string | null;
  role?: 'user' | 'admin';
}): Promise<User> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const role = data.role || 'user';
  const bio = data.bio || null;

  if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
      'INSERT INTO users (name, email, password_hash, bio, role) VALUES (?, ?, ?, ?, ?)',
      [data.name.trim(), normalizedEmail, data.password_hash, bio, role]
    );
    const created = await findUserById(result.insertId);
    if (!created) throw new Error('User creation failed');
    return created;
  }

  const store = readStore();
  const now = new Date().toISOString();
  const newUser: User = {
    id: store.nextIds.users++,
    name: data.name.trim(),
    email: normalizedEmail,
    password_hash: data.password_hash,
    bio,
    role,
    created_at: now,
    updated_at: now,
  };
  store.users.push(newUser);
  writeStore(store);
  return newUser;
}

export async function updateUser(id: number, data: { name?: string; bio?: string | null }): Promise<User | null> {
  if (isUsingMySQL && mysqlPool) {
    const updates: string[] = [];
    const params: any[] = [];
    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name.trim());
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      params.push(data.bio ? data.bio.trim() : null);
    }
    if (updates.length === 0) return findUserById(id);

    params.push(id);
    await mysqlPool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    return findUserById(id);
  }

  const store = readStore();
  const userIndex = store.users.findIndex((u) => u.id === id);
  if (userIndex === -1) return null;

  if (data.name !== undefined) {
    store.users[userIndex].name = data.name.trim();
  }
  if (data.bio !== undefined) {
    store.users[userIndex].bio = data.bio ? data.bio.trim() : null;
  }
  store.users[userIndex].updated_at = new Date().toISOString();
  writeStore(store);
  return store.users[userIndex];
}

// -------------------------------------------------------------
// Posts Operations
// -------------------------------------------------------------

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: 'newest' | 'oldest';
  status?: 'published' | 'draft' | 'all';
  authorId?: number;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<{
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(50, options.limit || 10));
  const offset = (page - 1) * limit;
  const status = options.status || 'published';
  const sort = options.sort || 'newest';

  if (isUsingMySQL && mysqlPool) {
    let whereClauses: string[] = [];
    let params: any[] = [];

    if (status !== 'all') {
      whereClauses.push('p.status = ?');
      params.push(status);
    }
    if (options.authorId) {
      whereClauses.push('p.author_id = ?');
      params.push(options.authorId);
    }
    if (options.category && options.category !== 'All') {
      whereClauses.push('p.category = ?');
      params.push(options.category);
    }
    if (options.search && options.search.trim()) {
      whereClauses.push('(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)');
      const term = `%${options.search.trim()}%`;
      params.push(term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderBySql = sort === 'oldest' ? 'ORDER BY p.created_at ASC' : 'ORDER BY p.created_at DESC';

    // Count
    const [countRows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM posts p ${whereSql}`,
      params
    );
    const total = Number(countRows[0].total) || 0;

    // Fetch page
    const querySql = `
      SELECT p.*, u.name as author_name, u.bio as author_bio, u.email as author_email,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ${whereSql}
      ${orderBySql}
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(querySql, params);
    const posts = rows as Post[];

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // Disk store implementation
  const store = readStore();
  let list = [...store.posts];

  if (status !== 'all') {
    list = list.filter((p) => p.status === status);
  }
  if (options.authorId) {
    list = list.filter((p) => p.author_id === options.authorId);
  }
  if (options.category && options.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }
  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tags && p.tags.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = list.length;
  const paged = list.slice(offset, offset + limit).map((p) => {
    const author = store.users.find((u) => u.id === p.author_id);
    const commentsCount = store.comments.filter((c) => c.post_id === p.id).length;
    return {
      ...p,
      author_name: author ? author.name : 'Unknown Author',
      author_bio: author ? author.bio : null,
      author_email: author ? author.email : '',
      comments_count: commentsCount,
    };
  });

  return {
    posts: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getPostBySlug(slug: string, currentUserId?: number): Promise<Post | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT p.*, u.name as author_name, u.bio as author_bio, u.email as author_email,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE LOWER(p.slug) = ?
       LIMIT 1`,
      [normalizedSlug]
    );
    const post = (rows[0] as Post) || null;
    if (!post) return null;
    if (post.status === 'draft' && post.author_id !== currentUserId) {
      return null;
    }
    return post;
  }

  const store = readStore();
  const post = store.posts.find((p) => p.slug.toLowerCase() === normalizedSlug);
  if (!post) return null;

  if (post.status === 'draft' && post.author_id !== currentUserId) {
    return null;
  }

  const author = store.users.find((u) => u.id === post.author_id);
  const commentsCount = store.comments.filter((c) => c.post_id === post.id).length;

  return {
    ...post,
    author_name: author ? author.name : 'Unknown Author',
    author_bio: author ? author.bio : null,
    author_email: author ? author.email : '',
    comments_count: commentsCount,
  };
}

export async function getPostById(id: number): Promise<Post | null> {
  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT p.*, u.name as author_name, u.bio as author_bio, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = ?
       LIMIT 1`,
      [id]
    );
    return (rows[0] as Post) || null;
  }

  const store = readStore();
  const post = store.posts.find((p) => p.id === id);
  if (!post) return null;

  const author = store.users.find((u) => u.id === post.author_id);
  return {
    ...post,
    author_name: author ? author.name : 'Unknown Author',
    author_bio: author ? author.bio : null,
    author_email: author ? author.email : '',
  };
}

export async function generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) {
    baseSlug = 'untitled-article';
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let exists = false;
    if (isUsingMySQL && mysqlPool) {
      let query = 'SELECT id FROM posts WHERE slug = ?';
      const params: any[] = [slug];
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(query, params);
      exists = rows.length > 0;
    } else {
      const store = readStore();
      exists = store.posts.some((p) => p.slug === slug && (!excludeId || p.id !== excludeId));
    }

    if (!exists) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createPost(data: {
  author_id: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  category: string;
  tags?: string | null;
  status: 'draft' | 'published';
}): Promise<Post> {
  const readingTime = Math.max(1, Math.ceil(data.content.split(/\s+/).length / 200));
  const slug = data.slug ? await generateUniqueSlug(data.slug) : await generateUniqueSlug(data.title);
  const now = new Date().toISOString();
  const publishedAt = data.status === 'published' ? now : null;

  if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
      `INSERT INTO posts (author_id, title, slug, excerpt, content, cover_image_url, category, tags, reading_time_minutes, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.author_id,
        data.title.trim(),
        slug,
        data.excerpt.trim(),
        data.content.trim(),
        data.cover_image_url || null,
        data.category.trim(),
        data.tags || null,
        readingTime,
        data.status,
        publishedAt,
      ]
    );

    const created = await getPostById(result.insertId);
    if (!created) throw new Error('Failed to create post');
    return created;
  }

  const store = readStore();
  const newPost: Post = {
    id: store.nextIds.posts++,
    author_id: data.author_id,
    title: data.title.trim(),
    slug,
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    cover_image_url: data.cover_image_url || null,
    category: data.category.trim(),
    tags: data.tags || null,
    reading_time_minutes: readingTime,
    status: data.status,
    published_at: publishedAt,
    created_at: now,
    updated_at: now,
  };

  store.posts.push(newPost);
  writeStore(store);

  const author = store.users.find((u) => u.id === data.author_id);
  return {
    ...newPost,
    author_name: author ? author.name : 'Unknown Author',
    author_bio: author ? author.bio : null,
    author_email: author ? author.email : '',
  };
}

export async function updatePost(
  id: number,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    cover_image_url?: string | null;
    category?: string;
    tags?: string | null;
    status?: 'draft' | 'published';
  }
): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  let newSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    newSlug = await generateUniqueSlug(data.slug, id);
  } else if (data.title && data.title !== existing.title && !data.slug) {
    // keep slug or update if desired
  }

  const readingTime = data.content
    ? Math.max(1, Math.ceil(data.content.split(/\s+/).length / 200))
    : existing.reading_time_minutes;

  const now = new Date().toISOString();
  let publishedAt = existing.published_at;
  if (data.status === 'published' && !existing.published_at) {
    publishedAt = now;
  }

  if (isUsingMySQL && mysqlPool) {
    await mysqlPool.execute(
      `UPDATE posts 
       SET title = COALESCE(?, title),
           slug = COALESCE(?, slug),
           excerpt = COALESCE(?, excerpt),
           content = COALESCE(?, content),
           cover_image_url = ?,
           category = COALESCE(?, category),
           tags = ?,
           reading_time_minutes = ?,
           status = COALESCE(?, status),
           published_at = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        data.title ? data.title.trim() : null,
        newSlug,
        data.excerpt ? data.excerpt.trim() : null,
        data.content ? data.content.trim() : null,
        data.cover_image_url !== undefined ? data.cover_image_url : existing.cover_image_url,
        data.category ? data.category.trim() : null,
        data.tags !== undefined ? data.tags : existing.tags,
        readingTime,
        data.status || null,
        publishedAt,
        id,
      ]
    );

    return getPostById(id);
  }

  const store = readStore();
  const index = store.posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.posts[index] = {
    ...store.posts[index],
    title: data.title ? data.title.trim() : store.posts[index].title,
    slug: newSlug,
    excerpt: data.excerpt ? data.excerpt.trim() : store.posts[index].excerpt,
    content: data.content ? data.content.trim() : store.posts[index].content,
    cover_image_url: data.cover_image_url !== undefined ? data.cover_image_url : store.posts[index].cover_image_url,
    category: data.category ? data.category.trim() : store.posts[index].category,
    tags: data.tags !== undefined ? data.tags : store.posts[index].tags,
    reading_time_minutes: readingTime,
    status: data.status || store.posts[index].status,
    published_at: publishedAt,
    updated_at: now,
  };

  writeStore(store);
  return getPostById(id);
}

export async function deletePost(id: number): Promise<boolean> {
  if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute<mysql.ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  const store = readStore();
  const initialLength = store.posts.length;
  store.posts = store.posts.filter((p) => p.id !== id);
  // Also delete associated comments
  store.comments = store.comments.filter((c) => c.post_id !== id);
  writeStore(store);
  return store.posts.length < initialLength;
}

// -------------------------------------------------------------
// Comments Operations
// -------------------------------------------------------------

export async function getComments(postId: number): Promise<Comment[]> {
  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
              u.name as author_name, u.role as author_role
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );
    return rows as Comment[];
  }

  const store = readStore();
  return store.comments
    .filter((c) => c.post_id === postId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function getCommentById(id: number): Promise<Comment | null> {
  if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT c.*, u.name as author_name, u.role as author_role
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?
       LIMIT 1`,
      [id]
    );
    return (rows[0] as Comment) || null;
  }

  const store = readStore();
  const comment = store.comments.find((c) => c.id === id);
  return comment || null;
}

export async function createComment(data: {
  postId: number;
  userId: number;
  content: string;
}): Promise<Comment> {
  const user = await findUserById(data.userId);
  if (!user) throw new Error('User not found');

  if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
      'INSERT INTO comments (post_id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [data.postId, data.userId, data.content.trim()]
    );
    const created = await getCommentById(result.insertId);
    if (!created) throw new Error('Failed to create comment');
    return created;
  }

  const store = readStore();
  const now = new Date().toISOString();
  const newComment: Comment = {
    id: store.nextIds.comments++,
    post_id: data.postId,
    user_id: data.userId,
    author_name: user.name,
    author_role: user.role,
    content: data.content.trim(),
    created_at: now,
    updated_at: now,
  };

  store.comments.push(newComment);
  writeStore(store);
  return newComment;
}

export async function deleteComment(id: number): Promise<boolean> {
  if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute<mysql.ResultSetHeader>('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  const store = readStore();
  const initialLength = store.comments.length;
  store.comments = store.comments.filter((c) => c.id !== id);
  writeStore(store);
  return store.comments.length < initialLength;
}

// -------------------------------------------------------------
// Dashboard Statistics
// -------------------------------------------------------------

export async function getDashboardStats(userId: number) {
  if (isUsingMySQL && mysqlPool) {
    const [postCounts] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total_posts,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_posts,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_posts
       FROM posts
       WHERE author_id = ?`,
      [userId]
    );

    const [commentCount] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT COUNT(*) as comments_received
       FROM comments c
       JOIN posts p ON c.post_id = p.id
       WHERE p.author_id = ?`,
      [userId]
    );

    const [recentPosts] = await mysqlPool.execute<mysql.RowDataPacket[]>(
      `SELECT id, title, slug, status, created_at, updated_at
       FROM posts
       WHERE author_id = ?
       ORDER BY updated_at DESC
       LIMIT 5`,
      [userId]
    );

    return {
      totalPosts: Number(postCounts[0].total_posts) || 0,
      publishedPosts: Number(postCounts[0].published_posts) || 0,
      draftPosts: Number(postCounts[0].draft_posts) || 0,
      commentsReceived: Number(commentCount[0].comments_received) || 0,
      recentPosts: recentPosts as any[],
    };
  }

  const store = readStore();
  const userPosts = store.posts.filter((p) => p.author_id === userId);
  const totalPosts = userPosts.length;
  const publishedPosts = userPosts.filter((p) => p.status === 'published').length;
  const draftPosts = userPosts.filter((p) => p.status === 'draft').length;

  const userPostIds = new Set(userPosts.map((p) => p.id));
  const commentsReceived = store.comments.filter((c) => userPostIds.has(c.post_id)).length;

  const recentPosts = [...userPosts]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    commentsReceived,
    recentPosts,
  };
}
