export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  target: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  videoPath: string
  imagePath: string
  eyebrow: string
  titleLine: string
  titleEmphasis: string
  subtitleLine1: string
  subtitleLine2: string
  ctaText: string
  ctaTargetId: string
}

export interface ManifestoConfig {
  sectionLabel: string
  text: string[]
}

export interface AnatomyPillar {
  label: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export interface AnatomyConfig {
  sectionLabel: string
  title: string
  pillars: AnatomyPillar[]
}

export interface TierConfig {
  name: string
  price: string
  frequency: string
  journeys: string
  image: string
  description: string
  amenities: string[]
  ctaText: string
  ctaHref: string
}

export interface TiersConfig {
  sectionLabel: string
  title: string
  tiers: TierConfig[]
}

export interface ContactConfig {
  sectionLabel: string
  title: string
  intro: string
  email: string
  whatsappNumber: string
  whatsappLabel: string
  instagramUrl: string
  telegramUrl: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface PartnerConfig {
  sectionLabel: string
  title: string
  body: string
  ctaText: string
  ctaTargetId: string
}

export interface FooterConfig {
  ageGateText: string
  brandName: string
  brandTaglineLines: string[]
  columns: FooterColumn[]
  copyright: string
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Fifth Set Collective — Tennis, Across Borders",
  siteDescription:
    "A curated tennis community connecting players, places and experiences across borders.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "Fifth Set Collective",
  links: [
    { label: "The Experience", target: "#anatomy" },
    { label: "Events", target: "#tiers" },
    { label: "Partner", target: "#partner" },
    { label: "Contact", target: "#contact" },
  ],
}

export const heroConfig: HeroConfig = {
  videoPath: "",
  imagePath: "images/hero.jpg",
  eyebrow: "Singapore · By Invitation",
  titleLine: "The Fifth Set",
  titleEmphasis: "Collective",
  subtitleLine1: "A curated tennis community connecting players, places and experiences across borders.",
  subtitleLine2: "",
  ctaText: "Join the Collective",
  ctaTargetId: "#tiers",
}

export const manifestoConfig: ManifestoConfig = {
  sectionLabel: "Vision · Mission · Purpose",
  text: [
    "Fifth Set Collective brings together a curated community of tennis players through shared experiences in Singapore and around the world.",
    "In Singapore, local players, expats and international visitors connect through tennis, travel and social experiences. Beyond Singapore, our community meets players and tennis communities wherever the game takes us.",
    "Because tennis is more than a game. It's where the connection starts — not where it ends.",
  ],
}

export const anatomyConfig: AnatomyConfig = {
  sectionLabel: "The Experience",
  title: "It Starts With Tennis.",
  pillars: [
    {
      label: "Play",
      title: "Tournament-grade competition",
      body: "Graded draws matched to your level and expertly organised matches — every detail is designed to deliver the feel of a professional tournament. Whether it's a monthly Open Play social or championship weekend, you step on court knowing everything is taken care of, leaving you to focus on the game.",
      image: "images/anatomy-play.jpg",
      imageAlt: "A player mid-forehand on a floodlit court at dusk, Singapore skyline behind",
    },
    {
      label: "On the Court — Off the Court",
      title: "Tennis brings us together.",
      body: "But the best experiences often happen around it — the people we meet, the places we discover, the meals we share and the memories we take home.",
      image: "images/anatomy-offcourt.jpg",
      imageAlt: "A long dinner table set beside a tennis court at golden hour",
    },
  ],
}

export const tiersConfig: TiersConfig = {
  sectionLabel: "The Calendar",
  title: "Three ways in",
  tiers: [
    {
      name: "Open Play — Singapore",
      price: "Monthly",
      frequency: "Singapore",
      journeys: "Flagship · Monthly Socials",
      image: "images/tier-openplay.jpg",
      description:
        "Our signature monthly gathering for international players in Singapore. An evening of graded match play on ITF-grade courts, followed by a curated table — the city skyline optional, the company guaranteed.",
      amenities: [
        "Graded social match play, level-matched",
        "Curated post-play dining",
        "Twenty-four places per session",
      ],
      ctaText: "Request a Place",
      ctaHref: "#rsvp:open-play-singapore",
    },
    {
      name: "The Championship",
      price: "2027",
      frequency: "Singapore · Dates to be announced",
      journeys: "Annual · Tournament Format",
      image: "images/tier-championship.jpg",
      description:
        "Amateur players sit at the centre of everything we do. A multi-day championship in Singapore with graded divisions — the full professional experience, built for the amateur game.",
      amenities: [
        "Graded draws across playing levels",
        "Full performance & recovery team",
        "Players' evening and live draw",
        "Waitlist now open",
      ],
      ctaText: "Join the Waitlist",
      ctaHref: "#rsvp:the-championship-2027",
    },
    {
      name: "Experiences",
      price: "3–5",
      frequency: "curated tours each year",
      journeys: "Coming Soon · Bali & Beyond",
      image: "images/tier-experiences.jpg",
      description:
        "Small, hosted tennis tours we organise end to end — courts at golden hour, tables we have handpicked, and recovery woven through every day. Three to five journeys a year, each one deliberately small.",
      amenities: [
        "Hosted by the Collective team",
        "Handpicked courts, tables & stays",
        "Recovery programme throughout",
        "Deliberately small groups",
      ],
      ctaText: "Register Interest",
      ctaHref: "#rsvp:experiences",
    },
  ],
}

export const contactConfig: ContactConfig = {
  sectionLabel: "Contact",
  title: "Begin the conversation",
  intro:
    "Membership of the Collective is deliberately personal. Write to us — about Open Play, the Championship, Experiences, or a partnership — and a member of our team will reply.",
  email: "fifthcollectiveasia@gmail.com",
  whatsappNumber: "6500000000",
  whatsappLabel: "WhatsApp us directly",
  instagramUrl: "https://www.instagram.com/fifthset.collective",
  telegramUrl: "https://t.me/+W6CxBCAe-cY4NGQ1",
}

export const partnerConfig: PartnerConfig = {
  sectionLabel: "Partner With Fifth Set",
  title: "Create the experience with us.",
  body: "We collaborate with tennis communities, venues, hospitality partners, brands and organisations to create experiences that connect players, places and communities. If you share our sense of the game and the life around it, we would like to hear from you.",
  ctaText: "Explore a Partnership",
  ctaTargetId: "#contact",
}

export const footerConfig: FooterConfig = {
  ageGateText: "Come for experience. Stay for connection",
  brandName: "Fifth Set Collective",
  brandTaglineLines: [
    "The match ends.",
    "The experience continues.",
    "Singapore · Worldwide",
  ],
  columns: [
    {
      heading: "Explore",
      links: [
        { label: "The Experience", href: "#anatomy" },
        { label: "Events", href: "#tiers" },
        { label: "Partner", href: "#partner" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "Community",
      links: [
        { label: "Instagram", href: "https://www.instagram.com/fifthset.collective" },
        { label: "Telegram", href: "https://t.me/+W6CxBCAe-cY4NGQ1" },
      ],
    },
    {
      heading: "Visit",
      links: [
        { label: "Singapore", href: "#contact" },
        { label: "fifthcollectiveasia@gmail.com", href: "mailto:fifthcollectiveasia@gmail.com" },
      ],
    },
  ],
  copyright: "© 2026 Fifth Set Collective. All rights reserved.",
}
