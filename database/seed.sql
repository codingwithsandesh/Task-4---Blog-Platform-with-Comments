-- ===================================================================
-- BlogSphere Seed Data
-- For development and local testing in MySQL 8.0+
-- NOTE: Default password for all seed accounts is: Password123!
-- Hashed using bcrypt (10 rounds): $2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO
-- ===================================================================

USE `blogsphere_db`;

-- Insert initial editorial users
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `bio`, `role`, `created_at`) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@blogsphere.in', '$2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO', 'Principal Systems Architect based in Koramangala, Bengaluru. Writing about India Stack, high-throughput distributed systems, and deliberate craftsmanship.', 'admin', NOW() - INTERVAL 30 DAY),
(2, 'Ananya Deshmukh', 'ananya.deshmukh@blogsphere.in', '$2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO', 'Staff Infrastructure Engineer & Digital Public Infrastructure (DPI) researcher in Pune. Exploring consensus protocols and financial rail scalability.', 'user', NOW() - INTERVAL 25 DAY),
(3, 'Vikramaditya Sen', 'vikramaditya.sen@blogsphere.in', '$2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO', 'Indic script researcher and editorial designer from Kolkata & Shantiniketan. Designing digital typography for a multilingual nation.', 'user', NOW() - INTERVAL 20 DAY),
(4, 'Priya Nair', 'priya.nair@blogsphere.in', '$2b$10$f2onhMEkVzJejhpXI3JnP.PLApClVCZw.la8WvHjDbUwayB9pMheO', 'Architecture critic and essayist from Kochi & Bengaluru. Exploring climate-responsive workspaces and contemplative engineering.', 'user', NOW() - INTERVAL 15 DAY);

-- Insert initial editorial blog posts
INSERT INTO `posts` (`id`, `author_id`, `title`, `slug`, `excerpt`, `content`, `cover_image_url`, `category`, `tags`, `reading_time_minutes`, `status`, `published_at`, `created_at`) VALUES
(1, 1, 
 'The Architecture of India Stack: How UPI and Open Financial Rails Scaled to 15 Billion Transactions', 
 'architecture-of-india-stack-upi-scale', 
 'Inside the architectural breakthroughs of India’s Digital Public Infrastructure: asynchronous settlement buffers, federated identity, and zero-trust security that redefined digital commerce worldwide.',
 'In the history of digital infrastructure, few systems have matched the meteoric scale of India Stack. What began as a bold blueprint in Bengaluru has transformed into the world’s most voluminous real-time payment ecosystem, orchestrating over 15 billion transactions monthly with sub-second finality.\n\nWhile Silicon Valley models favored centralized, walled-garden platforms designed for ad monetization, India took a fundamentally different path: building open, interoperable protocols as Digital Public Infrastructure (DPI).\n\n### The Architectural Philosophy of Open Rails\n\nThe fundamental premise of the Unified Payments Interface (UPI) was decoupling identity from the underlying store of value. By abstracting the complex banking rails behind standardized virtual payment addresses (VPAs), the system unlocked atomic routing across hundreds of disparate legacy banking cores.\n\nKey architectural pillars include:\n\n1. **Federated Orchestration**: No single entity holds complete state. The National Payments Corporation of India (NPCI) acts as an ultra-high-speed routing switch, enforcing protocol consensus without storing customer credentials.\n2. **Resilient Asynchronous Buffering**: When localized bank CBS systems face transient spikes during festive seasons (like Diwali sales), backpressure queues and tokenized retries absorb the shock rather than cascading failures.\n3. **Zero-Trust Security**: Multi-factor cryptographic attestation ensures that device fingerprints, SIM hardware binding, and PIN verification occur without exposing account secrets to merchant endpoints.\n\n### The Global Ripple Effect\n\nFrom Singapore to France and the UAE, central banks across the world are now studying and adopting UPI protocols. India has demonstrated that public digital rails, built with rigorous computer science principles and deliberate craftsmanship, can deliver financial inclusion at planetary scale.',
 '/src/assets/images/india_bangalore_tech_1791102059470.jpg',
 'Engineering',
 'India Stack, UPI, Distributed Systems, Bengaluru Tech',
 7,
 'published',
 NOW() - INTERVAL 4 DAY,
 NOW() - INTERVAL 4 DAY
),
(2, 4, 
 'Brick, Jali, and Passive Cooling: Architectural Wisdom for Modern Indian Tech Sanctuaries', 
 'brick-jali-passive-cooling-indian-architecture', 
 'How pioneering Indian architects like Laurie Baker and Charles Correa solved thermal comfort through terracotta jalis and courtyards—and what modern engineering studios can learn from them.',
 'Step into an old courtyard home in Chettinad, or a Laurie Baker brick pavilion in Thiruvananthapuram on a scorching May afternoon, and you immediately feel the ambient temperature drop by four to six degrees Celsius—without a single kilowatt of compressor air conditioning running.\n\nLong before green certifications and carbon offsets became corporate buzzwords, Indian vernacular architecture had mastered the science of climate-responsive thermodynamics.\n\n### The Physics of the Jali Screen\n\nThe perforated jali screen—a signature element of Mughal, Gujarati, and Rajasthani architecture—is an exquisite acoustic and thermal filter. By forcing breezes through tapered apertures, the screen utilizes the Venturi effect: as air velocity increases through the constriction, pressure drops and thermal energy dissipates.\n\nWhen combined with exposed terracotta brick cavities that act as thermal dampeners, natural ventilation sweeps stale heat upward through central courtyards, creating continuous, quiet air displacement.\n\n### Reclaiming Calm for Deep Engineering Work\n\nMany modern software offices across Bengaluru, Hyderabad, and Gurugram have become hermetically sealed glass greenhouse towers requiring deafening HVAC machinery. By contrast, designing engineering studios with open verandas, natural brickwork, rain-harvested water courts, and native foliage creates serene acoustic sanctuaries where focus and craftsmanship flourish naturally.',
 '/src/assets/images/india_ahmedabad_studio_1791102080383.jpg',
 'Design',
 'Architecture, Sustainable Design, Laurie Baker, Ahmedabad',
 6,
 'published',
 NOW() - INTERVAL 3 DAY,
 NOW() - INTERVAL 3 DAY
),
(3, 3, 
 'The Resurgence of Indic Typography: Crafting Digital Interfaces for a Multilingual Bharat', 
 'resurgence-of-indic-typography-multilingual', 
 'With hundreds of millions of readers coming online in Hindi, Bengali, Tamil, Telugu, and Kannada, digital type design in India is experiencing an unprecedented golden age.',
 'For decades, digital interfaces in India were designed predominantly in Latin typefaces, with Indic scripts relegated to crude, unhinted fallback fonts that stripped them of their calligraphic soul and harmonic proportions.\n\nYet Indic scripts—from the flowing shirorekha (top headline) of Devanagari to the curvilinear grace of Telugu and Malayalam—possess structural and ligatural complexities that demand deep typographic respect.\n\n### The Math of Indic Glyphs and Matras\n\nUnlike Latin scripts that align neatly to a single baseline and x-height, Indic scripts operate along multi-tiered vertical zones: the headline, core character body, upper matras (vowel signs), and lower subscript conjuncts. Rendering a complex ligature like "क्ष्मा" or "श्री" requires OpenType feature tables with sophisticated contextual substitution (GSUB) and glyph positioning (GPOS).\n\nWhen web platforms fail to calibrate vertical line leading for Indic scripts, upper and lower diacritics clip into adjacent lines, inducing cognitive eye strain.\n\n### Designing for the Next 500 Million Readers\n\nAs India’s next half-billion citizens access knowledge, governance, and commerce on smartphones, type design becomes a civic duty. When typography honors the natural rhythm of our mother tongues, digital literacy ceases to be a barrier and becomes an invitation.',
 '/src/assets/images/india_letterpress_indic_1791102092824.jpg',
 'Culture',
 'Typography, Indic Scripts, Devanagari, Multilingual UI',
 5,
 'published',
 NOW() - INTERVAL 2 DAY,
 NOW() - INTERVAL 2 DAY
),
(4, 2, 
 'Filter Coffee, Verandas, and Slow Software: Deep Work Lessons from Mysore & Malnad', 
 'filter-coffee-verandas-slow-software-deep-work', 
 'Why escaping the frantic noise of hyper-growth sprints for the contemplative rhythm of Karnataka coffee estates cultivates clearer thinking and enduring engineering decisions.',
 'There is a deliberate ritual to brewing South Indian filter coffee in a brass dabarah: dark-roast peaberry grounds steeped slowly with boiling water in a gravity decoction vessel, poured in frothy arcs between tumbler and katora.\n\nIt cannot be rushed. If you force the water through prematurely, you ruin the extraction.\n\n### The Antidote to Sprint Mania\n\nIn our startup hubs across India, we frequently glorify the relentless 70-hour grind and shipping half-baked features every forty-eight hours. Yet the most resilient codebases in our industry were never conceived in frantic panic.\n\nTaking time to step back—whether on a quiet veranda in Mysuru overlooking chamundi hills, or under the canopy of Chikmagalur coffee plantations—allows the subconscious mind to synthesize complex distributed state machines.\n\nWhen we cultivate stillness, we stop accumulating technical debt and start building software that stands the test of decades.',
 '/src/assets/images/india_minimalist_desk_1791102112270.jpg',
 'Philosophy',
 'Deep Work, Slow Software, Mysore, Craft',
 4,
 'published',
 NOW() - INTERVAL 10 HOUR,
 NOW() - INTERVAL 10 HOUR
);

-- Insert initial comments
INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`) VALUES
(1, 1, 2, 'Remarkable breakdown, Aarav! The asynchronous buffering during Diwali flash sales is truly where UPI’s engineering outshines traditional credit card rails. Glad to see India’s DPI getting rigorous architectural credit.', NOW() - INTERVAL 3 DAY),
(2, 1, 3, 'The zero-trust attestation layer in UPI should be a case study in every computer science curriculum in our universities. Proud to see this published on BlogSphere!', NOW() - INTERVAL 2 DAY),
(3, 3, 1, 'Vikramaditya, the point on GPOS and matra clipping in multi-script interfaces is so critical. We need more Indian frontend engineers treating Indic font rendering as a first-class engineering constraint.', NOW() - INTERVAL 14 HOUR);
