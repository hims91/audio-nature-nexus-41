
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
  },
  {
    id: 5,
    content: "Will is truly a prolific and multi talented producer, mixing and mastering engineer. He brought my EP to life and I always know to send my own client mixes off to him for mastering. I'm always taken back to his attention to detail and he's honestly taught me so much about sound design as a whole and has helped me develop my own ear. I love how much he understands artistry and the importance of the sonic landscape. He is also such an awesome human, friend and is so passionate about what he does. 10/10 recommend working with Will !!!",
    author: "Grace Pelle",
    role: "Artist",
    company: "Independent"
  }
];
