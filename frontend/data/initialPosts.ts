
import { BlogPost, CategoryType } from '../types';

// Generators for Indian Tech Context to make the data feel real
const CITIES = ['Bangalore', 'Hyderabad', 'Pune', 'Gurugram', 'Noida', 'Mumbai', 'Delhi', 'Chennai'];
const COMPANIES = ['Jio', 'Airtel', 'Tata', 'Infosys', 'Wipro', 'Zomato', 'Swiggy', 'Paytm', 'Ola', 'Flipkart'];
const PHONES = ['Samsung Galaxy S25', 'iPhone 17', 'Realme GT 6', 'Redmi Note 14', 'OnePlus 13', 'Pixel 9', 'Nothing Phone (3)', 'Vivo X100', 'iQOO 12'];
const AI_MODELS = ['Gemini 2.5', 'GPT-5', 'Claude 3.5', 'Llama 3', 'Grok 2', 'Sora', 'Devin'];
const APPS = ['WhatsApp', 'Instagram', 'Truecaller', 'Telegram', 'Cred', 'PhonePe', 'Blinkit', 'Zepto', 'Hotstar'];

// Templates to vary titles based on category
const TEMPLATES: Record<CategoryType, string[]> = {
  'Tech News': [
    "{Company} announces massive new campus in {City}",
    "Government introduces strict new policy for {Topic} in India",
    "Why {Company} stock is skyrocketing today",
    "{City} tech startups raise record funding in Q4 2025",
    "Jio vs Airtel: The fierce battle for {Topic} supremacy",
    "India's semiconductor mission: New plant opening in {City}",
    "Tech layoffs 2025: Impact on {City} software engineers",
    "5G speed test results: {City} tops the charts again",
    "Digital India: {Company} partners with government for AI",
    "The future of {Topic} in Tier-2 Indian cities"
  ],
  'AI News': [
    "{AI_Model} launched: What it means for Indian developers",
    "India's plan to regulate {Topic} explained simply",
    "Sam Altman visits {City} to meet young developers",
    "Google expands AI research center in {City}",
    "Deepfake concerns rise during election season",
    "How {Company} is using {AI_Model} to boost productivity by 300%",
    "{AI_Model} vs {AI_Model}: Which understands Hinglish better?",
    "AI job market in {City}: Salary trends for 2025",
    "OpenAI announces localized pricing for Indian market",
    "The ethical debate around {Topic} in Indian education"
  ],
  'AI Tools': [
    "Top 10 {Topic} tools for Indian students in 2025",
    "Best free alternative to {AI_Model} for coding",
    "How to use {Topic} to automate your daily workflow",
    "Review: Is this new AI tool worth ₹2000/month?",
    "5 AI tools every Indian freelancer needs today",
    "Generate viral Reels using this free AI tool",
    "Best AI for academic writing: {AI_Model} tested",
    "Create professional logos in seconds with this Indian AI",
    "Voice cloning AI: Fun tool or dangerous tech?",
    "Automate your GST filing with these AI assistants"
  ],
  'Smartphones & Gadgets': [
    "{Phone} Full Review: The new budget king under ₹20k?",
    "{Phone} vs {Phone}: The Ultimate Camera Blind Test",
    "Top 5 5G phones under ₹20,000 this October",
    "Leaked: {Phone} specs and India launch date revealed",
    "Best accessories for your new {Phone}",
    "Why you should wait for the {Phone} launch before buying",
    "Battery drain test: {Phone} vs Competition",
    "Gaming test on {Phone}: BGMI at 90FPS stable?",
    "The best camera phone under ₹30,000 for vloggers",
    "Foldables in 2025: {Phone} sets a new standard"
  ],
  'Apps': [
    "{App} new update: 5 hidden features you missed",
    "How to use {App} like a pro: Advanced tips",
    "{App} vs {App}: Which is safer for UPI payments?",
    "Why everyone in {City} is downloading {App} right now",
    "Best productivity apps for Indian students (Free)",
    "Top 5 privacy-focused alternatives to {App} in 2025",
    "Is {App} draining your battery? Here is the fix",
    "{App} launches premium tier at ₹99/month: Worth it?",
    "Recover deleted chats on {App}: Step by step guide",
    "Best photo editing apps for Android to pop on Instagram"
  ],
  'Software': [
    "Windows 12 rumors: What Indian users can expect",
    "Ubuntu vs Windows: Best OS for coding in 2025?",
    "Top CRM software for small Indian businesses",
    "Adobe Creative Cloud vs Free Alternatives for creators",
    "Best Antivirus for Indian users: Free vs Paid 2025",
    "How to optimize Windows 11 for maximum gaming performance",
    "Microsoft Office 2025 features leaked: AI everywhere",
    "Best VPNs for privacy in India (Speed Tested)",
    "Android 16 developer preview: First look at features",
    "Open source software that saves you money this year"
  ],
  'Tutorials': [
    "How to apply for a Passport online (Updated 2025 Guide)",
    "Step-by-step: Link Aadhaar with {App} securely",
    "How to speed up your old Android phone in 5 minutes",
    "Build a portfolio website in 30 minutes using AI",
    "How to invest in US stocks from India (Zero Brokerage)",
    "Mastering Excel: VLOOKUP guide for beginners",
    "How to stream 4K content on slow internet connections",
    "Fix 'Storage Full' error on WhatsApp permanently",
    "How to check your CIBIL score for free on WhatsApp",
    "Secure your WiFi network from neighbors stealing data"
  ],
  'Reviews': [
    "Sony vs Bose: Best noise cancelling headphones in India",
    "Review: The best mechanical keyboard under ₹5000",
    "Smartwatch shootout: Boat vs Noise vs Fire-Boltt",
    "Best budget laptop for coding students under ₹40k",
    "Review: Is the new iPad worth the high India price?",
    "Gaming monitor review: 144Hz under ₹15,000",
    "True Wireless Earbuds under ₹2000: Top picks 2025",
    "Kindle Paperwhite 2025 review: Still the best reader?",
    "Review: The best ergonomic chair for WFH setup",
    "GoPro Hero 13: Best action camera for motovloggers?"
  ],
  'Deals': [
    "Amazon Great Indian Festival: Top 10 loot deals today",
    "Flipkart Big Billion Days: Best iPhone prices revealed",
    "How to get Spotify Premium for free (Legally)",
    "Best credit cards for airport lounge access in 2025",
    "Student discounts: Save big on laptops and software",
    "Flash Sale Alert: {Phone} available at ₹9,999",
    "Top 5 tech deals of the week you shouldn't miss",
    "Don't miss this deal on {Company} products",
    "Save ₹5000 on this gaming laptop today only",
    "Best cashback apps for online shopping in India"
  ],
  'Cybersecurity': [
    "New UPI scam alert: Protect your hard earned money",
    "How to check if your email password was leaked",
    "Is public WiFi in {City} metro stations safe?",
    "WhatsApp OTP scam: What you need to know immediately",
    "Best 2FA apps to secure your social media accounts",
    "Ransomware attacks on Indian companies rise by 200%",
    "How to browse the web anonymously in India",
    "Protect your parents from online phishing scams",
    "Cybersecurity career roadmap in India: Salary & Skills",
    "Is your laptop webcam spying on you? How to check"
  ],
  'Gaming': [
    "GTA VI India launch date rumors and price",
    "BGMI new update: Tips to reach Conqueror tier fast",
    "PS5 Pro vs Xbox: Which console should you buy?",
    "Best gaming phones under ₹25,000 for reliable FPS",
    "Top 5 Indian eSports teams to watch in 2025",
    "Cloud gaming in India: JioGames vs The World",
    "Review: The best controller for mobile gaming",
    "Steam Sale: Best games under ₹500 right now",
    "Valorant India server: Ping test from {City}",
    "Minecraft tips and tricks for the new update"
  ],
  'Startups & Business Tech': [
    "How to register a startup in India (Online Process)",
    "Shark Tank India Season 4: Best tech pitches",
    "{Company} acquires Bangalore-based AI startup",
    "Zerodha's tech stack: A deep dive for engineers",
    "Best payment gateways for Indian e-commerce websites",
    "How to hire remote developers in India efficiently",
    "The rise of SaaS companies in Chennai and Pune",
    "Bootstrap vs VC Funding: What's better for Indian founders?",
    "Top 5 coworking spaces in {City} for techies",
    "Digital marketing trends for 2025 in India"
  ],
  'Web & Development': [
    "React 19: Features every Indian dev must know",
    "Next.js vs Remix: Choosing your framework in 2025",
    "Python roadmap for Indian students: Zero to Hero",
    "Tailwind CSS tricks for faster design workflows",
    "Best hosting providers for Indian websites (Speed Test)",
    "Web3 development: Is it still relevant in India?",
    "How to contribute to open source (Beginners Guide)",
    "JavaScript ES2025 features explained simply",
    "Full stack developer salary in {City} vs Remote",
    "Building accessible websites for rural India"
  ]
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateTitle = (category: CategoryType, index: number): string => {
  const templates = TEMPLATES[category];
  const template = templates[index % templates.length];
  
  return template
    .replace('{City}', getRandom(CITIES))
    .replace('{Company}', getRandom(COMPANIES))
    .replace('{Phone}', getRandom(PHONES))
    .replace('{AI_Model}', getRandom(AI_MODELS))
    .replace('{App}', getRandom(APPS))
    .replace('{Topic}', category.split(' ')[0]); 
};

// Map categories to AI image prompts for "related" visualization
const getCategoryImagePrompt = (category: CategoryType): string => {
  const map: Record<CategoryType, string> = {
    'Tech News': 'futuristic technology news studio breaking news digital',
    'AI News': 'artificial intelligence brain neural network digital glowing',
    'AI Tools': 'futuristic software interface dashboard hud hologram',
    'Smartphones & Gadgets': 'modern sleek smartphone titanium product photography',
    'Apps': 'mobile app interface ux ui design colorful abstract',
    'Software': 'computer code programming matrix screen hacker',
    'Tutorials': 'online learning education classroom digital tablet',
    'Reviews': 'tech product unboxing review camera lens gadget',
    'Deals': 'shopping cart discount sale percent sign neon 3d',
    'Cybersecurity': 'cyber security hacker lock shield digital protection',
    'Gaming': 'video game esports arena neon lights controller pc',
    'Startups & Business Tech': 'modern startup office meeting diverse team technology',
    'Web & Development': 'web development coding html css laptop coffee'
  };
  return map[category] || 'technology abstract future';
};

const generateMockPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const categories = Object.keys(TEMPLATES) as CategoryType[];
  
  let globalId = 1;

  // Generate 30 posts for each category
  categories.forEach((category) => {
    for (let i = 0; i < 30; i++) {
      const title = generateTitle(category, i);
      const prompt = getCategoryImagePrompt(category);
      
      // Use Pollinations.ai for high-quality, category-specific related images
      // Adding a seed ensures the image stays consistent for this specific post ID
      // We encode the prompt to ensure URL safety
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${globalId}`;
      
      const date = new Date();
      // Spread dates over the last 60 days
      date.setDate(date.getDate() - Math.floor(Math.random() * 60));

      posts.push({
        id: `post-${globalId++}`,
        title: title,
        excerpt: `Discover the latest insights about ${title}. We dive deep into the details, pros, cons, and what it means for the Indian market in 2025. expert analysis inside.`,
        content: `
## Introduction
**${title}** is currently the biggest topic in the Indian tech ecosystem. As technology evolves rapidly, staying updated with these changes is crucial for students, professionals, and enthusiasts in cities like ${getRandom(CITIES)}.

### Why This Matters Now
For users across India, this development changes the game. Whether you are using a ${getRandom(PHONES)} or a budget device, the impact is significant.

### Key Highlights
* **Innovation:** Pushing boundaries in the ${category} sector.
* **Cost:** Competitive pricing expected in INR (₹).
* **Availability:** Rolling out across major metro cities including ${getRandom(CITIES)}.

## Expert Opinion
Industry experts believe this trend will dominate 2025. 

> "This is a watershed moment for Indian tech. The adoption rate we are seeing in Tier-2 cities is unprecedented." - **TechFlow Senior Analyst**

## Final Verdict
Whether you are a student, professional, or enthusiast, keeping an eye on this space is recommended. We will keep updating this story as more details emerge from ${getRandom(COMPANIES)}.

*Tags: #${category.replace(/\s/g, '')} #India #Tech2025 #${getRandom(COMPANIES)}*
        `,
        author: 'TechFlow Team', // Fixed Author for all posts
        category: category,
        readTime: `${3 + Math.floor(Math.random() * 7)} min read`,
        imageUrl: imageUrl,
        date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        tags: [category, 'India', 'Tech', '2025', getRandom(COMPANIES)]
      });
    }
  });

  // Sort by date descending so the feed looks fresh
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_POSTS = generateMockPosts();
