
export interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "The sound design work transformed our documentary. The forest ambience captured exactly what we were looking for - natural yet cinematic. Highly recommended!",
    author: "Sarah Johnson",
    role: "Director",
    company: "Wildlight Films"
  },
  {
    id: 2,
    content: "Our podcast sounds incredible after working together. The clarity and warmth achieved in our field recordings is remarkable. Professional, responsive, and truly talented.",
    author: "Mike Thompson",
    role: "Host",
    company: "Outdoor Adventures Podcast"
  },
  {
    id: 3,
    content: "The mixing and mastering on our album exceeded our expectations. Our acoustic instruments sound authentic and the vocals sit perfectly in the mix. Will definitely work together again.",
    author: "Emily Richards",
    role: "Lead Singer",
    company: "The Forest Echoes"
  },
  {
    id: 4,
    content: "The audio restoration work on our vintage recordings was nothing short of miraculous. Preserved the character while removing decades of noise. An exceptional talent.",
    author: "Robert Chen",
    role: "Archivist",
    company: "Heritage Sound Collection"
  }
];
