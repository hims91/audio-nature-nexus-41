
export interface ExternalLink {
  type: "spotify" | "appleMusic" | "youtube" | "vimeo" | "other";
  url: string;
  title?: string; // Optional title for "other" link types
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: "Mixing & Mastering" | "Sound Design" | "Podcasting" | "Sound for Picture" | "Dolby Atmos";
  description: string;
  coverImageUrl: string;
  coverImagePreview?: string; // For immediate display after upload
  audioUrl?: string; 
  videoUrl?: string;
  externalLinks: ExternalLink[];
  featured: boolean;
  createdAt: string;
}

// Define initial portfolio items with more specialized categories
export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Mountain Echo - Folk Album",
    client: "Indie Music Collective",
    category: "Mixing & Mastering",
    description: "Mixed and mastered a 12-track indie folk album, balancing natural acoustic sounds with modern clarity and depth.",
    coverImageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    audioUrl: "/audio/demo1.mp3",
    externalLinks: [
      { type: "spotify", url: "https://open.spotify.com/album/0xzScN6H0H3lXSXAdPtIcJ" },
      { type: "youtube", url: "https://youtube.com/watch?v=example1" }
    ],
    featured: true,
    createdAt: "2023-06-15"
  },
  {
    id: "2",
    title: "Forest Ambience",
    client: "Nature Documentary Series",
    category: "Sound Design",
    description: "Created immersive forest soundscapes and wildlife sound effects for an award-winning documentary series.",
    coverImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    audioUrl: "/audio/demo2.mp3",
    externalLinks: [
      { type: "vimeo", url: "https://vimeo.com/123456789" }
    ],
    featured: true,
    createdAt: "2023-07-22"
  },
  {
    id: "3",
    title: "Wilderness Stories",
    client: "Outdoor Network",
    category: "Podcasting",
    description: "Full audio production for a weekly wilderness exploration podcast, including field recordings and studio sessions.",
    coverImageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    audioUrl: "/audio/demo3.mp3",
    externalLinks: [
      { type: "spotify", url: "https://open.spotify.com/show/5iA41vUx0QF1Bz2QPFJXPX" },
      { type: "appleMusic", url: "https://podcasts.apple.com/example" }
    ],
    featured: false,
    createdAt: "2023-08-05"
  },
  {
    id: "4",
    title: "Cinematic Short",
    client: "Independent Filmmaker",
    category: "Sound for Picture",
    description: "Complete sound design, foley, and final mix for an award-winning short film, creating an immersive sonic landscape.",
    coverImageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    videoUrl: "/videos/film-snippet.mp4",
    externalLinks: [
      { type: "vimeo", url: "https://vimeo.com/987654321" },
      { type: "other", url: "https://imdb.com/title/example", title: "IMDB" }
    ],
    featured: true,
    createdAt: "2023-09-12"
  },
  {
    id: "5",
    title: "Immersive Concert Experience",
    client: "Orchestra Hall",
    category: "Dolby Atmos",
    description: "Created a Dolby Atmos mix for a live orchestral performance, enabling an immersive spatial audio experience.",
    coverImageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    audioUrl: "/audio/demo5.mp3",
    externalLinks: [
      { type: "appleMusic", url: "https://music.apple.com/example" }
    ],
    featured: false,
    createdAt: "2023-10-30"
  }
];
