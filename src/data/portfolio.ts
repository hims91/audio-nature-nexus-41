
export interface PortfolioItem {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  imageUrl: string;
  imagePreviewUrl?: string; // Add support for image preview URLs
  audioUrl: string;
  videoUrl?: string;
  spotifyUrl?: string;
  otherLinks?: {
    title: string;
    url: string;
    icon: string;
  }[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Forest Soundscape",
    client: "Nature Documentary Series",
    category: "Sound Design",
    description: "Created immersive forest ambience and wildlife sounds for an award-winning documentary series.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    audioUrl: "/audio/demo1.mp3",
    videoUrl: "",
    spotifyUrl: "https://open.spotify.com/track/5ihDGnhQgMA0F0tk9fNLlA",
    otherLinks: [
      {
        title: "YouTube",
        url: "https://youtube.com/watch?v=example1",
        icon: "youtube"
      }
    ]
  },
  {
    id: 2,
    title: "Mountain Echo",
    client: "Indie Folk Album",
    category: "Mixing & Mastering",
    description: "Mixed and mastered a 12-track indie folk album, balancing natural acoustic sounds with modern clarity.",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    audioUrl: "/audio/demo2.mp3",
    videoUrl: "",
    spotifyUrl: "https://open.spotify.com/album/0xzScN6H0H3lXSXAdPtIcJ",
    otherLinks: [
      {
        title: "YouTube",
        url: "https://youtube.com/watch?v=example2",
        icon: "youtube" 
      },
      {
        title: "Instagram",
        url: "https://instagram.com/example-page",
        icon: "instagram"
      }
    ]
  },
  {
    id: 3,
    title: "Wilderness Podcast",
    client: "Outdoor Adventures Network",
    category: "Podcasting",
    description: "Full audio production for a weekly wilderness exploration podcast, including field recordings and studio sessions.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    audioUrl: "/audio/demo3.mp3",
    videoUrl: "",
    spotifyUrl: "https://open.spotify.com/show/5iA41vUx0QF1Bz2QPFJXPX",
    otherLinks: [
      {
        title: "Apple Podcasts",
        url: "https://podcasts.apple.com/example",
        icon: "link"
      }
    ]
  },
  {
    id: 4,
    title: "Cinematic Short Film",
    client: "Independent Filmmaker",
    category: "Sound for Picture",
    description: "Complete sound design, foley, and final mix for an award-winning short film, creating an immersive sonic landscape.",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    audioUrl: "/audio/demo4.mp3",
    videoUrl: "/videos/film-snippet.mp4",
    otherLinks: [
      {
        title: "IMDB",
        url: "https://imdb.com/title/example",
        icon: "link"
      }
    ]
  },
  {
    id: 5,
    title: "Summer Festival Tour",
    client: "Folk Rock Band",
    category: "Live Event Work",
    description: "Provided FOH mixing and live recording services for a 15-city summer festival tour, capturing the energy of each performance.",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    audioUrl: "/audio/demo5.mp3",
    videoUrl: "",
    otherLinks: [
      {
        title: "Concert Footage",
        url: "https://youtube.com/watch?v=example5",
        icon: "youtube"
      }
    ]
  },
  {
    id: 6,
    title: "Jazz Club Residency",
    client: "Downtown Jazz Ensemble",
    category: "Live Event Work",
    description: "Handled sound reinforcement and multi-track recording for a 6-week jazz club residency, balancing acoustic instruments in an intimate space.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    audioUrl: "/audio/demo6.mp3",
    videoUrl: "",
    spotifyUrl: "https://open.spotify.com/album/0OC0YrXSFaPCB6aQJToWXx",
    otherLinks: [
      {
        title: "Concert Calendar",
        url: "https://jazzclub.com/events",
        icon: "link"
      }
    ]
  },
  {
    id: 7,
    title: "Commercial Soundtrack",
    client: "Outdoor Lifestyle Brand",
    category: "Sound for Picture",
    description: "Composed and produced a custom soundtrack for a national commercial campaign, blending organic instruments with modern production.",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    audioUrl: "/audio/demo7.mp3",
    videoUrl: "/videos/commercial.mp4",
    spotifyUrl: "https://open.spotify.com/track/5P72G2XBBO0iqh25XSGXPF",
    otherLinks: [
      {
        title: "YouTube",
        url: "https://youtube.com/watch?v=example7",
        icon: "youtube"
      }
    ]
  }
];
