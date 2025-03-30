
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Mixing",
    description: "Professional mixing services to blend and balance your tracks to perfection, bringing clarity and depth to your sound.",
    icon: "audio-waveform"
  },
  {
    id: 2,
    title: "Mastering",
    description: "Final polish to ensure your music sounds its best across all playback systems, with optimal loudness and sonic balance.",
    icon: "headphones" 
  },
  {
    id: 3,
    title: "Sound Design",
    description: "Custom sound creation and manipulation to bring unique sonic identities to your projects, films, or games.",
    icon: "music"
  },
  {
    id: 4,
    title: "Music Editing",
    description: "Precision editing to refine arrangement, timing, and structure of your music compositions.",
    icon: "folder"
  },
  {
    id: 5,
    title: "Podcasting",
    description: "Complete audio solutions for podcast production, from recording to final delivery, ensuring professional sound quality.",
    icon: "mic"
  },
  {
    id: 6,
    title: "Sound for Picture",
    description: "Specialized audio production for film, video, and visual media to enhance storytelling and viewer experience.",
    icon: "image"
  },
  {
    id: 7,
    title: "Audio Restoration",
    description: "Revitalize and clean up damaged or noisy recordings, restoring audio clarity while preserving original character.",
    icon: "star"
  },
  {
    id: 8,
    title: "Live Event Work",
    description: "Professional live sound engineering services including FOH mixing, monitor mixing, and high-quality live recordings of performances and events.",
    icon: "volume-2"
  }
];
