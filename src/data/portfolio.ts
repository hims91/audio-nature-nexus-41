
export interface PortfolioItem {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  imageUrl: string;
  audioUrl?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Forest Soundscape",
    client: "Nature Documentary Series",
    category: "Sound Design",
    description: "Created immersive forest ambience and wildlife sounds for an award-winning documentary series.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    audioUrl: "https://example.com/audio1.mp3"
  },
  {
    id: 2,
    title: "Mountain Echo",
    client: "Indie Folk Album",
    category: "Mixing & Mastering",
    description: "Mixed and mastered a 12-track indie folk album, balancing natural acoustic sounds with modern clarity.",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    audioUrl: "https://example.com/audio2.mp3"
  },
  {
    id: 3,
    title: "Wilderness Podcast",
    client: "Outdoor Adventures Network",
    category: "Podcasting",
    description: "Full audio production for a weekly wilderness exploration podcast, including field recordings and studio sessions.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    audioUrl: "https://example.com/audio3.mp3"
  },
  {
    id: 4,
    title: "Vintage Vinyl Restoration",
    client: "Heritage Music Collection",
    category: "Audio Restoration",
    description: "Restored and remastered a collection of rare vintage recordings from the 1940s, preserving their authentic character.",
    imageUrl: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
    audioUrl: "https://example.com/audio4.mp3"
  }
];
