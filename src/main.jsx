import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, ClipboardCheck, FileCheck2, Play, ScanLine, Video } from 'lucide-react';
import './styles.css';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Apparel', href: '/apparel' },
  { label: 'Services', href: '/services' },
  { label: 'About Me', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const builtWithTechnologies = [
  { name: 'React', icon: '/images/technologies/react.svg' },
  { name: 'TypeScript', icon: '/images/technologies/typescript.svg' },
  { name: 'JavaScript', icon: '/images/technologies/javascript.svg' },
  { name: 'Node.js', icon: '/images/technologies/nodejs.svg' },
  { name: 'Next.js', icon: '/images/technologies/nextjs.svg' },
  { name: 'Vite', icon: '/images/technologies/vite.svg' },
  { name: 'Supabase', icon: '/images/technologies/supabase.svg' },
  { name: 'PostgreSQL', icon: '/images/technologies/postgresql.svg' },
  { name: 'Cloudflare', icon: '/images/technologies/cloudflare.svg' },
  { name: 'GitHub', icon: '/images/technologies/github.svg' },
];

const services = [
  {
    title: 'Custom Software Development',
    description: 'Design and build custom web and mobile applications tailored to your business, workflow, and customers. AI Guy Labs™ turns specific operational problems into focused software that people can actually use.',
    icon: 'stack',
    slug: 'custom-software-development',
    productSlugs: ['saasquatch', 'sizzle'],
  },
  {
    title: 'AI-Powered Solutions',
    description: 'Integrate artificial intelligence into existing processes, automate repetitive work, analyze data, and create smarter customer experiences. The goal is practical AI that reduces friction instead of adding complexity.',
    icon: 'ai',
    slug: 'ai-powered-solutions',
    productSlugs: ['movescan'],
  },
  {
    title: 'Product Development',
    description: 'From concept and validation to launch and long-term improvement, build scalable software products with a focus on usability and performance. This work is shaped by shipping real AI Guy Labs™ products, not theory.',
    icon: 'rocket',
    slug: 'product-development',
    productSlugs: ['hotspot-studio', 'movescan'],
  },
  {
    title: 'Business Automation',
    description: 'Replace manual workflows with software that saves time, reduces errors, and improves operational efficiency. AI Guy Labs™ builds automation around how the business actually operates.',
    icon: 'flow',
    slug: 'business-automation',
    productSlugs: ['batchflow'],
  },
  {
    title: 'Interactive Platforms',
    description: 'Develop interactive customer experiences including live engagement, synchronized events, training platforms, image experiences, and digital collaboration tools. These platforms are built for participation, clarity, and real-time use.',
    icon: 'interactive',
    slug: 'interactive-platforms',
    productSlugs: ['hotspot-studio', 'pulsar'],
  },
  {
    title: 'Technical Consulting',
    description: 'Architecture planning, technical strategy, product planning, and guidance for companies building modern software. Consulting is grounded in product decisions from AI, automation, SaaS, and interactive platforms already built inside AI Guy Labs™.',
    icon: 'compass',
    slug: 'technical-consulting',
    productSlugs: ['batchflow', 'saasquatch'],
  },
];

const serviceDifferentiators = ['AI', 'Automation', 'SaaS', 'Interactive platforms', 'Workflow optimization', 'Customer engagement'];

const serviceProcess = [
  { title: 'Discover', description: 'Understand the business problem and define clear objectives.' },
  { title: 'Design', description: 'Plan the user experience, architecture, and technical approach.' },
  { title: 'Develop', description: 'Build reliable, scalable software using modern technologies.' },
  { title: 'Launch & Improve', description: 'Deploy, monitor, iterate, and continue improving based on real usage.' },
];

const premiumServices = [
  {
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    description: 'Purpose-built web and mobile software designed around the way your business actually operates.',
    capabilities: ['Web and mobile apps', 'Business workflow systems', 'User-focused interfaces'],
  },
  {
    title: 'AI Tools and Automation',
    slug: 'ai-tools-and-automation',
    description: 'Practical AI systems that reduce repetitive work, organize information, and help teams move faster.',
    capabilities: ['AI-assisted operations', 'Document and data workflows', 'Team productivity tools'],
  },
  {
    title: 'Product Design and Development',
    slug: 'product-design-and-development',
    description: 'From concept and workflow planning through interface design, development, testing, and launch.',
    capabilities: ['Product strategy', 'UX and interface design', 'Build, test, and launch'],
  },
  {
    title: 'Cloud Applications and Infrastructure',
    slug: 'cloud-applications-and-infrastructure',
    description: 'Reliable, scalable platforms built for real users, real data, and long-term growth.',
    capabilities: ['Cloud architecture', 'API and database design', 'Deployment and monitoring'],
  },
  {
    title: 'Workflow and Operations Software',
    slug: 'workflow-and-operations-software',
    description: 'Internal tools that replace disconnected spreadsheets, manual processes, and inefficient handoffs.',
    capabilities: ['Operations dashboards', 'Approval and handoff flows', 'Reporting and visibility'],
  },
  {
    title: 'Existing Product Improvement',
    slug: 'existing-product-improvement',
    description: 'Redesign, rebuild, or expand an existing product that is difficult to use, slow, or no longer meeting the business need.',
    capabilities: ['Product audits', 'Performance improvements', 'Feature expansion'],
  },
];

const premiumProcess = [
  'Understand the problem',
  'Design the right solution',
  'Build and test',
  'Launch and improve',
];
const products = [
  {
    name: 'MoveScan',
    slug: 'movescan',
    logo: '/images/movescan.png',
    glow: 'blue',
    accent: '#2d7dff',
    tagline: 'AI-powered moving estimates',
    description: 'AI-powered moving estimate platform that transforms customer video walkthroughs into organized inventories and professional moving quotes.',
    longDescription: 'MoveScan transforms customer video walkthroughs into organized moving inventories and professional moving quotes, helping moving companies create faster, clearer estimates from real customer-submitted footage.',
    status: 'Production',
    technologies: ['React Native', 'TypeScript', 'Supabase', 'OpenAI'],
    keywords: ['AI', 'moving', 'inventory', 'estimate', 'business', 'automation'],
    filters: ['AI', 'Business', 'Automation'],
    website: '/products/movescan',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['AI-assisted inventory capture', 'Estimate-ready workflows', 'Field-friendly product experience'],
    developmentValue: '$185,000',
  },
  {
    name: 'Hotspot Studio',
    slug: 'hotspot-studio',
    logo: '/images/hotspotstudio.png',
    glow: 'electric',
    accent: '#38a8ff',
    tagline: 'Turn any image into an interactive experience',
    description: 'Visual editor for building interactive image experiences with hotspots, overlays, preview mode, and exportable project JSON.',
    longDescription: 'Hotspot Studio is a visual editor for creating interactive image experiences, layering supporting artwork, defining hotspots, previewing interactions, and exporting structured project JSON for embedded runtimes.',
    status: 'Production',
    technologies: ['React', 'TypeScript', 'Vite', 'Canvas'],
    keywords: ['interactive', 'hotspots', 'overlays', 'preview mode', 'export json', 'developer tools', 'editor'],
    filters: ['Interactive', 'Developer Tools'],
    website: '/products/hotspot-studio',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Visual hotspot editing', 'Import and export workflows', 'Embeddable runtime integration'],
    developmentValue: '$75,000',
  },
  {
    name: 'BatchFlow',
    slug: 'batchflow',
    logo: '/images/batchflow.png',
    glow: 'green',
    accent: '#39d77b',
    tagline: 'Production workflow automation',
    description: 'Production software for batch manufacturing and process management.',
    longDescription: 'BatchFlow brings batch production, process tracking, and operational handoffs into a focused software workflow for teams that need repeatable execution.',
    status: 'Production',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Cloudflare'],
    keywords: ['automation', 'manufacturing', 'batch', 'workflow', 'process management'],
    filters: ['Automation', 'Business'],
    website: '/products/batchflow',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Batch process tracking', 'Production visibility', 'Workflow automation'],
    developmentValue: '$115,000',
  },
  {
    name: 'SwiftSale',
    slug: 'swiftsale',
    logo: '/images/swiftsale.png',
    glow: 'electric',
    accent: '#38a8ff',
    tagline: 'Live selling workflow automation',
    description: 'SwiftSale helps live sellers organize orders, assign bins in real time, speed fulfillment, and streamline the entire live selling process from auction to pickup.',
    longDescription: 'SwiftSale helps live sellers organize orders, assign bins in real time, speed fulfillment, and streamline the entire live selling process from auction to pickup.',
    status: 'Production',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Cloudflare'],
    keywords: ['live selling', 'auction', 'orders', 'bins', 'fulfillment', 'workflow automation'],
    filters: ['Automation', 'Business'],
    website: '/products/swiftsale',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Real-time bin assignment', 'Order organization', 'Fulfillment workflow automation'],
    developmentValue: '$225,000',
  },
  {
    name: 'Sizzle',
    slug: 'sizzle',
    logo: '/images/sizzle.png',
    glow: 'orange',
    accent: '#ff5f30',
    tagline: 'Interactive live cooking platform',
    description: 'Interactive live cooking platform that keeps hosts and participants synchronized in real time.',
    longDescription: 'Sizzle supports live cooking experiences where hosts and participants stay aligned through shared timing, steps, interaction, and real-time event flow.',
    status: 'Beta',
    technologies: ['React', 'LiveKit', 'TypeScript', 'Node.js'],
    keywords: ['interactive', 'live cooking', 'real time', 'participants', 'video'],
    filters: ['Interactive', 'Business'],
    website: '/products/sizzle',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Synchronized live sessions', 'Participant interaction', 'Host-led experience flow'],
    developmentValue: '$150,000',
  },
  {
    name: 'Pulsar',
    slug: 'pulsar',
    logo: '/images/pulsar.png',
    glow: 'purple',
    accent: '#915cff',
    tagline: 'Live audience engagement platform',
    description: 'Live audience engagement platform.',
    longDescription: 'Pulsar synchronizes hosts and viewers in real time through interactive experiences, polls, games, reactions, and audience participation.',
    status: 'Beta',
    technologies: ['React', 'LiveKit', 'Supabase', 'Cloudflare'],
    keywords: ['interactive', 'audience engagement', 'polls', 'games', 'reactions', 'real time'],
    filters: ['Interactive', 'Business'],
    website: '/products/pulsar',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Real-time audience participation', 'Polls, games, and reactions', 'Host and viewer synchronization'],
    developmentValue: '$165,000',
  },
  {
    name: 'SaaSquatch',
    slug: 'saasquatch',
    logo: '/images/saasquatch.png',
    glow: 'olive',
    accent: '#9fbd4a',
    tagline: 'SaaS software marketplace',
    description: 'SaaS software marketplace - currently in development.',
    longDescription: 'SaaS software marketplace - currently in development.',
    status: 'IN DEVELOPMENT',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Cloudflare'],
    keywords: ['marketplace', 'saas', 'software', 'business', 'purchasing'],
    filters: ['Business'],
    website: '/products/saasquatch',
    demoUrl: '/contact',
    documentationUrl: '/contact',
    features: ['Curated SaaS discovery', 'Evaluation-first marketplace', 'Purchase-ready software catalog'],
    developmentValue: '$55,000',
  },
];

const batchflowScreenshots = [
  {
    title: 'Production queue optimization',
    description: 'BatchFlow shows production teams the day\'s run order with workflow-aware recommendations and clear station readiness.',
    src: '/images/products/batchflow/batchflow-production-queue.png',
    alt: 'BatchFlow production queue showing optimized run order and scheduled batches.',
  },
  {
    title: 'Guided station workflow',
    description: 'Operators see the current production step, required prompts, progress, and completion controls without exposing unnecessary recipe complexity.',
    src: '/images/products/batchflow/batchflow-guided-workflow.png',
    alt: 'BatchFlow guided production workflow showing the active station step and progress.',
  },
  {
    title: 'Admin queue review',
    description: 'Managers can review, adjust, and approve the production queue while keeping prep and juicing work coordinated.',
    src: '/images/products/batchflow/batchflow-admin-queue.png',
    alt: 'BatchFlow admin production queue review showing scheduled products and workflow recommendations.',
  },
];


const sizzleScreenshots = [
  {
    title: 'Sizzle live cooking experience',
    description: 'Sizzle brings live cooking, host controls, audience interaction, and guided recipe timing into one polished cook-along interface.',
    src: '/images/products/sizzle/sizzle_screenshot.png',
    alt: 'Sizzle product interface screenshot showing the live cooking experience.',
  },
  {
    title: 'Interactive cook-along room',
    description: 'Hosts and viewers stay synchronized with live chat, recipe steps, timers, reactions, and cook-along progress.',
    src: '/images/products/sizzle/sizzle-live-cookalong.png',
    alt: 'Sizzle live cook-along room showing host controls, chat, step timer, and reactions.',
  },
  {
    title: 'Live kitchen creation',
    description: 'Hosts can prepare a live kitchen with cover artwork, session details, cooking style, ingredients, steps, and timing before going live.',
    src: '/images/products/sizzle/sizzle-create-live-kitchen.png',
    alt: 'Sizzle host creation screen for starting a live kitchen.',
  },
];


const swiftsaleScreenshots = [
  {
    title: 'Live show command center',
    description: 'SwiftSale gives live sellers a real-time operating surface for orders, bins, pickup flow, and fulfillment while the sale is happening.',
    src: '/images/products/swiftsale/live-show-ready.png',
    alt: 'SwiftSale live show workflow screen with order and fulfillment controls.',
  },
  {
    title: 'Buyer engagement tools',
    description: 'Interactive selling tools help sellers keep the audience engaged while orders and claims stay organized behind the scenes.',
    src: '/images/products/swiftsale/games.png',
    alt: 'SwiftSale audience engagement and live selling tools screen.',
  },
  {
    title: 'Order annotation and organization',
    description: 'Sellers can mark up products, organize claims, and keep fulfillment details clear from auction to pickup.',
    src: '/images/products/swiftsale/annotate.png',
    alt: 'SwiftSale product annotation and order organization screen.',
  },
];


const hotspotStudioScreenshots = [
  {
    title: 'Interactive image editor',
    description: 'Hotspot Studio gives teams a focused workspace for turning static visuals into interactive image experiences with clickable regions and structured behavior.',
    src: '/images/products/hotshot_studio/hotshot_screen_1.png',
    alt: 'Hotspot Studio editor interface showing an interactive image project workspace.',
  },
  {
    title: 'Hotspot configuration workflow',
    description: 'Editors can place hotspots, refine interaction details, preview behavior, and keep project structure organized without leaving the canvas.',
    src: '/images/products/hotshot_studio/hotshot_screen_2.png',
    alt: 'Hotspot Studio configuration screen for editing interactive hotspot behavior.',
  },
  {
    title: 'Preview and export-ready output',
    description: 'Hotspot Studio supports a clean handoff from visual editing to reusable project data that can be embedded in production experiences.',
    src: '/images/products/hotshot_studio/hotshot_screen_3.png',
    alt: 'Hotspot Studio preview and export interface for an interactive image project.',
  },
];

const pulsarScreenshots = [
  {
    title: 'Pulsar product mockup',
    description: 'The dedicated Pulsar product preview presents the live engagement platform in the format that fits the visitor\'s device.',
    src: '/images/products/pulsar/pulsar-desktop.png',
    desktopSrc: '/images/products/pulsar/pulsar-desktop.png',
    mobileSrc: '/images/products/pulsar/pulsar-mobile.png',
    alt: 'Pulsar desktop product marketing mockup.',
    mobileAlt: 'Pulsar mobile product marketing mockup.',
  },
  {
    title: 'Audience participation flow',
    description: 'Live prompts, reactions, and engagement tools help turn passive viewers into active participants during the experience.',
    src: '/images/products/pulsar/pulsar-audience-engagement.png',
    alt: 'Pulsar audience engagement interface with live participation tools.',
  },
  {
    title: 'Host controls and session management',
    description: 'Hosts can guide the room, control timing, and manage the engagement flow from one clear production-ready interface.',
    src: '/images/products/pulsar/pulsar-host-controls.png',
    alt: 'Pulsar host controls for managing a live audience engagement session.',
  },
  {
    title: 'Pulsar live engagement dashboard',
    description: 'Pulsar gives hosts a focused command center for running live audience moments, monitoring activity, and keeping participation moving.',
    src: '/images/products/pulsar/pulsar-live-dashboard.png',
    alt: 'Pulsar live audience engagement dashboard interface.',
  },
];
const showcaseProducts = products;



const SITE_URL = 'https://aiguylabs.com';
const DEFAULT_SEO_IMAGE = '/images/ai_guy_brain_icon.png';

const publicRouteSeo = {
  '/': {
    title: 'AI Guy Labs™ | Custom Software, AI Automation, and Product Development',
    description: 'AI Guy Labs™ builds custom software products, AI automation, and applications that solve real business problems for operators, creators, and growing companies.',
  },
  '/products': {
    title: 'Products | AI Guy Labs™',
    description: 'Explore the AI Guy Labs™ software ecosystem, including MoveScan, Hotspot Studio, BatchFlow, SwiftSale, Sizzle, Pulsar, and SaaSquatch.',
  },
  '/apparel': {
    title: 'AI Guy Apparel | AI Guy Labs™',
    description: 'AI Guy Apparel is premium apparel for creators, developers, innovators, and independent thinkers. WE ARE BUILDERS.',
  },
  '/services': {
    title: 'Services | AI Guy Labs™',
    description: 'AI Guy Labs™ designs and builds custom software, AI-powered tools, automation systems, interactive platforms, and production-ready digital products.',
  },
  '/about': {
    title: 'About Michael St. Pierre | AI Guy Labs™',
    description: 'Learn about Michael St. Pierre, founder of AI Guy Labs™, and the product-building approach behind the AI Guy Labs™ software ecosystem.',
  },
  '/contact': {
    title: 'Contact | AI Guy Labs™',
    description: 'Contact AI Guy Labs™ to discuss custom software, AI automation, product development, and business workflow systems built for real outcomes.',
  },
};

function absoluteUrl(value = '/') {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = value.startsWith('/') ? value : '/' + value;
  return SITE_URL + path;
}

function normalizeRoutePath(value) {
  if (!value || value === '/') {
    return '/';
  }

  return value.replace(/\/$/, '') || '/';
}

function resolveSeoMetadata(path, product) {
  const cleanPath = normalizeRoutePath(path);

  if (product) {
    return {
      title: product.name + ' | AI Guy Labs™ Product',
      description: product.description,
      canonical: absoluteUrl(product.website),
      image: absoluteUrl(product.logo || DEFAULT_SEO_IMAGE),
      robots: 'index,follow',
      type: 'website',
    };
  }

  if (publicRouteSeo[cleanPath]) {
    return {
      ...publicRouteSeo[cleanPath],
      canonical: absoluteUrl(cleanPath),
      image: absoluteUrl(DEFAULT_SEO_IMAGE),
      robots: 'index,follow',
      type: 'website',
    };
  }

  if (cleanPath === '/admin/leads') {
    return {
      title: 'Private Leads | AI Guy Labs™',
      description: 'Private AI Guy Labs™ lead management area.',
      canonical: absoluteUrl('/admin/leads'),
      image: absoluteUrl(DEFAULT_SEO_IMAGE),
      robots: 'noindex,nofollow',
      type: 'website',
    };
  }

  if (cleanPath === '/private/campaigns') {
    return {
      title: 'Private Campaign Analytics | AI Guy Labs™',
      description: 'Private MoveScan postcard campaign analytics for reviewing QR scans and response.',
      canonical: absoluteUrl('/private/campaigns'),
      image: absoluteUrl(DEFAULT_SEO_IMAGE),
      robots: 'noindex,nofollow',
      type: 'website',
    };
  }

  if (cleanPath === '/products/movescan/demo') {
    return {
      title: 'MoveScan Demo | AI Guy Labs™',
      description: 'MoveScan demo experience for reviewing the guided customer quote workflow.',
      canonical: absoluteUrl('/products/movescan'),
      image: absoluteUrl('/images/movescan.png'),
      robots: 'noindex,follow',
      type: 'website',
    };
  }

  if (cleanPath === '/go/movescan-postcard') {
    return {
      title: 'Redirecting to MoveScan | AI Guy Labs™',
      description: 'Redirecting to MoveScan.',
      canonical: absoluteUrl('/go/movescan-postcard'),
      image: absoluteUrl(DEFAULT_SEO_IMAGE),
      robots: 'noindex,nofollow',
      type: 'website',
    };
  }

  if (cleanPath === '/privacy' || cleanPath === '/terms') {
    const label = cleanPath === '/privacy' ? 'Privacy Policy' : 'Terms of Service';

    return {
      title: label + ' | AI Guy Labs™',
      description: label + ' for AI Guy Labs™.',
      canonical: absoluteUrl(cleanPath),
      image: absoluteUrl(DEFAULT_SEO_IMAGE),
      robots: 'noindex,follow',
      type: 'website',
    };
  }

  return {
    title: 'Page Not Found | AI Guy Labs™',
    description: 'The requested AI Guy Labs™ page could not be found.',
    canonical: absoluteUrl(cleanPath),
    image: absoluteUrl(DEFAULT_SEO_IMAGE),
    robots: 'noindex,follow',
    type: 'website',
  };
}


const BASE_ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  name: 'AI Guy Labs',
  url: SITE_URL,
  logo: absoluteUrl(DEFAULT_SEO_IMAGE),
  description: 'AI Guy Labs is a software development company that creates original software products and custom software solutions.',
};

function compactSchema(value) {
  if (Array.isArray(value)) {
    return value.map(compactSchema).filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, compactSchema(item)])
        .filter(([, item]) => item !== undefined && item !== '' && !(Array.isArray(item) && item.length === 0))
    );
  }

  return value === null ? undefined : value;
}

function productApplicationCategory(product) {
  const categories = [...(product?.filters?.filter(Boolean) || [])];

  if (product?.keywords?.includes('developer tools') && !categories.includes('Developer Tools')) {
    categories.push('Developer Tools');
  }

  return categories.length ? categories.join(', ') + ' Software' : 'SoftwareApplication';
}

function createSoftwareApplicationSchema(product) {
  return compactSchema({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.longDescription || product.description,
    url: absoluteUrl(product.website),
    image: absoluteUrl(product.logo),
    applicationCategory: productApplicationCategory(product),
    publisher: BASE_ORGANIZATION_SCHEMA,
  });
}

function createBreadcrumbSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: absoluteUrl('/products'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: absoluteUrl(product.website),
      },
    ],
  };
}

function resolveStructuredData(path, product) {
  const cleanPath = normalizeRoutePath(path);

  if (cleanPath === '/') {
    return [
      {
        '@context': 'https://schema.org',
        ...BASE_ORGANIZATION_SCHEMA,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AI Guy Labs',
        url: SITE_URL,
        publisher: BASE_ORGANIZATION_SCHEMA,
      },
    ];
  }

  if (product) {
    return [createSoftwareApplicationSchema(product), createBreadcrumbSchema(product)];
  }

  return [];
}

function applyStructuredData(items) {
  document.head.querySelectorAll('script[type="application/ld+json"][data-aigl-schema]').forEach((script) => script.remove());

  items.forEach((item, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.aiglSchema = String(index + 1);
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function ensureHeadElement(selector, createElement) {
  const existing = document.head.querySelector(selector);

  if (existing) {
    return existing;
  }

  const element = createElement();
  document.head.appendChild(element);
  return element;
}

function setNamedMeta(name, content) {
  const element = ensureHeadElement('meta[name="' + name + '"]', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    return meta;
  });

  element.setAttribute('content', content);
}

function setPropertyMeta(property, content) {
  const element = ensureHeadElement('meta[property="' + property + '"]', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    return meta;
  });

  element.setAttribute('content', content);
}

function setCanonical(url) {
  const element = ensureHeadElement('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });

  element.setAttribute('href', url);
}

function applySeoMetadata(metadata) {
  document.title = metadata.title;
  setNamedMeta('description', metadata.description);
  setNamedMeta('robots', metadata.robots);
  setCanonical(metadata.canonical);
  setPropertyMeta('og:site_name', 'AI Guy Labs™');
  setPropertyMeta('og:type', metadata.type);
  setPropertyMeta('og:title', metadata.title);
  setPropertyMeta('og:description', metadata.description);
  setPropertyMeta('og:url', metadata.canonical);
  setPropertyMeta('og:image', metadata.image);
  setNamedMeta('twitter:card', 'summary_large_image');
  setNamedMeta('twitter:title', metadata.title);
  setNamedMeta('twitter:description', metadata.description);
  setNamedMeta('twitter:image', metadata.image);
}

const productFilters = ['All', 'AI', 'Automation', 'Business', 'Interactive', 'Developer Tools'];

const productStack = [
  { name: 'React', icon: '/images/technologies/react.svg' },
  { name: 'React Native', icon: '/images/technologies/react-native.svg' },
  { name: 'TypeScript', icon: '/images/technologies/typescript.svg' },
  { name: 'Next.js', icon: '/images/technologies/nextjs.svg' },
  { name: 'Node.js', icon: '/images/technologies/nodejs.svg' },
  { name: 'Supabase', icon: '/images/technologies/supabase.svg' },
  { name: 'PostgreSQL', icon: '/images/technologies/postgresql.svg' },
  { name: 'Cloudflare', icon: '/images/technologies/cloudflare.svg' },
  { name: 'OpenAI', icon: '/images/technologies/openai.svg' },
  { name: 'LiveKit', icon: '/images/technologies/livekit.svg' },
];

const footerNav = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const footerProducts = [
  { label: 'MoveScan', href: '/products/movescan' },
  { label: 'Hotspot Studio', href: '/products/hotspot-studio' },
  { label: 'BatchFlow', href: '/products/batchflow' },
  { label: 'SwiftSale', href: '/products/swiftsale' },
  { label: 'Sizzle', href: '/products/sizzle' },
  { label: 'Pulsar', href: '/products/pulsar' },
  { label: 'SaaSquatch', href: '/products/saasquatch', status: 'IN DEVELOPMENT' },
];

const MOVESCAN_LOGIN_URL = 'https://movescan.app/login';
const MOVESCAN_DEMO_URL = 'https://movescan.aiguylabs.com/quote/movescan-demo';
const MOVESCAN_FREE_TRIAL_URL = 'https://www.movescan.app';
const MOVESCAN_POSTCARD_REDIRECT_URL = '/products/movescan?utm_source=postcard&utm_medium=direct_mail&utm_campaign=movescan_local_launch';
const MOVESCAN_POSTCARD_TRACKING_ENDPOINT = '/api/campaign-events';
const MOVESCAN_OUTREACH_TRACKING_ENDPOINT = '/api/campaign-events/engagement';
const MOVESCAN_DEMO_VIDEO_URL = typeof window !== 'undefined' && (window.__MOVESCAN_DEMO_VIDEO_URL__ || import.meta.env.VITE_MOVESCAN_DEMO_VIDEO_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '/videos/movescan-demo.mp4' : 'https://media.aiguylabs.com/movescan-demo.mp4'));
const MOVESCAN_SPLASH_STORAGE_KEY = 'aigl_movescan_product_splash_seen';

function Icon({ type }) {
  if (type === 'message') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.5h15v10h-9L6 20v-3.5H4.5v-10Z" />
      </svg>
    );
  }

  if (type === 'ai') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m6.5 6.5 2.8 2.8" />
        <path d="m14.7 14.7 2.8 2.8" />
        <path d="m17.5 6.5-2.8 2.8" />
        <path d="m9.3 14.7-2.8 2.8" />
        <circle cx="12" cy="12" r="3.8" />
      </svg>
    );
  }

  if (type === 'interactive') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v10H4V5Z" />
        <path d="m8 19 4-4 4 4" />
        <circle cx="9" cy="10" r="1.4" />
        <circle cx="15" cy="10" r="1.4" />
      </svg>
    );
  }

  if (type === 'stack') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </svg>
    );
  }

  if (type === 'rocket') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 5c2.7-2.5 5.6-2 6-1.6.4.4.9 3.3-1.6 6l-5.8 5.8-4.4-4.4L13 5Z" />
        <path d="m8 16-3 3" />
        <path d="m14.5 7.5 2 2" />
      </svg>
    );
  }

  if (type === 'flow') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h5v5H5V7Z" />
        <path d="M14 12h5v5h-5v-5Z" />
        <path d="M10 9.5h2.5a4 4 0 0 1 4 4" />
      </svg>
    );
  }

  if (type === 'compass') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="m15 9-2 5-4 1 2-5 4-1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Logo() {
  return (
    <a className="logo" href="/" aria-label="AI Guy Labs™ home">
      <img src="/images/aiguy_logo.PNG" alt="AI Guy Labs™" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="button button-small button-primary header-cta" href="/contact">Work With Me</a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
        ))}
        <a className="button button-primary" href="/contact" onClick={closeMenu}>Work With Me</a>
      </nav>
    </header>
  );
}

function ProductValuation({ product, compact = false }) {
  if (!product?.developmentValue) return null;

  if (compact) {
    return (
      <div className="product-valuation product-valuation--compact">
        <span>Development Value:</span>
        <strong>{product.developmentValue}</strong>
      </div>
    );
  }

  return (
    <div className="product-valuation">
      <p className="product-valuation-label">Estimated Development Value</p>
      <p className="product-valuation-value">{product.developmentValue}</p>
      <p className="product-valuation-note">Estimated cost to recreate the current software, source code, product design, architecture, and implemented functionality.</p>
    </div>
  );
}
function ProductStatusBadge({ product, className = '' }) {
  if (product?.status !== 'IN DEVELOPMENT') return null;

  return <span className={className ? 'status-badge status-badge--development ' + className : 'status-badge status-badge--development'}>IN DEVELOPMENT</span>;
}

function ProductShowcase({ titleId }) {
  return (
    <div className="portfolio-showcase">
      <div className="portfolio-heading">
        <p className="eyebrow">Products built by AI Guy Labs™</p>
        <h1 id={titleId}>A growing ecosystem of software products.</h1>
        <p className="portfolio-summary">AI Guy Labs™ is a software development company that creates original software products and custom software solutions for real business workflows.</p>
      </div>
      <div className="product-showcase">
        {showcaseProducts.map((product) => (
          <a
            className={"product-logo-card product-logo-card--" + product.glow}
            key={product.name}
            href={product.website}
            aria-label={"Learn more about " + product.name}
          >
            <div className="product-logo-frame">
              <img src={product.logo} alt={product.name + " logo"} />
            </div>
            <div className="product-card-copy">
              <div className="product-title-row"><h2>{product.name}</h2><ProductStatusBadge product={product} /></div>
              <p>{product.description}</p>
              <span className="product-card-link">Explore Product <Icon /></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function TechnologyStrip() {
  return (
    <section className="technology-strip" aria-labelledby="technology-title">
      <div className="container technology-inner">
        <h2 id="technology-title">Built With</h2>
        <div className="tech-list" aria-label="AI Guy Labs™ development technologies">
          {builtWithTechnologies.map((tech) => (
            <span className="tech-item" key={tech.name} title={tech.name} role="img" aria-label={tech.name}>
              <img src={tech.icon} alt="" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, featured = false }) {
  const referencedProducts = (service.productSlugs || [])
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  return (
    <article id={service.slug} className={featured ? 'surface-card service-card service-card-featured' : 'surface-card service-card'}>
      <div className="line-icon"><Icon type={service.icon} /></div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {referencedProducts.length > 0 ? (
        <div className="service-product-row" aria-label={service.title + ' related AI Guy Labs™ products'}>
          {referencedProducts.map((product) => <ProductReference product={product} key={product.slug} />)}
        </div>
      ) : null}
      <a className="text-link" href={featured ? '/services#' + service.slug : '#contact'}>Learn More <Icon /></a>
    </article>
  );
}

function ProductReference({ product }) {
  return (
    <a className="product-reference" href={product.website} style={{ '--accent': product.accent }} aria-label={"View " + product.name}>
      <img src={product.logo} alt="" aria-hidden="true" loading="lazy" />
      <span>{product.name}</span>
    </a>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="section-shell services-section" aria-labelledby="services-title">
      <div className="container services-grid">
        <div className="section-intro sticky-intro">
          <p className="eyebrow">Services</p>
          <h2 id="services-title">Software built to solve real business problems.</h2>
          <p>AI Guy Labs™ helps businesses build modern software, automate operations, integrate AI, and transform ideas into production-ready applications.</p>
          <a className="button button-secondary services-page-link" href="/services">View Services <Icon /></a>
        </div>
        <div className="service-cards">
          {services.map((service) => <ServiceCard service={service} featured key={service.title} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section-shell projects-section" aria-labelledby="projects-title" tabIndex="-1">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Featured Projects</p>
            <h2 id="projects-title">Products I've Built</h2>
          </div>
          <a className="button button-secondary" href="/products">View All Products <Icon /></a>
        </div>
        <div className="project-grid">
          {products.map((project) => (
            <article className={"surface-card project-card project-card--" + project.glow} key={project.name}>
              <div className="project-logo">
                <img src={project.logo} alt={project.name + " logo"} />
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <a className="text-link" href={project.website}>Learn More <Icon /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const proofPoints = [
    '7 software products built',
    'Multiple industries served',
    'Product strategy, design, and development',
    'From idea to working software',
  ];

  return (
    <section id="about" className="section-shell about-section" aria-labelledby="about-title">
      <div className="container about-panel">
        <div className="about-content">
          <div className="about-copy">
            <p className="eyebrow">About Me</p>
            <h2 id="about-title">I build software from real-world problems.</h2>
            <p>I'm Michael St. Pierre, founder of AI Guy Labs™ and a product builder focused on creating practical software for real businesses. I've built products across moving estimates, live selling, batch production, interactive cooking, audience engagement, visual experiences, and SaaS discovery.</p>
            <p>My approach is simple: identify a frustrating workflow, understand how people actually use it, and build software that makes the process faster, clearer, and easier to manage.</p>
            <p>AI Guy Labs™ is the home of products including MoveScan, SwiftSale, BatchFlow, Sizzle, Pulsar, Hotspot Studio, and SaaSquatch.</p>
          </div>
          <div className="about-proof" aria-label="AI Guy Labs™ proof points">
            {proofPoints.map((point) => <div className="proof-card" key={point}>{point}</div>)}
          </div>
          <a className="button button-primary about-cta" href="/products">Explore the Products <Icon /></a>
        </div>
        <figure className="about-team-card">
          <img src="/images/aiguy_team.png" alt="AI Guy Labs™ development team." width="1536" height="1024" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="section-shell cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-panel">
          <p className="eyebrow">Ready to build something great?</p>
          <h2 id="cta-title">Let's bring your idea to life.</h2>
          <p>I'm always open to discussing new projects, partnerships, and opportunities to help your business grow.</p>
          <a className="button button-primary" href="/contact">Work With Me <Icon /></a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="footer-brand-name" href="/">AI Guy Labs™</a>
          <p>Software. AI-powered. Built for results.</p>
        </div>
        <nav aria-label="Footer navigation">
          <h2>Navigation</h2>
          <ul>
            {footerNav.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
          </ul>
        </nav>
        <nav aria-label="Footer product navigation">
          <h2>Products</h2>
          <ul>
            {footerProducts.map((item) => <li key={item.href}><a href={item.href}>{item.label}{item.status ? <span className="status-badge status-badge--development footer-product-badge">{item.status}</span> : null}</a></li>)}
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2026 AI Guy Labs™. All rights reserved.</p>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
function ServicesHero() {
  return (
    <section className="services-hero section-shell services-hero-premium" aria-labelledby="services-hero-title">
      <div className="container services-hero-inner">
        <p className="eyebrow">SERVICES</p>
        <h1 id="services-hero-title">We build software that moves businesses forward.</h1>
        <p>From the first idea to a production-ready product, AI Guy Labs™ designs and builds focused software, AI systems, and digital experiences with a clear purpose.</p>
      </div>
    </section>
  );
}

function ServiceVisual({ index }) {
  return (
    <div className="service-editorial-visual" aria-hidden="true">
      <div className="service-visual-frame">
        <span className="service-visual-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="service-visual-line service-visual-line--one" />
        <span className="service-visual-line service-visual-line--two" />
        <span className="service-visual-node service-visual-node--one" />
        <span className="service-visual-node service-visual-node--two" />
      </div>
    </div>
  );
}

function ServiceEditorialPanel({ service, index }) {
  const reverse = index % 2 === 1;
  return (
    <article id={service.slug} className={reverse ? 'service-editorial service-editorial--reverse' : 'service-editorial'}>
      <div className="service-editorial-copy">
        <p className="service-number">{String(index + 1).padStart(2, '0')}</p>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <ul className="service-capabilities">
          {service.capabilities.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <a className="editorial-link" href="/contact">Discuss This Service <Icon /></a>
      </div>
      <ServiceVisual index={index} />
    </article>
  );
}

function ServicesListSection() {
  return (
    <section id="service-list" className="section-shell services-editorial-section" aria-labelledby="service-list-title">
      <div className="container">
        <h2 id="service-list-title" className="sr-only">AI Guy Labs™ services</h2>
        <div className="services-editorial-list">
          {premiumServices.map((service, index) => <ServiceEditorialPanel service={service} index={index} key={service.slug} />)}
        </div>
      </div>
    </section>
  );
}

function ServicesProcess() {
  return (
    <section className="section-shell services-process-premium" aria-labelledby="process-title">
      <div className="container">
        <div className="services-process-heading">
          <p className="eyebrow">HOW WE BUILD</p>
          <h2 id="process-title">Clear decisions. Focused execution. No unnecessary complexity.</h2>
        </div>
        <div className="services-process-line" aria-label="AI Guy Labs™ build process">
          {premiumProcess.map((step, index) => (
            <div className="services-process-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesClosingCTA() {
  return (
    <section className="section-shell services-closing" aria-labelledby="services-closing-title">
      <div className="container services-closing-inner">
        <p className="eyebrow">Work With AI Guy Labs™</p>
        <h2 id="services-closing-title">Have a problem software could solve?</h2>
        <p>Tell us what is slowing your business down. We'll help determine what should be built.</p>
        <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <main className="services-page-premium">
      <ServicesHero />
      <ServicesListSection />
      <ServicesProcess />
      <ServicesClosingCTA />
    </main>
  );
}
function ProductsHero() {
  return (
    <section className="products-hero section-shell products-hero-premium" aria-labelledby="products-hero-title">
      <div className="container products-hero-inner">
        <p className="eyebrow">Products Built by AI Guy Labs™</p>
        <h1 id="products-hero-title">Software designed to solve real problems.</h1>
        <p>Focused products for operators, teams, creators, and companies that need software with a clear job to do.</p>
      </div>
    </section>
  );
}
function ProductsEcosystem() {
  return (
    <section id="ecosystem" className="section-shell products-ecosystem" aria-labelledby="ecosystem-title">
      <div className="container">
        <div className="section-heading-row products-section-heading">
          <div>
            <p className="eyebrow">Software Ecosystem</p>
            <h2 id="ecosystem-title">A connected catalog of focused products.</h2>
          </div>
          <p>Each product solves a practical business problem while sharing the same standards for usability, performance, and durable product design.</p>
        </div>
        <div className="ecosystem-grid">
          {products.map((product) => (
            <a className="ecosystem-card" href={'#' + product.slug} key={product.slug} style={{ '--accent': product.accent }}>
              <div className="ecosystem-icon"><img src={product.logo} alt={product.name + ' icon'} /></div>
              <div>
                <h3>{product.name}</h3>
                <p>{product.tagline}</p>
              </div>
              <span>Learn More <Icon /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSpotlight({ product }) {
  return (
    <section className="section-shell product-spotlight-section" aria-labelledby="spotlight-title">
      <div className="container product-spotlight" style={{ '--accent': product.accent }}>
        <div className="spotlight-artwork" aria-hidden="true">
          <div className="spotlight-icon-orbit">
            <img src={product.logo} alt="" />
          </div>
        </div>
        <div className="spotlight-copy">
          <p className="eyebrow">Product Spotlight</p>
          <h2 id="spotlight-title">{product.name}</h2>
          <p>{product.longDescription}</p>
          <div className="feature-list">
            {product.features.map((feature) => <span key={feature}>{feature}</span>)}
          </div>
          <div className="badge-row" aria-label={product.name + ' technologies'}>
            {product.technologies.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
          <div className="spotlight-actions">
            <a className="button button-primary" href={product.website}>View Product <Icon /></a>
            <a className="button button-secondary" href={product.demoUrl}>Watch Demo</a>
            <a className="text-link" href={'#' + product.slug}>Learn More <Icon /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsCatalog() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesFilter = filter === 'All' || product.filters.includes(filter);
    const searchable = [product.name, product.description, product.tagline, product.longDescription, ...product.keywords, ...product.technologies].join(' ').toLowerCase();
    return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  return (
    <section id="catalog" className="section-shell products-catalog" aria-labelledby="catalog-title">
      <div className="container">
        <div className="section-heading-row products-section-heading">
          <div>
            <p className="eyebrow">All Products</p>
            <h2 id="catalog-title">Complete software catalog</h2>
          </div>
          <p>Search and filter the current AI Guy Labs™ ecosystem. New products can be added through the shared product configuration.</p>
        </div>
        <div className="catalog-controls" role="search">
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product, description, keyword, or technology" />
          <div className="filter-tabs" aria-label="Product filters">
            {productFilters.map((item) => (
              <button className={filter === item ? 'active' : ''} type="button" key={item} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="catalog-grid" aria-live="polite">
          {visibleProducts.map((product) => (
            <article id={product.slug} className="catalog-card" key={product.slug} style={{ '--accent': product.accent }}>
              <div className="catalog-card-top">
                <img src={product.logo} alt={product.name + ' icon'} />
                <span className={'status-pill status-pill--' + product.status.toLowerCase().replace(/\s+/g, '-')}>{product.status}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="catalog-tech-list">
                {product.technologies.map((tech) => <span key={tech}>{tech}</span>)}
              </div>
              <a className="text-link" href={product.website}>Learn More <Icon /></a>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 ? <p className="empty-results">No products match that search yet.</p> : null}
      </div>
    </section>
  );
}

function ProductsTechnologyStack() {
  return (
    <section className="section-shell product-stack-section" aria-labelledby="stack-title">
      <div className="container">
        <div className="section-intro centered-intro">
          <p className="eyebrow">Technology Stack</p>
          <h2 id="stack-title">Modern tools behind the ecosystem.</h2>
          <p>AI Guy Labs™ products are built with reliable, scalable technologies chosen for practical product execution.</p>
        </div>
        <div className="stack-grid">
          {productStack.map((tech) => (
            <div className="stack-card" key={tech.name}>
              <img src={tech.icon} alt="" className="technology-icon" aria-hidden="true" />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsCTA() {
  return (
    <section className="section-shell products-final-cta" aria-labelledby="products-cta-title">
      <div className="container">
        <div className="cta-panel">
          <p className="eyebrow">Work With AI Guy Labs™</p>
          <h2 id="products-cta-title">Have an idea? Let's build it together.</h2>
          <p>Whether you're looking for custom software, AI solutions, automation, or interactive experiences, AI Guy Labs™ can help bring your vision to life.</p>
          <div className="hero-actions cta-actions">
            <a className="button button-primary" href="/contact">Start a Project <Icon /></a>
            <a className="button button-secondary" href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductEditorialPanel({ product, index }) {
  const reverse = index % 2 === 1;
  return (
    <article id={product.slug} className={reverse ? 'product-editorial product-editorial--reverse' : 'product-editorial'} style={{ '--accent': product.accent }}>
      <div className="product-editorial-copy">
        {product.status === 'IN DEVELOPMENT' ? <ProductStatusBadge product={product} className="product-editorial-status" /> : <p className="eyebrow">{product.status}</p>}
        <div className="product-title-lockup">
          <img src={product.logo} alt="" aria-hidden="true" />
          <h2>{product.name}</h2>
        </div>
        <p className="product-statement">{product.tagline}</p>
        <p>{product.longDescription}</p>
        <ProductValuation product={product} compact />
        <a className="editorial-link" href={product.website}>Explore Product <Icon /></a>
      </div>
    </article>
  );
}

function ProductsEditorialShowcase() {
  return (
    <section id="products-portfolio" className="section-shell products-editorial-section" aria-labelledby="products-portfolio-title">
      <div className="container">
        <h2 id="products-portfolio-title" className="sr-only">AI Guy Labs™ product portfolio</h2>
        <div className="products-editorial-list">
          {products.map((product, index) => <ProductEditorialPanel product={product} index={index} key={product.slug} />)}
        </div>
      </div>
    </section>
  );
}

function ProductsPage() {
  return (
    <main className="products-page-premium">
      <ProductsHero />
      <ProductsEditorialShowcase />
    </main>
  );
}

function ApparelPage() {
  const apparelCategories = ['Tees', 'Hoodies', 'Headwear'];

  return (
    <main className="apparel-page">
      <section className="apparel-hero" aria-labelledby="apparel-hero-title">
        <div className="container apparel-hero-inner">
          <div className="apparel-hero-copy">
            <img className="apparel-brand-mark" src="/images/aiguy_logo.PNG" alt="AI Guy Labs™" />
            <p className="apparel-kicker">WE ARE BUILDERS.</p>
            <h1 id="apparel-hero-title">AI Guy Apparel</h1>
            <p>Premium apparel for creators, developers, innovators, and independent thinkers.</p>
            <a className="button button-primary apparel-cta" href="#apparel-collection">Shop Collection <Icon /></a>
          </div>
        </div>
      </section>

      <section className="apparel-proof-strip" aria-label="AI Guy Apparel details">
        <div className="container apparel-proof-grid">
          <div>
            <h2>Premium Quality</h2>
            <p>Built to be worn.</p>
          </div>
          <div>
            <h2>Limited Drops</h2>
            <p>Small runs. Distinct pieces.</p>
          </div>
          <div>
            <h2>Original Designs</h2>
            <p>Made for builders.</p>
          </div>
        </div>
      </section>

      <section id="apparel-collection" className="apparel-section apparel-collection" aria-labelledby="apparel-collection-title">
        <div className="container">
          <div className="apparel-section-heading">
            <p className="apparel-kicker">AI GUY APPAREL</p>
            <h2 id="apparel-collection-title">The Collection</h2>
          </div>
          <div className="apparel-category-grid">
            {apparelCategories.map((category) => (
              <article className="apparel-category-tile" key={category}>
                <div className="apparel-category-media" aria-hidden="true">
                  <img src="/images/ai_guy_brain_icon.png" alt="" loading="lazy" />
                </div>
                <h3>{category}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="apparel-section apparel-brand-section" aria-labelledby="apparel-brand-title">
        <div className="container apparel-editorial-grid">
          <div className="apparel-editorial-image" aria-hidden="true">
            <img src="/images/aiguy_mark.jpeg" alt="" loading="lazy" />
          </div>
          <div className="apparel-editorial-copy">
            <p className="apparel-kicker">WE ARE BUILDERS.</p>
            <h2 id="apparel-brand-title">Built for the people who build.</h2>
            <p>AI Guy is for developers, creators, founders, designers, makers, and independent thinkers—the people creating what comes next.</p>
            <a className="apparel-text-link" href="/about">Our Story <Icon /></a>
          </div>
        </div>
      </section>

      <section className="apparel-section apparel-drop" aria-labelledby="apparel-drop-title">
        <div className="container apparel-drop-panel">
          <div className="apparel-drop-copy">
            <p className="apparel-kicker">AI GUY / DROP 001</p>
            <h2 id="apparel-drop-title">The Builder Collection</h2>
            <p>Clean essentials for the people creating what's next.</p>
            <a className="button button-secondary apparel-cta" href="#apparel-collection">Explore the Collection <Icon /></a>
          </div>
          <div className="apparel-drop-image" aria-hidden="true">
            <img src="/images/ai_guy_brain_icon.png" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="apparel-section apparel-signup" aria-labelledby="apparel-signup-title">
        <div className="container apparel-signup-inner">
          <div>
            <p className="apparel-kicker">WE ARE BUILDERS.</p>
            <h2 id="apparel-signup-title">Get the next drop.</h2>
            <p>New releases, limited drops, and AI Guy updates.</p>
          </div>
          <form className="apparel-signup-form" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="apparel-email">Email address</label>
            <input id="apparel-email" type="email" name="email" placeholder="Email address" autoComplete="email" />
            <button className="button button-primary" type="submit">Join the List</button>
          </form>
        </div>
      </section>
    </main>
  );
}
function AboutPage() {
  const principles = ['Build for real workflows', 'Keep the experience clear', 'Measure results, not features'];
  const aboutProducts = products;

  return (
    <main className="about-page-premium">
      <section className="section-shell about-page-hero" aria-labelledby="about-page-title">
        <div className="container about-page-hero-inner">
          <div className="about-page-copy">
            <p className="eyebrow">ABOUT AI GUY</p>
            <h1 id="about-page-title">Built by someone who understands real business problems.</h1>
            <p>AI Guy Labs™ is a software development company led by Michael St. Pierre, a founder and product builder focused on creating original software products and custom software solutions that improve how businesses operate, sell, communicate, and grow.</p>
          </div>
          <figure className="about-page-visual">
            <img src="/images/aiguy_mark.jpeg" alt="Michael St. Pierre, founder of AI Guy Labs™." width="1024" height="1536" />
          </figure>
        </div>
      </section>

      <section className="section-shell about-story-section" aria-labelledby="about-story-title">
        <div className="container about-editorial-block">
          <p className="eyebrow">Story</p>
          <h2 id="about-story-title">From operating businesses to building software.</h2>
          <p>Before building software products, Michael spent years operating real businesses and managing the day-to-day problems that come with sales, employees, inventory, customers, fulfillment, and growth. AI Guy Labs™ was created to turn those firsthand operational challenges into focused software products.</p>
        </div>
      </section>

      <section className="section-shell about-perspective-section" aria-labelledby="about-perspective-title">
        <div className="container about-perspective-grid">
          <div>
            <p className="eyebrow">Founder Perspective</p>
            <h2 id="about-perspective-title">Software should solve a clear problem.</h2>
            <p>The goal is not to add technology for the sake of technology. Every product should reduce friction, save time, improve visibility, or help a business perform better.</p>
          </div>
          <div className="about-principles" aria-label="AI Guy Labs™ principles">
            {principles.map((principle, index) => (
              <div className="about-principle" key={principle}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell about-products-section" aria-labelledby="about-products-title">
        <div className="container about-products-inner">
          <div>
            <p className="eyebrow">Products Built by AI Guy Labs™</p>
            <h2 id="about-products-title">A focused product ecosystem built from real operational needs.</h2>
          </div>
          <div className="about-product-list" aria-label="AI Guy Labs™ products">
            {aboutProducts.map((product) => (
              <a className="about-product-icon-link" href={product.website} key={product.slug} style={{ '--accent': product.accent }}>
                <span className="about-product-icon-frame" aria-hidden="true">
                  <img src={product.logo} alt="" />
                </span>
                <span className="about-product-icon-name">{product.name}</span>
                <ProductStatusBadge product={product} className="about-product-status" />
              </a>
            ))}
          </div>
          <a className="button button-primary" href="/products">Explore the Products <Icon /></a>
        </div>
      </section>

      <section className="section-shell about-closing-section" aria-labelledby="about-closing-title">
        <div className="container about-closing-inner">
          <h2 id="about-closing-title">Have a problem worth solving?</h2>
          <p>Let's talk about what is slowing your business down and whether software can fix it.</p>
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>
    </main>
  );
}
function ContactPage() {
  const [submitState, setSubmitState] = useState({ status: 'idle', errors: {}, message: '' });

  function validateContactForm(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Name is required.';
    if (!values.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
    if (!values.project_type.trim()) errors.project_type = 'Tell us what you want to build.';
    if (!values.message.trim()) errors.message = 'Message is required.';
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitState.status === 'submitting') return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      project_type: String(formData.get('project_type') || ''),
      budget_range: String(formData.get('budget_range') || ''),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
    };
    const errors = validateContactForm(payload);
    if (Object.keys(errors).length) {
      setSubmitState({ status: 'error', errors, message: 'Please complete the required fields.' });
      return;
    }

    setSubmitState({ status: 'submitting', errors: {}, message: '' });
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        if (response.status === 400 && data.errors) {
          setSubmitState({ status: 'error', errors: data.errors, message: 'Please complete the required fields.' });
          return;
        }
        setSubmitState({ status: 'error', errors: {}, message: 'Unable to send your message right now. Please try again shortly.' });
        return;
      }
      form.reset();
      setSubmitState({ status: 'success', errors: {}, message: '' });
    } catch {
      setSubmitState({ status: 'error', errors: {}, message: 'Unable to send your message right now. Please try again shortly.' });
    }
  }

  const isSubmitting = submitState.status === 'submitting';

  return (
    <main className="contact-page">
      <section className="section-shell contact-hero" aria-labelledby="contact-title">
        <div className="container contact-layout">
          <div className="contact-intro">
            <p className="eyebrow">Contact AI Guy Labs™</p>
            <h1 id="contact-title">LET'S BUILD SOMETHING THAT PERFORMS.</h1>
            <p className="contact-lede">Tell us what you're trying to solve. We'll help turn it into software that works.</p>
            <div className="contact-details" aria-label="Contact details">
              <span className="contact-email">contact@aiguylabs.com</span>
              <span>Custom builds, AI automation, product development.</span>
            </div>
            <div className="contact-expectations">
              <h2>What to expect</h2>
              <p>A focused conversation about the problem, the users, the workflow, and what a successful launch needs to accomplish.</p>
            </div>
          </div>
          {submitState.status === 'success' ? (
            <div className="contact-form form-success" role="status" aria-live="polite">
              <p className="contact-form-note">Custom software. AI automation. Product development.</p>
              <h2>Message sent.</h2>
              <p>We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <p className="contact-form-note">Custom software. AI automation. Product development.</p>
              <input className="contact-honeypot" name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
              {submitState.message ? <p className="form-error">{submitState.message}</p> : null}
              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" aria-invalid={Boolean(submitState.errors.name)} />
                {submitState.errors.name ? <span className="field-error">{submitState.errors.name}</span> : null}
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(submitState.errors.email)} />
                {submitState.errors.email ? <span className="field-error">{submitState.errors.email}</span> : null}
              </label>
              <label>
                <span>Company</span>
                <input name="company" type="text" autoComplete="organization" />
              </label>
              <label>
                <span>What do you want to build?</span>
                <input name="project_type" type="text" aria-invalid={Boolean(submitState.errors.project_type)} />
                {submitState.errors.project_type ? <span className="field-error">{submitState.errors.project_type}</span> : null}
              </label>
              <label>
                <span>Estimated project budget</span>
                <select name="budget_range" defaultValue="">
                  <option value="" disabled>Select a range</option>
                  <option>$5k - $15k</option>
                  <option>$15k - $50k</option>
                  <option>$50k+</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="5" aria-invalid={Boolean(submitState.errors.message)} />
                {submitState.errors.message ? <span className="field-error">{submitState.errors.message}</span> : null}
              </label>
              <button className="button button-primary contact-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Start the Conversation'} <Icon />
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function HotspotBootstrap() {
  useEffect(() => {
    const editMode = new URLSearchParams(window.location.search).get('hotspots') === 'edit';
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const integration = window.AIGuyLabsHotspotIntegration;
      if (integration) {
        if (editMode && typeof integration.activateDeveloperMode === 'function') integration.activateDeveloperMode();
        else if (!editMode && typeof integration.mount === 'function') integration.mount();
        window.clearInterval(timer);
      } else if (attempts > 50) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
function SoftwareEcosystemSection() {
  return (
    <section id="software" className="section-shell software-ecosystem-section" aria-labelledby="software-ecosystem-title">
      <div className="container">
        <ProductShowcase titleId="software-ecosystem-title" />
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main className="home-image-page">
      <section id="home" className="home-image-stage" aria-label="AI Guy Labs™ homepage">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/aiguy_mobile.png" />
          <source media="(min-width: 768px)" srcSet="/images/aiguy_desktop.png" />
          <img id="ai-guy-labs-home-image" className="home-image" src="/images/aiguy_desktop.png" alt="AI Guy Labs™ homepage design." width="1536" height="1024" fetchPriority="high" />
        </picture>
        <p className="home-brand-correction">AI Guy Labs™</p>
        <div
          id="ai-guy-labs-hero-hotspots"
          className="home-hotspot-mount"
          data-hotspot-image-selector="#ai-guy-labs-home-image"
          data-hotspot-image-alt="AI Guy Labs™ homepage design."
          data-hotspot-desktop-image-url="/images/aiguy_desktop.png"
          data-hotspot-mobile-image-url="/images/aiguy_mobile.png"
          data-hotspot-desktop-project-url="/hotspots/aiguy-home-desktop.json"
          data-hotspot-mobile-project-url="/hotspots/aiguy-home-mobile.json"
          data-hotspot-breakpoint="768"
        />
      </section>
      <SoftwareEcosystemSection />
    </main>
  );
}
async function trackMoveScanEngagement(eventName) {
  try {
    const payload = { eventName, sourcePath: '/products/movescan' };
    if (eventName === 'product_page_view' && typeof window !== 'undefined') {
      const pageUrl = new URL(window.location.href);
      const trackingToken = pageUrl.searchParams.get('ms_recipient') || '';
      if (trackingToken) {
        payload.trackingToken = trackingToken;
        pageUrl.searchParams.delete('ms_recipient');
        window.history.replaceState({}, '', pageUrl.pathname + pageUrl.search + pageUrl.hash);
      }
    }
    await fetch(MOVESCAN_OUTREACH_TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
      keepalive: true,
    });
  } catch {
    // Tracking must never interfere with the demo experience.
  }
}

function MoveScanProductPage({ product }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMoveScanSplashVisible, setIsMoveScanSplashVisible] = useState(false);
  const demoCloseRef = useRef(null);
  const demoVideoRef = useRef(null);
  const workflowSteps = [
    {
      title: 'Customer records the move',
      icon: Video,
      image: '/images/scan_kitchen.png',
      description: 'The customer completes a guided room-by-room video walkthrough from their phone.',
    },
    {
      title: 'MoveScan analyzes the inventory',
      icon: ScanLine,
      image: '/images/scanned_items.png',
      description: 'MoveScan identifies the items being moved and estimates total cubic feet.',
    },
    {
      title: 'MoveScan builds the estimate',
      icon: Calculator,
      image: '/images/estimate1.png',
      description: 'MoveScan applies company settings for truck, crew, loading and unloading time, stairs, charges, and estimated total.',
    },
    {
      title: 'Customer gets the estimate instantly',
      icon: FileCheck2,
      image: '/images/instant_estimate.png',
      description: 'The estimate is displayed immediately and a copy is sent to the customer.',
    },
    {
      title: 'Moving company reviews the request',
      icon: ClipboardCheck,
      image: '/images/estimate2.png',
      description: 'Staff can review the inventory, estimate, move details, and Final Quote Requested status from MoveScan.',
    },
  ];

  useEffect(() => {
    void trackMoveScanEngagement('product_page_view');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    try {
      if (window.localStorage.getItem(MOVESCAN_SPLASH_STORAGE_KEY) === '1') return undefined;
      window.localStorage.setItem(MOVESCAN_SPLASH_STORAGE_KEY, '1');
    } catch {
      // If storage is blocked, still show the intro for this page view.
    }

    setIsMoveScanSplashVisible(true);
    const timer = window.setTimeout(() => setIsMoveScanSplashVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isDemoModalOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDemoModalOpen(false);
      }
    };

    document.body.classList.add('movescan-demo-modal-open');
    document.addEventListener('keydown', onKeyDown);
    demoCloseRef.current?.focus();

    const video = demoVideoRef.current;

    if (video) {
      try {
        video.currentTime = 0;
      } catch (error) {
        // Ignore browsers that block seeking before metadata is loaded.
      }

      void video.play().catch(() => {});
    }

    return () => {
      if (video) {
        video.pause();

        try {
          video.currentTime = 0;
        } catch (error) {
          // Ignore browsers that block seeking during teardown.
        }
      }

      document.body.classList.remove('movescan-demo-modal-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isDemoModalOpen]);

  return (
    <main className="product-detail-page movescan-detail-page">
      {isMoveScanSplashVisible ? (
        <div className="movescan-product-splash" aria-hidden="true">
          <div className="movescan-product-splash__brain">
            <img src="/images/icon.png" alt="" />
          </div>
          <div className="movescan-product-splash__brand">
            <p>BROUGHT TO YOU BY</p>
            <img src="/images/aiguy_logo.PNG" alt="" />
          </div>
        </div>
      ) : null}
      <section className="section-shell product-detail-hero product-detail-hero--after-showcase" aria-label="MoveScan product hero">
        <div className="container product-detail-hero-inner movescan-hero-inner" style={{ '--accent': product.accent }}>
          <div className="movescan-hero-visual">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/landing_page_mobile.png?v=2f7ea73" />
              <img src="/images/landing_page_desktop.png?v=2f7ea73" alt="MoveScan moving estimate platform" />
            </picture>
          </div>
          <div className="product-detail-actions movescan-hero-actions">
            <a className="button button-primary" href={MOVESCAN_FREE_TRIAL_URL}>Start Free Trial <Icon /></a>
            <button className="button button-secondary movescan-demo-cta" type="button" onClick={() => { void trackMoveScanEngagement('demo_click'); void trackMoveScanEngagement('demo_opened'); setIsDemoModalOpen(true); }}><Play aria-hidden="true" size={17} strokeWidth={2.2} /> <span>See It in Action</span></button>
          </div>
        </div>
      </section>

      <section className="section-shell product-detail-story movescan-workflow-section" aria-labelledby="movescan-workflow-title">
        <div className="container movescan-workflow-inner">
          <div className="movescan-section-heading">
            <p className="eyebrow">Workflow</p>
            <h2 id="movescan-workflow-title">How MoveScan works</h2>
          </div>
          <div className="movescan-workflow-grid">
            {workflowSteps.map((step) => (
              <article className="movescan-workflow-card" key={step.title}>
                <div className="movescan-workflow-card-heading">
                  <span aria-hidden="true"><step.icon size={19} strokeWidth={1.8} /></span>
                  <h3>{step.title}</h3>
                </div>
                <img className='movescan-workflow-card-image' src={step.image} alt={step.title + ' screenshot'} />
                <p>{step.description}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="section-shell movescan-explainer-section" aria-labelledby="movescan-explainer-title">
        <div className="container movescan-explainer-inner">
          <div className="movescan-section-heading movescan-explainer-heading">
            <p className="eyebrow">What Is MoveScan?</p>
            <h2 id="movescan-explainer-title">How MoveScan Works</h2>
            <p>MoveScan turns the customer's phone into a guided, mostly tap-driven estimate walkthrough.</p>
            <p>Instead of asking the customer to type out a long furniture list, guess from memory, or explain the whole move over the phone, MoveScan guides them through simple choices: tap, select, record, review, and confirm.</p>
            <p>They still enter basic information where text is truly needed, such as contact details, ZIP codes, notes, or corrections. But the main experience is built around quick selections and short room recordings, not a traditional online form.</p>
          </div>

          <div className="movescan-explainer-step-list" aria-label="How MoveScan works from customer walkthrough to company review">
            <article className="movescan-explainer-step">
              <span>1</span>
              <div>
                <h3>The customer starts from their phone</h3>
                <p>The customer taps your Get Instant Estimate button or opens a MoveScan invitation link from your company. MoveScan opens in the customer's mobile browser, so they do not need to download an app.</p>
                <p>From there, the customer is guided through the estimate with buttons, selections, and short prompts instead of being dropped into a blank form and asked to describe the whole job from scratch.</p>
                <p><strong>Why this helps your company:</strong> The estimate starts while the customer is already interested. You are not waiting on a long first phone call, a callback, or a scheduled in-home visit just to collect basic move details.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>2</span>
              <div>
                <h3>The customer chooses the type of job</h3>
                <p>The customer selects the service they need, such as Full Move, Loading Only, Unloading Only, Packing Only, Packing + Loading, or a supported storage workflow.</p>
                <p>MoveScan asks follow-up questions based on that service type. A full move, a loading-only job, a packing job, and a storage job do not all need the same questions, so the walkthrough adjusts to the job.</p>
                <p>Most of these choices are taps or selections, which keeps the customer moving instead of forcing them to write a custom explanation for every scenario.</p>
                <p><strong>Why this helps your company:</strong> Your staff gets cleaner information because the customer is not forced through questions that do not apply to their job.</p>
              </div>
            </article>

            <article className="movescan-explainer-step movescan-explainer-step--wide">
              <span>3</span>
              <div>
                <h3>The customer enters the important move details</h3>
                <p>Depending on the service, the customer provides the details that shape the estimate. Many of these are selected from guided choices, while contact information, ZIP codes, and notes use normal text fields when needed:</p>
                <ul className="movescan-explainer-detail-list">
                  <li>Name, email, phone number, and service ZIP codes</li>
                  <li>Pickup and/or delivery location details</li>
                  <li>Property type, such as house, apartment, condo, townhouse, storage unit, commercial, or other</li>
                  <li>Floor number, stair flights, elevator access, parking restrictions, narrow access, shuttle needs, and notes</li>
                  <li>Truck information, such as customer-provided truck size, company-provided truck, or no truck yet</li>
                  <li>Storage source, container or storage unit size, and how full it is when that applies</li>
                  <li>Specialty or heavy items, such as a piano, safe, oversized furniture, exercise equipment, pool table, or another heavy item</li>
                </ul>
                <p><strong>Why this helps your company:</strong> These are the details that usually create surprise labor time later. MoveScan collects them up front with a guided flow, so the estimate is based on more than two bedrooms and a couch without making the customer write a long explanation.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>4</span>
              <div>
                <h3>The customer sets up the rooms or packing areas</h3>
                <p>For moving services, MoveScan builds a room-by-room walkthrough. The customer taps the rooms or areas involved, such as bedrooms, bathrooms, living room, kitchen, dining room, garage, basement, attic, office, laundry, storage room, and other rooms.</p>
                <p>For Packing Only, the customer selects the areas they want packed and can add custom packing areas when needed.</p>
                <p><strong>Why this helps your company:</strong> Instead of one long, messy video or a vague written list, the job is organized by room through simple customer choices. That makes the inventory easier to review and easier to price.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>5</span>
              <div>
                <h3>The customer records each room with their phone</h3>
                <p>For each room or packing area, the customer taps the room, taps record, allows camera access, and uses the back camera to show the space. They can also upload an existing video when needed.</p>
                <p>They walk slowly and show the items and contents that matter for the estimate, such as furniture, boxes, shelves, closets, wall-mounted items, large items, delicate items, and visible packing contents.</p>
                <p>When they are done, they stop recording, review the video, and choose Use this video. They can retake the video, skip a room, rename a room, add another room, or remove a customer-added room when the workflow allows it.</p>
                <p><strong>Why this helps your company:</strong> The customer is not trying to remember every item from memory or manually build a furniture list. MoveScan gets room-by-room information from the actual space.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>6</span>
              <div>
                <h3>MoveScan reviews each room recording</h3>
                <p>After a room video is submitted, MoveScan processes that room and identifies inventory and packing details from the recording.</p>
                <p>The customer can keep going while another room is being reviewed. As each room becomes ready, MoveScan asks the customer to check what was found.</p>
                <p><strong>Why this helps your company:</strong> Your team does not have to manually pause a video and type every item from scratch before an estimate can be started. MoveScan turns the room recording into organized review data.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>7</span>
              <div>
                <h3>The customer checks the room results</h3>
                <p>The customer reviews the rooms and the inventory MoveScan found. Much of this review is tap-driven: they confirm items, answer questions, mark whether something is moving, and continue through the flow.</p>
                <p>When something truly needs correction, they can still edit item names, adjust quantities, change categories, add notes, mark items that need disassembly, remove items, or add missing items.</p>
                <p>If MoveScan finds something that needs confirmation, such as whether an appliance is moving or staying, the customer answers that directly.</p>
                <p>For packing workflows, the customer can review packing contents, visible quantities, hidden or customer-declared contents, categories, notes, and packing details.</p>
                <p><strong>Why this helps your company:</strong> The customer helps clean up the estimate before it reaches your staff, mostly by reviewing and confirming what MoveScan found. That reduces back-and-forth and gives your team a stronger starting point than a phone note or rough checklist.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>8</span>
              <div>
                <h3>MoveScan combines the rooms into the full job</h3>
                <p>After the customer reviews the rooms, MoveScan combines the accepted room results into one overall move or packing estimate.</p>
                <p>It uses the rooms, inventory, packing details, access details, storage information, specialty items, and truck information together.</p>
                <p><strong>Why this helps your company:</strong> The estimate is based on the whole job, not disconnected pieces of information. Room inventory, stairs, access problems, storage fullness, and truck needs are considered together.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>9</span>
              <div>
                <h3>MoveScan uses your company's own saved settings</h3>
                <p>MoveScan does not price every mover the same way.</p>
                <p>It uses the moving company's saved settings, such as labor pricing, minimums, productivity settings, access adjustments, stair settings, truck capacity settings, truck pricing, tax rate, packing material preferences, packing prices, and instant-estimate limits.</p>
                <p><strong>Why this helps your company:</strong> The estimate reflects how your company actually charges and operates. MoveScan is not just giving a generic online quote; it is applying your company's own estimate settings.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>10</span>
              <div>
                <h3>Truck and crew recommendations are added where applicable</h3>
                <p>For moving and loading workflows, MoveScan uses the estimated inventory size and the customer's truck selection to show the appropriate truck information.</p>
                <p>If the customer provides their own truck, MoveScan can show that truck size without adding a company truck charge. If the customer needs the moving company to provide the truck, MoveScan can use the configured company truck pricing. If the customer does not have a truck yet, MoveScan can recommend a truck size without including a truck quote.</p>
                <p>MoveScan also recommends a crew size based on the move details.</p>
                <p><strong>Why this helps your company:</strong> Truck and crew planning are two of the biggest parts of a moving estimate. MoveScan helps set expectations early while preserving your company's pricing rules.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>11</span>
              <div>
                <h3>The customer receives an instant estimate</h3>
                <p>When instant estimates are enabled and the walkthrough is complete, the customer submits their information and sees their estimate.</p>
                <p>The estimate can include the estimated inventory size, item count, truck information, recommended crew, line-item estimate details, subtotal, taxes, and estimated total. The customer can also receive the estimate by email.</p>
                <p>The estimate explains that the moving company may review it before confirming the final quote.</p>
                <p><strong>Why this helps your company:</strong> The customer gets a fast answer while the lead is still warm, and your company still has the ability to review the estimate before treating it as final.</p>
              </div>
            </article>

            <article className="movescan-explainer-step">
              <span>12</span>
              <div>
                <h3>The moving company receives the estimate for review</h3>
                <p>Your company receives the completed MoveScan estimate and can review it inside the staff dashboard.</p>
                <p>Staff can see the customer, service type, estimated total, submitted estimate information, inventory, truck and crew recommendation, and related estimate details. From there, the company can review, adjust where appropriate, approve, and follow up with the customer.</p>
                <p><strong>Why this helps your company:</strong> Your staff starts with a structured estimate instead of a blank page. The customer has already provided room inventory, move details, access information, truck information, and contact details, which can save time compared with traditional phone estimating or scheduling an in-home estimate for every lead.</p>
              </div>
            </article>
          </div>

          <div className="movescan-explainer-summary">
            <p>MoveScan does not just digitize the old estimate form. It changes how the customer provides the information in the first place: tap, select, record, review, and confirm, with typing reserved for the details that actually need it.</p>
            <p>MoveScan gives customers a simple guided walkthrough and gives moving companies a clearer estimate file to work from. The result is less guessing, less manual list-building, and a faster path from interested customer to usable estimate.</p>
            <p>It does not remove your team's judgment. It helps collect and organize the job so your company can review the estimate with more context and less back-and-forth.</p>
          </div>
        </div>
      </section>

      <section className="section-shell movescan-integration-section" aria-labelledby="movescan-integration-title">
        <div className="container movescan-integration-inner">
          <div className="movescan-section-heading">
            <p className="eyebrow">Website Integration</p>
            <h2 id="movescan-integration-title">Add MoveScan to your website</h2>
          </div>
          <div className="movescan-integration-visual">
            <img src="/images/getinstantestimatelink.png" alt="MoveScan Get Instant Estimate website button" />
          </div>
          <p className="movescan-integration-description">Give customers a Get Instant Estimate button that launches your company-specific MoveScan experience. Your pricing, truck settings, crew rules, and estimate settings stay connected to your account.</p>
          <ul className="movescan-feature-list" aria-label="MoveScan company setup includes">
            <li>Company-specific MoveScan estimate link</li>
            <li>Website button code</li>
            <li>Staff/admin dashboard</li>
            <li>Company-specific pricing and settings</li>
          </ul>
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="movescan-closing-title">
        <div className="container product-detail-closing-inner movescan-closing-inner">
          <p className="eyebrow">Free Trial</p>
          <h2 id="movescan-closing-title">Try MoveScan with your first five estimates free.</h2>
          <p>Request trial access and AI Guy Labs™ will provision your moving-company account for the current MoveScan onboarding flow.</p>
          <div className="product-detail-actions movescan-closing-actions">
            <a className="button button-primary" href={MOVESCAN_FREE_TRIAL_URL}>Start Free Trial <Icon /></a>
            <a className="button button-secondary" href={MOVESCAN_LOGIN_URL} target="_blank" rel="noopener noreferrer">Sign In to MoveScan <Icon /></a>
          </div>
        </div>
      </section>

      {isDemoModalOpen ? (
        <div className="movescan-demo-modal" role="dialog" aria-modal="true" aria-label="MoveScan demo video" onClick={() => setIsDemoModalOpen(false)}>
          <div className="movescan-demo-modal__backdrop" aria-hidden="true" />
          <div className="movescan-demo-modal__dialog" onClick={(event) => event.stopPropagation()}>
            <button ref={demoCloseRef} className="movescan-demo-modal__close" type="button" onClick={() => setIsDemoModalOpen(false)}>Close</button>
            <div className="movescan-demo-modal__frame">
              {MOVESCAN_DEMO_VIDEO_URL ? (
                <video ref={demoVideoRef} controls playsInline preload="metadata" src={MOVESCAN_DEMO_VIDEO_URL}
                onPlay={() => { void trackMoveScanEngagement('video_started'); }}
                onTimeUpdate={(event) => { const video = event.currentTarget; if (!Number.isFinite(video.duration) || video.duration <= 0) return; const progress = video.currentTime / video.duration; if (progress >= 0.25) void trackMoveScanEngagement('video_25_watched'); if (progress >= 0.5) void trackMoveScanEngagement('video_50_watched'); }}
                onEnded={() => { void trackMoveScanEngagement('video_completed'); }} />
              ) : (
                <div className="movescan-demo-modal__placeholder">
                  <p>Set <code>VITE_MOVESCAN_DEMO_VIDEO_URL</code> to your Cloudflare R2 public MP4 URL to enable the demo video.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

    </main>
  );
}
function MoveScanDemoPage() {
  return (
    <main className="movescan-demo-page" aria-label="Live MoveScan Demo">
      <div className="movescan-demo-chrome">
        <a className="movescan-demo-back" href="/products/movescan">Back to AI Guy Labs™</a>
        <div className="movescan-demo-actions">
          <a className="movescan-demo-open" href={MOVESCAN_LOGIN_URL} target="_blank" rel="noopener noreferrer">Sign In to MoveScan</a>
          <span className="movescan-demo-label">Live MoveScan Demo</span>
        </div>
      </div>
      <iframe
        className="movescan-demo-frame"
        src={MOVESCAN_DEMO_URL}
        title="MoveScan live instant quote demo"
        width="100%"
        height="100%"
        loading="eager"
        allow="clipboard-write; payment"
      />
    </main>
  );
}function BatchFlowProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(null);
  const featured = batchflowScreenshots[0];
  const supporting = batchflowScreenshots.slice(1);

  return (
    <main className="product-detail-page batchflow-detail-page">
      <section className="section-shell product-detail-hero" aria-labelledby="batchflow-product-title">
        <div className="container product-detail-hero-inner" style={{ '--accent': product.accent }}>
          <div className="product-detail-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <img src={product.logo} alt="BatchFlow product icon." className="product-detail-logo" />
            <h1 id="batchflow-product-title">BatchFlow</h1>
            <p className="product-detail-subheading">Production workflow automation</p>
            <p>BatchFlow helps production teams plan batches, guide operators through station work, and keep daily workflow moving with fewer handoffs and less confusion.</p>
            <div className="product-detail-actions">
              <a className="button button-primary" href="/contact">Start a BatchFlow Project <Icon /></a>
              <a className="button button-secondary" href="/products">Back to Products</a>
            </div>
          </div>
          <button className="product-screenshot-button product-screenshot-button--featured" type="button" onClick={() => setActiveImage(featured)}>
            <img src={featured.src} alt={featured.alt} />
          </button>
        </div>
      </section>

      <section className="section-shell product-detail-story" aria-labelledby="batchflow-story-title">
        <div className="container product-detail-story-inner">
          <div>
            <p className="eyebrow">Workflow</p>
            <h2 id="batchflow-story-title">Built for repeatable production without operational drag.</h2>
          </div>
          <p>BatchFlow connects planning, prep, station execution, and manager review into one focused production workflow for teams that need consistency every day.</p>
        </div>
      </section>

      <section className="section-shell product-screenshot-section" aria-label="BatchFlow product screenshots">
        <div className="container product-screenshot-list">
          {supporting.map((screenshot, index) => (
            <article className={index % 2 === 0 ? 'product-screenshot-panel' : 'product-screenshot-panel product-screenshot-panel--reverse'} key={screenshot.src}>
              <div className="product-screenshot-copy">
                <p className="eyebrow">{String(index + 2).padStart(2, '0')}</p>
                <h2>{screenshot.title}</h2>
                <p>{screenshot.description}</p>
              </div>
              <button className="product-screenshot-button" type="button" onClick={() => setActiveImage(screenshot)}>
                <img src={screenshot.src} alt={screenshot.alt} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="batchflow-closing-title">
        <div className="container product-detail-closing-inner">
          <h2 id="batchflow-closing-title">Need production work to move with less friction?</h2>
          <p>Use BatchFlow as the model for workflow software that gives operators clarity and managers better control.</p>
          <ProductValuation product={product} />
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>

      {activeImage ? (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="product-lightbox-close" type="button" onClick={() => setActiveImage(null)}>Close</button>
          <img src={activeImage.src} alt={activeImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
function SizzleProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(null);
  const featured = sizzleScreenshots[0];
  const supporting = sizzleScreenshots.slice(1);

  return (
    <main className="product-detail-page sizzle-detail-page">
      <section className="section-shell product-detail-hero" aria-labelledby="sizzle-product-title">
        <div className="container product-detail-hero-inner" style={{ '--accent': product.accent }}>
          <div className="product-detail-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <img src={product.logo} alt="Sizzle product icon." className="product-detail-logo" />
            <h1 id="sizzle-product-title">Sizzle</h1>
            <p className="product-detail-subheading">Interactive live cooking platform</p>
            <p>Sizzle brings hosts and viewers into the same live cooking experience with synchronized steps, timers, chat, reactions, and cook-along participation.</p>
            <div className="product-detail-actions">
              <a className="button button-primary" href="/contact">Start a Sizzle Project <Icon /></a>
              <a className="button button-secondary" href="/products">Back to Products</a>
            </div>
          </div>
          <button className="product-screenshot-button product-screenshot-button--featured" type="button" onClick={() => setActiveImage(featured)}>
            <img src={featured.src} alt={featured.alt} />
          </button>
        </div>
      </section>

      <section className="section-shell product-detail-story" aria-labelledby="sizzle-story-title">
        <div className="container product-detail-story-inner">
          <div>
            <p className="eyebrow">Live Experience</p>
            <h2 id="sizzle-story-title">Built for participation, not passive viewing.</h2>
          </div>
          <p>Sizzle turns live cooking into a guided shared room where hosts can teach in real time and viewers can keep pace from their own kitchens.</p>
        </div>
      </section>

      <section className="section-shell product-screenshot-section" aria-label="Sizzle product screenshots">
        <div className="container product-screenshot-list">
          {supporting.map((screenshot, index) => (
            <article className={index % 2 === 0 ? 'product-screenshot-panel' : 'product-screenshot-panel product-screenshot-panel--reverse'} key={screenshot.src}>
              <div className="product-screenshot-copy">
                <p className="eyebrow">{String(index + 2).padStart(2, '0')}</p>
                <h2>{screenshot.title}</h2>
                <p>{screenshot.description}</p>
              </div>
              <button className="product-screenshot-button" type="button" onClick={() => setActiveImage(screenshot)}>
                <img src={screenshot.src} alt={screenshot.alt} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="sizzle-closing-title">
        <div className="container product-detail-closing-inner">
          <h2 id="sizzle-closing-title">Want a live experience people can actually follow?</h2>
          <p>Use Sizzle as the model for interactive media software where timing, participation, and content all work together.</p>
          <ProductValuation product={product} />
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>

      {activeImage ? (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="product-lightbox-close" type="button" onClick={() => setActiveImage(null)}>Close</button>
          <img src={activeImage.src} alt={activeImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
function SwiftSaleProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(null);
  const featured = swiftsaleScreenshots[0];
  const supporting = swiftsaleScreenshots.slice(1);

  return (
    <main className="product-detail-page swiftsale-detail-page">
      <section className="section-shell product-detail-hero" aria-labelledby="swiftsale-product-title">
        <div className="container product-detail-hero-inner" style={{ '--accent': product.accent }}>
          <div className="product-detail-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <img src={product.logo} alt="SwiftSale product icon." className="product-detail-logo" />
            <h1 id="swiftsale-product-title">SwiftSale</h1>
            <p className="product-detail-subheading">Live selling workflow automation</p>
            <p>SwiftSale helps live sellers organize claims, assign bins, streamline pickup, and keep fulfillment moving while the sale is still live.</p>
            <div className="product-detail-actions">
              <a className="button button-primary" href="/contact">Start a SwiftSale Project <Icon /></a>
              <a className="button button-secondary" href="/products">Back to Products</a>
            </div>
          </div>
          <button className="product-screenshot-button product-screenshot-button--featured" type="button" onClick={() => setActiveImage(featured)}>
            <img src={featured.src} alt={featured.alt} />
          </button>
        </div>
      </section>

      <section className="section-shell product-detail-story" aria-labelledby="swiftsale-story-title">
        <div className="container product-detail-story-inner">
          <div>
            <p className="eyebrow">Live Selling</p>
            <h2 id="swiftsale-story-title">Built for sellers who move fast in front of a live audience.</h2>
          </div>
          <p>SwiftSale turns the live selling process into a cleaner workflow where product claims, bins, buyer activity, and fulfillment details stay connected.</p>
        </div>
      </section>

      <section className="section-shell product-screenshot-section" aria-label="SwiftSale product screenshots">
        <div className="container product-screenshot-list">
          {supporting.map((screenshot, index) => (
            <article className={index % 2 === 0 ? 'product-screenshot-panel' : 'product-screenshot-panel product-screenshot-panel--reverse'} key={screenshot.src}>
              <div className="product-screenshot-copy">
                <p className="eyebrow">{String(index + 2).padStart(2, '0')}</p>
                <h2>{screenshot.title}</h2>
                <p>{screenshot.description}</p>
              </div>
              <button className="product-screenshot-button" type="button" onClick={() => setActiveImage(screenshot)}>
                <img src={screenshot.src} alt={screenshot.alt} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="swiftsale-closing-title">
        <div className="container product-detail-closing-inner">
          <h2 id="swiftsale-closing-title">Ready to make live selling easier to run?</h2>
          <p>Use SwiftSale as the model for operational software that keeps sales, customers, and fulfillment in sync.</p>
          <ProductValuation product={product} />
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>

      {activeImage ? (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="product-lightbox-close" type="button" onClick={() => setActiveImage(null)}>Close</button>
          <img src={activeImage.src} alt={activeImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
function HotspotStudioProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(null);
  const featured = hotspotStudioScreenshots[0];
  const supporting = hotspotStudioScreenshots.slice(1);

  return (
    <main className="product-detail-page hotspot-studio-detail-page">
      <section className="section-shell product-detail-hero" aria-labelledby="hotspot-studio-product-title">
        <div className="container product-detail-hero-inner" style={{ '--accent': product.accent }}>
          <div className="product-detail-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <img src={product.logo} alt="Hotspot Studio product icon." className="product-detail-logo" />
            <h1 id="hotspot-studio-product-title">Hotspot Studio</h1>
            <p className="product-detail-subheading">Turn any image into an interactive experience</p>
            <p>Hotspot Studio lets teams build interactive image maps, define clickable areas, preview experiences, and export clean project data for production use.</p>
            <div className="product-detail-actions">
              <a className="button button-primary" href="/contact">Start a Hotspot Studio Project <Icon /></a>
              <a className="button button-secondary" href="/products">Back to Products</a>
            </div>
          </div>
          <button className="product-screenshot-button product-screenshot-button--featured" type="button" onClick={() => setActiveImage(featured)}>
            <img src={featured.src} alt={featured.alt} />
          </button>
        </div>
      </section>

      <section className="section-shell product-detail-story" aria-labelledby="hotspot-studio-story-title">
        <div className="container product-detail-story-inner">
          <div>
            <p className="eyebrow">Interactive Media</p>
            <h2 id="hotspot-studio-story-title">Built for visual experiences that need structure.</h2>
          </div>
          <p>Hotspot Studio turns image-based ideas into practical interactive systems by combining visual editing, preview, and reusable structured output.</p>
        </div>
      </section>

      <section className="section-shell product-screenshot-section" aria-label="Hotspot Studio product screenshots">
        <div className="container product-screenshot-list">
          {supporting.map((screenshot, index) => (
            <article className={index % 2 === 0 ? 'product-screenshot-panel' : 'product-screenshot-panel product-screenshot-panel--reverse'} key={screenshot.src}>
              <div className="product-screenshot-copy">
                <p className="eyebrow">{String(index + 2).padStart(2, '0')}</p>
                <h2>{screenshot.title}</h2>
                <p>{screenshot.description}</p>
              </div>
              <button className="product-screenshot-button" type="button" onClick={() => setActiveImage(screenshot)}>
                <img src={screenshot.src} alt={screenshot.alt} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="hotspot-studio-closing-title">
        <div className="container product-detail-closing-inner">
          <h2 id="hotspot-studio-closing-title">Need visuals people can interact with?</h2>
          <p>Use Hotspot Studio as the model for turning product images, diagrams, maps, and experiences into interactive web content.</p>
          <ProductValuation product={product} />
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>

      {activeImage ? (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="product-lightbox-close" type="button" onClick={() => setActiveImage(null)}>Close</button>
          <img src={activeImage.src} alt={activeImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
function PulsarProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(null);
  const featured = pulsarScreenshots[0];
  const supporting = pulsarScreenshots.slice(1);

  function getResponsivePulsarImage(screenshot) {
    if (!screenshot.mobileSrc || typeof window === 'undefined') return screenshot;
    const useMobile = window.matchMedia('(max-width: 767px)').matches;
    return {
      ...screenshot,
      src: useMobile ? screenshot.mobileSrc : screenshot.desktopSrc,
      alt: useMobile ? screenshot.mobileAlt : screenshot.alt,
    };
  }

  return (
    <main className="product-detail-page pulsar-detail-page">
      <section className="section-shell product-showcase-hero" aria-label="Pulsar product preview">
        <div className="container product-showcase-inner">
          <button className="product-screenshot-button product-screenshot-button--featured product-featured-shot" type="button" onClick={() => setActiveImage(getResponsivePulsarImage(featured))}>
            <picture>
              <source media="(max-width: 767px)" srcSet={featured.mobileSrc} />
              <source media="(min-width: 768px)" srcSet={featured.desktopSrc} />
              <img src={featured.desktopSrc} alt={featured.alt} sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1440px) calc(100vw - 72px), 1320px" fetchPriority="high" />
            </picture>
          </button>
        </div>
      </section>

      <section className="section-shell product-detail-hero product-detail-hero--after-showcase" aria-labelledby="pulsar-product-title">
        <div className="container product-detail-hero-inner product-detail-hero-inner--copy-only" style={{ '--accent': product.accent }}>
          <div className="product-detail-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <img src={product.logo} alt="Pulsar product icon." className="product-detail-logo" />
            <h1 id="pulsar-product-title">Pulsar</h1>
            <p className="product-detail-subheading">Live audience engagement platform</p>
            <p>Pulsar helps brands, creators, and hosts turn live audiences into active participants with real-time prompts, reactions, games, and synchronized engagement flows.</p>
            <div className="product-detail-actions">
              <a className="button button-primary" href="/contact">Start a Pulsar Project <Icon /></a>
              <a className="button button-secondary" href="/products">Back to Products</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell product-detail-story" aria-labelledby="pulsar-story-title">
        <div className="container product-detail-story-inner">
          <div>
            <p className="eyebrow">Live Engagement</p>
            <h2 id="pulsar-story-title">Built for audiences that need to participate, not just watch.</h2>
          </div>
          <p>Pulsar gives live teams a structured way to launch audience moments, keep sessions synchronized, and make engagement feel intentional from host control to viewer response.</p>
        </div>
      </section>

      <section className="section-shell product-screenshot-section" aria-label="Pulsar product screenshots">
        <div className="container product-screenshot-list">
          {supporting.map((screenshot, index) => (
            <article className={index % 2 === 0 ? 'product-screenshot-panel' : 'product-screenshot-panel product-screenshot-panel--reverse'} key={screenshot.src}>
              <div className="product-screenshot-copy">
                <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
                <h2>{screenshot.title}</h2>
                <p>{screenshot.description}</p>
              </div>
              <button className="product-screenshot-button" type="button" onClick={() => setActiveImage(screenshot)}>
                <img src={screenshot.src} alt={screenshot.alt} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell product-detail-closing" aria-labelledby="pulsar-closing-title">
        <div className="container product-detail-closing-inner">
          <h2 id="pulsar-closing-title">Need a live audience to respond in real time?</h2>
          <p>Use Pulsar as the foundation for interactive events, brand activations, live shows, classrooms, and synchronized audience experiences.</p>
          <ProductValuation product={product} />
          <a className="button button-primary" href="/contact">Start the Conversation <Icon /></a>
        </div>
      </section>

      {activeImage ? (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="product-lightbox-close" type="button" onClick={() => setActiveImage(null)}>Close</button>
          <img src={activeImage.src} alt={activeImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
function PostcardRedirectPage() {
  useEffect(() => {
    const payload = {
      eventName: 'postcard_scan',
      campaign: 'movescan_local_launch',
      sourcePath: '/go/movescan-postcard',
      destinationPath: MOVESCAN_POSTCARD_REDIRECT_URL,
      utmSource: 'postcard',
      utmMedium: 'direct_mail',
      utmCampaign: 'movescan_local_launch',
      metadata: {
        source: 'postcard',
        medium: 'direct_mail',
        campaignLabel: 'MoveScan local launch',
      },
    };
    const body = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(MOVESCAN_POSTCARD_TRACKING_ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      void fetch(MOVESCAN_POSTCARD_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }

    window.location.replace(MOVESCAN_POSTCARD_REDIRECT_URL);
  }, []);

  return null;
}

function ProductPlaceholder({ product }) {
  if (product?.slug === 'movescan') return <MoveScanProductPage product={product} />;
  if (product?.slug === 'batchflow') return <BatchFlowProductPage product={product} />;
  if (product?.slug === 'sizzle') return <SizzleProductPage product={product} />;
  if (product?.slug === 'swiftsale') return <SwiftSaleProductPage product={product} />;
  if (product?.slug === 'hotspot-studio') return <HotspotStudioProductPage product={product} />;
  if (product?.slug === 'pulsar') return <PulsarProductPage product={product} />;

  if (!product) {
    return (
      <main className="product-placeholder-page">
        <section className="section-shell product-placeholder-hero" aria-labelledby="product-not-found-title">
          <div className="container product-placeholder-inner">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <h1 id="product-not-found-title">Product not found.</h1>
            <p>The product page you requested is not available.</p>
            <a className="button button-primary" href="/products">Back to Products <Icon /></a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="product-placeholder-page">
      <section className="section-shell product-placeholder-hero" aria-labelledby="product-placeholder-title">
        <div className="container product-placeholder-inner" style={{ '--accent': product.accent }}>
          <div className="product-placeholder-copy">
            <p className="eyebrow">AI Guy Labs™ Product</p>
            <h1 id="product-placeholder-title">{product.name}</h1>
            <p className="product-placeholder-subheading">{product.tagline}</p>
            <ProductStatusBadge product={product} className="product-placeholder-status" />
            {product.slug === 'saasquatch' ? (
              <>
                <div className="product-development-message">
                  <h2>Currently in Development</h2>
                  <p>SaaSquatch is the newest AI Guy Labs™ product. We're actively designing and building the platform. More information, previews, and early access details will be available as development progresses.</p>
                </div>
                <ProductValuation product={product} />
              </>
            ) : (
              <p className="product-placeholder-message">The full {product.name} product page is coming soon.</p>
            )}
            <a className="button button-primary" href="/products">Back to Products <Icon /></a>
          </div>
          <div className="product-placeholder-icon" aria-hidden="true">
            <img src={product.logo} alt="" />
          </div>
        </div>
      </section>
    </main>
  );
}
const leadStatuses = ['New', 'Contacted', 'Discovery Scheduled', 'Proposal Sent', 'Won', 'Lost', 'Closed'];

function formatLeadDate(value) {
  if (!value) return '?';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function formatCampaignDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value + 'T00:00:00.000Z'));
}

function formatCampaignTimestamp(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function getDefaultCampaignRange() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 29);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
}

function getAllTimeCampaignRange() {
  const end = new Date();
  return { from: '1970-01-01', to: end.toISOString().slice(0, 10) };
}

const outreachSortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'opened', label: 'Opened first' },
  { value: 'productPage', label: 'Product Page first' },
  { value: 'demo', label: 'Demo activity first' },
  { value: 'sent', label: 'Newest sent' },
];

function getOutreachSortTimestamp(recipient, sortKey) {
  if (sortKey === 'opened') return recipient.dates?.opened || '';
  if (sortKey === 'productPage') return recipient.dates?.productPage || '';
  if (sortKey === 'sent') return recipient.sentAt || recipient.dates?.sent || '';
  if (sortKey === 'demo') {
    return [
      recipient.demoEngagement?.completed,
      recipient.demoEngagement?.watched50,
      recipient.demoEngagement?.watched25,
      recipient.demoEngagement?.started,
      recipient.demoEngagement?.opened,
      recipient.dates?.demo,
    ].filter(Boolean).sort().at(-1) || '';
  }
  return '';
}

function sortOutreachRecipients(recipients, sortKey) {
  if (sortKey === 'default') return recipients;
  return recipients
    .map((recipient, index) => ({ recipient, index, timestamp: getOutreachSortTimestamp(recipient, sortKey) }))
    .sort((a, b) => {
      const aHasTimestamp = Boolean(a.timestamp);
      const bHasTimestamp = Boolean(b.timestamp);
      if (aHasTimestamp !== bHasTimestamp) return aHasTimestamp ? -1 : 1;
      if (a.timestamp !== b.timestamp) return b.timestamp.localeCompare(a.timestamp);
      return a.index - b.index;
    })
    .map(({ recipient }) => recipient);
}

const deliveryStatusLabels = {
  delivered: 'Delivered',
  failed: 'Delivery Failed',
  bounced: 'Bounced',
  rejected: 'Rejected',
  deferred: 'Deferred',
  complained: 'Complaint',
  doesnt_exist: "Doesn't Exist",
};

function getDeliveryStatusLabel(status) {
  return deliveryStatusLabels[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');
}

function canRetryDelivery(status) {
  return ['failed', 'bounced', 'rejected', 'deferred'].includes(status);
}

function getRecipientStatusClass(recipient) {
  const deliveryStatus = recipient.delivery?.status;
  if (deliveryStatus && deliveryStatus !== 'pending') return 'is-delivery-' + deliveryStatus;
  if (recipient.hotLead) return 'is-hot-lead';
  if (recipient.lead) return 'is-lead';
  if (recipient.funnel?.demo) return 'is-demo';
  if (recipient.funnel?.productPage) return 'is-product-page';
  if (recipient.funnel?.opened) return 'is-opened';
  if (recipient.funnel?.sent) return 'is-sent';
  return '';
}

function getRecipientStatusLabel(recipient) {
  const deliveryStatus = recipient.delivery?.status;
  if (deliveryStatus && deliveryStatus !== 'pending') return getDeliveryStatusLabel(deliveryStatus);
  if (recipient.hotLead) return 'Hot Lead';
  if (recipient.lead) return 'Lead';
  if (recipient.funnel?.demo) return 'Demo';
  if (recipient.funnel?.productPage) return 'Product Page';
  if (recipient.funnel?.opened) return 'Opened';
  if (recipient.funnel?.sent) return 'Sent';
  return 'Not Sent';
}

const DEFAULT_MOVESCAN_OUTREACH_SUBJECT = 'Early MoveScan Network Opportunity';
const DEFAULT_MOVESCAN_OUTREACH_BODY = `Hi, I’m Mike. I’m an actual mover here in Nashville and an independent full-stack software developer. I operate AI Guy Labs, where I build software around real-world problems I encounter firsthand.

A lot of moving companies are still asking customers for furniture lists, stairs, pickup and delivery details, truck information, and other move details just to figure out a price.

That process made sense years ago.

Today, customers are used to doing almost everything from their phones with a few swipes and taps. They don’t want to sit there typing out every couch, bed, dresser, TV, box, and table they own — and they definitely shouldn’t have to guess what size moving truck they need.

And when nearly every moving company uses the same slow quote process, customers start looking for easier alternatives — including third-party marketplaces that promise a faster, simpler way to book moving help, often at the moving company’s expense through fees, commissions, and tighter control over how the job is priced or handled.

MoveScan gives independent moving companies a way to offer that same kind of convenience directly, without sending the customer somewhere else first.

The customer opens your MoveScan estimate link on their phone and completes a short, guided room-by-room walkthrough. MoveScan identifies the inventory, calculates estimated cubic feet, determines truck and crew needs, accounts for the move details, applies your company’s own pricing and operating rules, and produces the customer’s instant estimate.

This isn’t just an AI inventory scanner that gives your staff a list to quote later. MoveScan is a complete end-to-end instant estimating system. The estimate is already built for you, leaving your staff primarily with a review-and-approve step.

A customer can walk through a full three-bedroom home and receive their instant moving estimate in under five minutes.

I’m looking for a small group of moving companies interested in getting involved early. I’ll personally set MoveScan up around your company’s operation and pricing at no cost, and your first 5 estimates are free.

There’s also a bigger goal behind this. As more moving companies begin using MoveScan, I want to build a network of MoveScan-enabled movers and dedicate a portion of subscription revenue toward advertising that network to consumers — creating new customer demand for the same movers using the technology.

I built MoveScan while actually working in the field as a mover, so it was designed around the problems we deal with on real jobs — not around what someone outside the industry thinks moving software should look like.

You don’t need to schedule a call or wait for me to send anything. You can see the customer experience for yourself here:

https://aiguylabs.com/products/movescan

Click See It in Action to watch the demo.

Best,
Michael Pierre
Nashville Mover / Independent Full-Stack Software Developer
MoveScan / AI Guy Labs
mike@aiguylabs.com`;
function PrivateCampaignsPage() {
  const [password, setPassword] = useState('');
  const [draftRange, setDraftRange] = useState(() => getDefaultCampaignRange());
  const [appliedRange, setAppliedRange] = useState(() => getDefaultCampaignRange());
  const [dashboard, setDashboard] = useState(null);
  const [pageState, setPageState] = useState({ status: 'checking', message: 'Checking access...' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [outreachForm, setOutreachForm] = useState({ companyName: '', recipientEmail: '' });
  const [outreachEmail, setOutreachEmail] = useState({ subject: DEFAULT_MOVESCAN_OUTREACH_SUBJECT, bodyText: DEFAULT_MOVESCAN_OUTREACH_BODY });
  const [outreachState, setOutreachState] = useState({ status: 'idle', message: '' });
  const [sendingRecipientId, setSendingRecipientId] = useState('');
  const [outreachSort, setOutreachSort] = useState('default');
  const [isOutreachPreviewOpen, setIsOutreachPreviewOpen] = useState(false);
  const [outreachPreview, setOutreachPreview] = useState(null);
  const [outreachPreviewState, setOutreachPreviewState] = useState({ status: 'idle', message: '' });
  const [templateSaveState, setTemplateSaveState] = useState({ status: 'idle', message: '' });

  async function loadAnalytics(nextRange = appliedRange, options = {}) {
    const shouldLoadTemplate = options.loadTemplate !== false;
    const params = new URLSearchParams();
    if (nextRange.from) params.set('from', nextRange.from);
    if (nextRange.to) params.set('to', nextRange.to);

    setPageState({ status: 'loading', message: '' });
    const response = await fetch('/api/private/campaigns' + (params.toString() ? '?' + params.toString() : ''), { credentials: 'include' });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      setDashboard(null);
      setPageState({ status: 'locked', message: '' });
      return false;
    }

    if (!response.ok || data.ok === false) {
      throw new Error(data.error || 'Unable to load campaign analytics.');
    }

    const outreachResponse = await fetch('/api/private/campaigns/outreach', { credentials: 'include' });
    const outreachData = await outreachResponse.json().catch(() => ({}));
    if (!outreachResponse.ok || outreachData.ok === false) throw new Error(outreachData.error || 'Unable to load outreach recipients.');

    if (shouldLoadTemplate) {
      const templateResponse = await fetch('/api/private/campaigns/outreach-template', { credentials: 'include' });
      const templateData = await templateResponse.json().catch(() => ({}));
      if (!templateResponse.ok || templateData.ok === false) throw new Error(templateData.error || 'Unable to load outreach email template.');
      if (templateData.template?.subject || templateData.template?.bodyText) {
        setOutreachEmail({
          subject: templateData.template.subject || DEFAULT_MOVESCAN_OUTREACH_SUBJECT,
          bodyText: templateData.template.bodyText || DEFAULT_MOVESCAN_OUTREACH_BODY,
        });
      }
    }

    setDashboard(data);
    setRecipients(outreachData.recipients || []);
    setAppliedRange(nextRange);
    setDraftRange(nextRange);
    setPageState({ status: 'ready', message: '' });
    return true;
  }

  useEffect(() => {
    void loadAnalytics().catch((error) => {
      setPageState({ status: 'error', message: error.message || 'Unable to load campaign analytics.' });
    });
  }, []);

  async function unlock(event) {
    event.preventDefault();
    const nextPassword = password.trim();
    if (!nextPassword) return;

    setIsSubmitting(true);
    setPageState({ status: 'loading', message: '' });

    try {
      const response = await fetch('/api/private/campaigns/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: nextPassword }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'Invalid private campaigns password.');
      }

      setPassword('');
      await loadAnalytics(draftRange);
    } catch (error) {
      setDashboard(null);
      setPageState({ status: 'locked', message: error.message || 'Unable to open campaign analytics.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function sendOutreach(event) {
    event.preventDefault();
    if (outreachState.status === 'sending') return;
    setOutreachState({ status: 'sending', message: '' });

    const companyName = outreachForm.companyName.trim();
    const recipientEmail = outreachForm.recipientEmail.trim();
    if (!companyName || !recipientEmail) {
      setOutreachState({ status: 'error', message: 'Company name and recipient email are required for a real outreach send.' });
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(recipientEmail)) {
      setOutreachState({ status: 'error', message: 'Enter a valid recipient email for a real outreach send.' });
      return;
    }
    try {
      const response = await fetch('/api/private/campaigns/recipients', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ companyName, recipientEmail, subject: outreachEmail.subject, bodyText: outreachEmail.bodyText }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Unable to send the outreach email.');
      setOutreachForm({ companyName: '', recipientEmail: '' });
      setOutreachState({ status: 'success', message: 'Tracked MoveScan email sent.' });
      await loadAnalytics(appliedRange, { loadTemplate: false });
    } catch (error) {
      setOutreachState({ status: 'error', message: error.message || 'Unable to send the outreach email.' });
    }
  }

  async function sendRecipient(recipient) {
    if (!recipient?.id || sendingRecipientId) return;
    const retry = canRetryDelivery(recipient.delivery?.status);
    setSendingRecipientId(recipient.id);
    setOutreachState({ status: 'sending', message: '' });
    try {
      const response = await fetch('/api/private/campaigns/recipients', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ recipientId: recipient.id, retry, subject: outreachEmail.subject, bodyText: outreachEmail.bodyText }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Unable to send the outreach email.');
      setOutreachState({ status: 'success', message: 'Tracked MoveScan email sent to ' + recipient.companyName + '.' });
      await loadAnalytics(appliedRange, { loadTemplate: false });
    } catch (error) {
      setOutreachState({ status: 'error', message: error.message || 'Unable to send the outreach email.' });
    } finally {
      setSendingRecipientId('');
    }
  }
  async function saveOutreachTemplate() {
    if (templateSaveState.status === 'saving') return;
    setTemplateSaveState({ status: 'saving', message: '' });
    try {
      const response = await fetch('/api/private/campaigns/outreach-template', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject: outreachEmail.subject, bodyText: outreachEmail.bodyText }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Unable to save the email template.');
      if (data.template?.subject || data.template?.bodyText) {
        setOutreachEmail({
          subject: data.template.subject || DEFAULT_MOVESCAN_OUTREACH_SUBJECT,
          bodyText: data.template.bodyText || DEFAULT_MOVESCAN_OUTREACH_BODY,
        });
      }
      setTemplateSaveState({ status: 'success', message: 'Template saved' });
    } catch (error) {
      setTemplateSaveState({ status: 'error', message: error.message || 'Unable to save the email template.' });
    }
  }

  async function openOutreachPreview() {
    setOutreachPreviewState({ status: 'loading', message: '' });
    try {
      const response = await fetch('/api/private/campaigns/outreach-preview', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject: outreachEmail.subject, bodyText: outreachEmail.bodyText }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Unable to load the email preview.');
      setOutreachPreview(data);
      setIsOutreachPreviewOpen(true);
      setOutreachPreviewState({ status: 'ready', message: '' });
    } catch (error) {
      setOutreachPreviewState({ status: 'error', message: error.message || 'Unable to load the email preview.' });
    }
  }

  async function sendTestToMe() {
    if (outreachPreviewState.status === 'sending') return;
    setOutreachPreviewState({ status: 'sending', message: '' });
    try {
      const response = await fetch('/api/private/campaigns/outreach-test', {
        method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject: outreachEmail.subject, bodyText: outreachEmail.bodyText }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Unable to send the test email.');
      setOutreachPreviewState({ status: 'success', message: 'Test email sent to mike@aiguylabs.com.' });
    } catch (error) {
      setOutreachPreviewState({ status: 'error', message: error.message || 'Unable to send the test email.' });
    }
  }

  useEffect(() => {
    if (!isOutreachPreviewOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOutreachPreviewOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOutreachPreviewOpen]);
  async function lock() {
    await fetch('/api/private/campaigns/session', { method: 'DELETE', credentials: 'include' }).catch(() => {});
    setDashboard(null);
    setPageState({ status: 'locked', message: '' });
  }

  async function refresh() {
    try {
      await loadAnalytics(appliedRange, { loadTemplate: false });
    } catch (error) {
      setPageState({ status: 'error', message: error.message || 'Unable to load campaign analytics.' });
    }
  }

  async function applyRange(event) {
    event.preventDefault();
    try {
      await loadAnalytics(draftRange);
    } catch (error) {
      setPageState({ status: 'error', message: error.message || 'Unable to load campaign analytics.' });
    }
  }

  function setPresetRange(range) {
    setDraftRange(typeof range === 'function' ? range() : range);
  }

  const summary = dashboard?.summary || {};
  const rangeLabel = dashboard ? formatCampaignDate(dashboard.range.from) + ' to ' + formatCampaignDate(dashboard.range.to) : '';
  const recentScans = dashboard?.recentScans || [];
  const summaryCards = [
    { label: 'Total QR scans', value: summary.totalScans ?? 0 },
    { label: 'Unique visitors', value: summary.uniqueVisitors ?? 0 },
    { label: 'Scans today', value: summary.scansToday ?? 0 },
    { label: 'Last 7 days', value: summary.scansLast7Days ?? 0 },
    { label: 'Last 30 days', value: summary.scansLast30Days ?? 0 },
  ];

  const leads = recipients.filter((recipient) => recipient.lead);
  const sortedRecipients = sortOutreachRecipients(recipients, outreachSort);

  if (pageState.status === 'locked') {
    return (
      <main className="private-campaigns-page">
        <section className="section-shell private-campaigns-hero" aria-labelledby="private-campaigns-title">
          <div className="container private-campaigns-shell">
            <div className="private-campaigns-copy">
              <p className="eyebrow">Private</p>
              <h1 id="private-campaigns-title">AI Guy Labs™ campaign analytics</h1>
              <p>Review MoveScan postcard scans in a small private area without exposing visitor IP addresses or any unnecessary data.</p>
            </div>

            <div className="private-login-card">
              <h2>Open campaign analytics</h2>
              <p>Enter the private campaigns password to review the postcard campaign response.</p>
              <form className="private-login-form" onSubmit={unlock}>
                <label>
                  <span>Private campaigns password</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
                </label>
                {pageState.message ? <p className="form-error">{pageState.message}</p> : null}
                <button className="button button-primary" type="submit" disabled={isSubmitting || !password.trim()}>{isSubmitting ? 'Opening...' : 'Open Campaigns'} <Icon /></button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="private-campaigns-page">
      <section className="section-shell private-campaigns-hero" aria-labelledby="private-campaigns-title">
        <div className="container private-campaigns-shell">
          <div className="private-campaigns-copy">
            <p className="eyebrow">Private</p>
            <h1 id="private-campaigns-title">AI Guy Labs™ campaign analytics</h1>
            <p>Review MoveScan postcard scans in a small private area without exposing visitor IP addresses or any unnecessary data.</p>
          </div>

          <div className="private-dashboard-card">
            <div className="private-dashboard-topline">
              <div>
                <p className="private-dashboard-kicker">MoveScan postcard campaign</p>
                <p className="private-dashboard-note">Latest scan: {summary.lastScanAt ? formatCampaignTimestamp(summary.lastScanAt) : 'No scans yet'}</p>
                <p className="private-dashboard-note">Visitor IP addresses and user agents are not shown.</p>
              </div>
              <div className="private-dashboard-actions">
                <button className="button button-secondary button-small" type="button" onClick={refresh}>Refresh</button>
                <button className="button button-secondary button-small" type="button" onClick={lock}>Lock</button>
              </div>
            </div>

            <section className="private-outreach-panel" aria-labelledby="private-outreach-title">
              <div>
                <p className="private-dashboard-kicker">MoveScan outreach</p>
                <h2 id="private-outreach-title">Send a tracked introduction</h2>
                <p className="private-dashboard-note">Each send creates its own secure recipient link, open pixel, and funnel record. Email opens are approximate because mail clients may preload images.</p>
              </div>
              <form className="private-outreach-form" onSubmit={sendOutreach} noValidate>
                <label>
                  <span>Company name</span>
                  <input value={outreachForm.companyName} onChange={(event) => setOutreachForm((current) => ({ ...current, companyName: event.target.value }))} required />
                </label>
                <label>
                  <span>Recipient email</span>
                  <input type="email" value={outreachForm.recipientEmail} onChange={(event) => setOutreachForm((current) => ({ ...current, recipientEmail: event.target.value }))} required />
                </label>
                <label className="private-outreach-subject-field">
                  <span>Email subject</span>
                  <input value={outreachEmail.subject} onChange={(event) => { setOutreachEmail((current) => ({ ...current, subject: event.target.value })); setTemplateSaveState({ status: 'idle', message: '' }); }} />
                </label>
                <label className="private-outreach-body-field">
                  <span>Email body/content</span>
                  <textarea rows="18" value={outreachEmail.bodyText} onChange={(event) => { setOutreachEmail((current) => ({ ...current, bodyText: event.target.value })); setTemplateSaveState({ status: 'idle', message: '' }); }} />
                </label>
                <button className="button button-primary" type="submit" disabled={outreachState.status === 'sending'}>{outreachState.status === 'sending' ? 'Sending...' : 'Send MoveScan Email'} <Icon /></button>
              </form>
              <div className="private-outreach-tools">
                <button className="button button-primary button-small" type="button" onClick={saveOutreachTemplate} disabled={templateSaveState.status === 'saving'}>{templateSaveState.status === 'saving' ? 'Saving...' : 'Save Email Template'}</button>
                <button className="button button-secondary button-small" type="button" onClick={openOutreachPreview} disabled={outreachPreviewState.status === 'loading'}>{outreachPreviewState.status === 'loading' ? 'Loading Preview...' : 'Preview Email'}</button>
                <button className="button button-secondary button-small" type="button" onClick={sendTestToMe} disabled={outreachPreviewState.status === 'sending'}>{outreachPreviewState.status === 'sending' ? 'Sending Test...' : 'Send Test to Me'}</button>
              </div>
              {templateSaveState.message ? <p className={templateSaveState.status === 'error' ? 'form-error' : 'private-state-message'}>{templateSaveState.message}</p> : null}

              {outreachState.message ? <p className={outreachState.status === 'error' ? 'form-error' : 'private-state-message'}>{outreachState.message}</p> : null}
              {outreachPreviewState.message ? <p className={outreachPreviewState.status === 'error' ? 'form-error' : 'private-state-message'}>{outreachPreviewState.message}</p> : null}
            </section>

            <section className="private-outreach-list" aria-labelledby="private-outreach-list-title">
              <div className="private-range-head private-outreach-list-head">
                <div>
                  <h2 id="private-outreach-list-title">Outreach funnel</h2>
                  <p>Sent &rarr; Delivered &rarr; Opened &rarr; Product Page &rarr; Demo Opened &rarr; Video Started &rarr; 50% Watched</p>
                </div>
                <label className="private-outreach-sort">
                  <span>Sort</span>
                  <select value={outreachSort} onChange={(event) => setOutreachSort(event.target.value)}>
                    {outreachSortOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>
              {sortedRecipients.length ? sortedRecipients.map((recipient) => (
                <article className="private-outreach-row" key={recipient.id}>
                  <div className="private-outreach-recipient">
                    <strong>{recipient.companyName}</strong>
                    <span>{recipient.recipientEmail}</span>
                  </div>
                  <div className="private-outreach-funnel" aria-label={recipient.companyName + ' funnel status'}>
                    {['sent', 'delivered', 'opened', 'productPage', 'demo'].map((stage) => <span className={recipient.funnel?.[stage] ? 'is-complete' : ''} key={stage}>{stage === 'productPage' ? 'Product Page' : stage === 'demo' ? 'Demo Opened' : stage.charAt(0).toUpperCase() + stage.slice(1)}</span>)}
                  </div>
                  <div className="private-outreach-engagement" aria-label={recipient.companyName + ' demo engagement'}>
                    {['opened', 'started', 'watched25', 'watched50', 'completed'].map((stage) => <span className={recipient.demoEngagement?.[stage] ? 'is-complete' : ''} key={stage}>{stage === 'opened' ? 'Demo Opened' : stage === 'started' ? 'Video Started' : stage === 'watched25' ? '25% Watched' : stage === 'watched50' ? '50% Watched' : 'Completed'}</span>)}
                  </div>
                  <div className="private-outreach-action">
                    <span className={'private-outreach-status ' + getRecipientStatusClass(recipient)}>
                      {getRecipientStatusLabel(recipient)}
                    </span>
                    <button className="button button-primary button-small" type="button" onClick={() => sendRecipient(recipient)} disabled={(Boolean(recipient.funnel?.sent) && !canRetryDelivery(recipient.delivery?.status)) || Boolean(sendingRecipientId)}>
                      {sendingRecipientId === recipient.id ? 'Sending...' : canRetryDelivery(recipient.delivery?.status) ? 'Retry' : recipient.funnel?.sent ? 'Sent' : 'Send'}
                    </button>
                  </div>
                </article>
              )) : <p className="private-empty">No outreach recipients yet.</p>}
            </section>

            <section className="private-leads-list" aria-labelledby="private-leads-title">
              <div className="private-range-head">
                <div>
                  <h2 id="private-leads-title">Leads</h2>
                  <p>Prospects who opened the demo and started watching.</p>
                </div>
              </div>
              {leads.length ? leads.map((recipient) => (
                <article className="private-lead-row" key={recipient.id}>
                  <div className="private-outreach-recipient">
                    <strong>{recipient.companyName}</strong>
                    <span>{recipient.recipientEmail}</span>
                  </div>
                  <div className="private-lead-stage">
                    <strong className={recipient.hotLead ? 'is-hot-lead' : 'is-lead'}>{recipient.hotLead ? 'Hot Lead' : 'Lead'}</strong>
                    <span>{recipient.demoEngagement?.completed ? 'Completed' : recipient.demoEngagement?.watched50 ? '50% Watched' : recipient.demoEngagement?.watched25 ? '25% Watched' : recipient.demoEngagement?.started ? 'Video Started' : 'Demo Opened'}</span>
                  </div>
                  <div className="private-lead-dates">
                    <span>Lead: {formatCampaignTimestamp(recipient.leadAt)}</span>
                    <span>Latest: {formatCampaignTimestamp(recipient.latestActivity)}</span>
                  </div>
                </article>
              )) : <p className="private-empty">No demo leads yet.</p>}
            </section>
            <div className="private-summary-grid">
              {summaryCards.map((card) => (
                <article className="private-summary-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                </article>
              ))}
            </div>

            <div className="private-range-panel">
              <div className="private-range-head">
                <div>
                  <h2>Recent scan timestamps</h2>
                  <p>Showing {rangeLabel || 'the selected date range'}.</p>
                </div>
                <form className="private-range-form" onSubmit={applyRange}>
                  <div className="private-range-fields">
                    <label>
                      <span>From</span>
                      <input type="date" value={draftRange.from} onChange={(event) => setDraftRange((current) => ({ ...current, from: event.target.value }))} />
                    </label>
                    <label>
                      <span>To</span>
                      <input type="date" value={draftRange.to} onChange={(event) => setDraftRange((current) => ({ ...current, to: event.target.value }))} />
                    </label>
                  </div>
                  <div className="private-range-actions">
                    <button className="button button-primary button-small" type="submit">Apply Range</button>
                    <button className="button button-secondary button-small" type="button" onClick={() => setPresetRange(getDefaultCampaignRange())}>Last 30 Days</button>
                    <button className="button button-secondary button-small" type="button" onClick={() => setPresetRange(() => {
                      const end = new Date();
                      const start = new Date(end);
                      start.setUTCDate(start.getUTCDate() - 6);
                      return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
                    })}>Last 7 Days</button>
                    <button className="button button-secondary button-small" type="button" onClick={() => setPresetRange(getAllTimeCampaignRange())}>All Time</button>
                  </div>
                </form>
              </div>

              <div className="private-scan-list" aria-live="polite">
                {pageState.message ? <p className="private-state-message">{pageState.message}</p> : null}
                {pageState.status === 'loading' && !recentScans.length ? <p className="private-empty">Loading campaign analytics...</p> : null}
                {!pageState.message && recentScans.length === 0 ? <p className="private-empty">No scans were recorded in this date range yet.</p> : null}
                {recentScans.map((scan) => (
                  <article className="private-scan-row" key={scan.createdAt}>
                    <span>{formatCampaignTimestamp(scan.createdAt)}</span>
                    <span>postcard_scan</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {isOutreachPreviewOpen && outreachPreview ? (
        <div className="private-email-preview" role="dialog" aria-modal="true" aria-labelledby="private-email-preview-title" onClick={() => setIsOutreachPreviewOpen(false)}>
          <div className="private-email-preview__dialog" onClick={(event) => event.stopPropagation()}>
            <div className="private-email-preview__header">
              <div>
                <p className="private-dashboard-kicker">Email preview</p>
                <h2 id="private-email-preview-title">{outreachPreview.subject}</h2>
                <p>From {outreachPreview.from} · Reply-To {outreachPreview.replyTo}</p>
              </div>
              <button className="private-email-preview__close" type="button" onClick={() => setIsOutreachPreviewOpen(false)}>Close</button>
            </div>
            <iframe title="MoveScan outreach email preview" srcDoc={outreachPreview.html} sandbox="" />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function AdminLeadsPage() {
  const [token, setToken] = useState(() => window.sessionStorage.getItem('aigl_admin_token') || '');
  const [draftToken, setDraftToken] = useState(token);
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState('New');
  const [adminState, setAdminState] = useState({ status: token ? 'loading' : 'locked', message: '' });

  async function adminFetch(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token,
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error(data.error || 'Request failed.');
    return data;
  }

  async function loadLeads() {
    if (!token) return;
    setAdminState({ status: 'loading', message: '' });
    try {
      const data = await adminFetch('/api/admin/leads');
      setLeads(data.leads || []);
      const nextSelected = selectedId || data.leads?.[0]?.id || '';
      setSelectedId(nextSelected);
      setAdminState({ status: 'ready', message: '' });
    } catch (error) {
      setAdminState({ status: 'error', message: error.message || 'Unable to load leads.' });
    }
  }

  async function loadLead(id) {
    if (!id || !token) return;
    try {
      const data = await adminFetch('/api/admin/leads/' + encodeURIComponent(id));
      setSelectedLead(data.lead);
      setStatusDraft(data.lead.status);
      setNotesDraft(data.lead.notes || '');
    } catch (error) {
      setAdminState({ status: 'error', message: error.message || 'Unable to load lead.' });
    }
  }

  useEffect(() => { loadLeads(); }, [token]);
  useEffect(() => { loadLead(selectedId); }, [selectedId, token]);

  function unlock(event) {
    event.preventDefault();
    const next = draftToken.trim();
    if (!next) return;
    window.sessionStorage.setItem('aigl_admin_token', next);
    setToken(next);
  }

  async function saveLead() {
    if (!selectedLead) return;
    setAdminState({ status: 'saving', message: '' });
    try {
      const data = await adminFetch('/api/admin/leads/' + encodeURIComponent(selectedLead.id), {
        method: 'PATCH',
        body: JSON.stringify({ status: statusDraft, notes: notesDraft }),
      });
      setSelectedLead(data.lead);
      setLeads((current) => current.map((lead) => lead.id === data.lead.id ? data.lead : lead));
      setAdminState({ status: 'ready', message: 'Lead updated.' });
    } catch (error) {
      setAdminState({ status: 'error', message: error.message || 'Unable to update lead.' });
    }
  }

  if (!token) {
    return (
      <main className="admin-page">
        <section className="section-shell admin-hero" aria-labelledby="admin-title">
          <div className="container admin-lockup">
            <p className="eyebrow">Private</p>
            <h1 id="admin-title">AI Guy Labs™ Leads</h1>
            <p>Enter the admin access key to manage project inquiries.</p>
            <form className="admin-auth-form" onSubmit={unlock}>
              <label>
                <span>Admin access key</span>
                <input type="password" value={draftToken} onChange={(event) => setDraftToken(event.target.value)} autoComplete="current-password" />
              </label>
              <button className="button button-primary" type="submit">Open Leads <Icon /></button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="section-shell admin-hero" aria-labelledby="admin-leads-title">
        <div className="container admin-layout">
          <div className="admin-heading">
            <p className="eyebrow">Private Dashboard</p>
            <h1 id="admin-leads-title">Lead Capture</h1>
            <p>Database-backed project inquiries submitted through the AI Guy Labs™ contact form.</p>
            <div className="admin-actions">
              <button className="button button-secondary button-small" type="button" onClick={loadLeads}>Refresh</button>
              <button className="button button-secondary button-small" type="button" onClick={() => { window.sessionStorage.removeItem('aigl_admin_token'); setToken(''); setLeads([]); setSelectedLead(null); }}>Lock</button>
            </div>
            {adminState.message ? <p className={adminState.status === 'error' ? 'form-error' : 'admin-message'}>{adminState.message}</p> : null}
          </div>

          <div className="leads-grid">
            <div className="leads-table-wrap">
              <table className="leads-table">
                <thead>
                  <tr><th>Date</th><th>Name</th><th>Company</th><th>Email</th><th>Budget</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr className={lead.id === selectedId ? 'is-selected' : ''} key={lead.id} onClick={() => setSelectedId(lead.id)}>
                      <td>{formatLeadDate(lead.createdAt)}</td>
                      <td>{lead.name}</td>
                      <td>{lead.company || '?'}</td>
                      <td>{lead.email}</td>
                      <td>{lead.budgetRange || '?'}</td>
                      <td><span className="lead-status-pill">{lead.status}</span></td>
                    </tr>
                  ))}
                  {!leads.length ? <tr><td colSpan="6">{adminState.status === 'loading' ? 'Loading leads...' : 'No leads captured yet.'}</td></tr> : null}
                </tbody>
              </table>
            </div>

            <aside className="lead-detail-panel">
              {selectedLead ? (
                <>
                  <div className="lead-detail-heading">
                    <p className="eyebrow">Lead Detail</p>
                    <h2>{selectedLead.name}</h2>
                    <p>{selectedLead.company || 'Independent project'} / {selectedLead.email}</p>
                  </div>
                  <dl className="lead-detail-list">
                    <div><dt>Submission time</dt><dd>{formatLeadDate(selectedLead.createdAt)}</dd></div>
                    <div><dt>Project</dt><dd>{selectedLead.projectType}</dd></div>
                    <div><dt>Budget</dt><dd>{selectedLead.budgetRange || 'Not provided'}</dd></div>
                    <div><dt>Contact</dt><dd><a href={'mailto:' + selectedLead.email}>{selectedLead.email}</a></dd></div>
                  </dl>
                  <div className="lead-message-block">
                    <h3>Full project description</h3>
                    <p>{selectedLead.message}</p>
                  </div>
                  <label className="admin-field">
                    <span>Status</span>
                    <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
                      {leadStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Internal notes</span>
                    <textarea value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} rows="7" />
                  </label>
                  <button className="button button-primary" type="button" onClick={saveLead} disabled={adminState.status === 'saving'}>{adminState.status === 'saving' ? 'Saving...' : 'Save Lead'} <Icon /></button>
                </>
              ) : <p>Select a lead to review details.</p>}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  return (
    <main className="legal-page">
      <section className="section-shell product-placeholder-hero" aria-labelledby="legal-page-title">
        <div className="container product-placeholder-inner legal-page-inner">
          <div className="product-placeholder-copy">
            <p className="eyebrow">AI Guy Labs™</p>
            <h1 id="legal-page-title">{isPrivacy ? 'Privacy' : 'Terms'}</h1>
            <p className="product-placeholder-subheading">{isPrivacy ? 'Privacy details are being prepared.' : 'Terms of use are being prepared.'}</p>
            <p className="product-placeholder-message">This page is part of the AI Guy Labs™ public site and will be expanded with formal {isPrivacy ? 'privacy' : 'terms'} language before launch.</p>
            <a className="button button-primary" href="/contact">Contact AI Guy Labs™ <Icon /></a>
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="product-placeholder-page not-found-page">
      <section className="section-shell product-placeholder-hero" aria-labelledby="not-found-title">
        <div className="container product-placeholder-inner not-found-inner">
          <div className="product-placeholder-copy">
            <p className="eyebrow">AI Guy Labs™</p>
            <h1 id="not-found-title">Page not found.</h1>
            <p className="product-placeholder-subheading">The page you requested is not available.</p>
            <p className="product-placeholder-message">Use the main navigation or return to the product catalog to continue exploring AI Guy Labs™ software.</p>
            <a className="button button-primary" href="/products">Explore Products <Icon /></a>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isMoveScanPostcardPage = path === '/go/movescan-postcard';
  const isMoveScanDemoPage = path === '/products/movescan/demo';
  const isHomePage = path === '/';
  const isProductsPage = path === '/products';
  const productSlug = path.startsWith('/products/') ? path.slice('/products/'.length) : '';
  const productDetail = productSlug ? products.find((product) => product.slug === productSlug) : null;
  const isProductDetailPage = Boolean(productSlug);
  const isApparelPage = path === '/apparel';
  const isServicesPage = path === '/services';
  const isAboutPage = path === '/about';
  const isContactPage = path === '/contact';
  const isPrivacyPage = path === '/privacy';
  const isTermsPage = path === '/terms';
  const isAdminLeadsPage = path === '/admin/leads';
  const isPrivateCampaignsPage = path === '/private/campaigns';
  const isKnownPage = isHomePage || isProductsPage || isProductDetailPage || isApparelPage || isServicesPage || isAboutPage || isContactPage || isAdminLeadsPage || isPrivacyPage || isTermsPage;

  useEffect(() => {
    applySeoMetadata(resolveSeoMetadata(path, productDetail));
    applyStructuredData(resolveStructuredData(path, productDetail));
  }, [path, productDetail]);

  return (
    <>
      {isMoveScanPostcardPage ? (
        <PostcardRedirectPage />
      ) : isMoveScanDemoPage ? (
        <MoveScanDemoPage />
      ) : isPrivateCampaignsPage ? (
        <PrivateCampaignsPage />
      ) : (
        <>
          {isHomePage ? <HotspotBootstrap /> : null}
          <Header />
          {isProductsPage ? <ProductsPage /> : isProductDetailPage ? <ProductPlaceholder product={productDetail} /> : isApparelPage ? <ApparelPage /> : isServicesPage ? <ServicesPage /> : isAboutPage ? <AboutPage /> : isContactPage ? <ContactPage /> : isAdminLeadsPage ? <AdminLeadsPage /> : isPrivacyPage ? <LegalPage type="privacy" /> : isTermsPage ? <LegalPage type="terms" /> : isKnownPage ? <HomePage /> : <NotFoundPage />}
          {isApparelPage ? null : <TechnologyStrip />}
          <Footer />
        </>
      )}
      <div id="ai-guy-labs-modal" className="aigl-modal" hidden>
        <div className="aigl-modal__backdrop" data-modal-close="true" />
        <div className="aigl-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="aigl-modal-title">
          <h2 id="aigl-modal-title">AI Guy Labs™</h2>
          <p id="aigl-modal-body" />
          <button type="button" data-modal-close="true">Close</button>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
