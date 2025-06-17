
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Grace Pelle",
    role: "Musician",
    content: "Will's attention to detail and technical expertise transformed my recordings. His ability to bring out the best in each track while maintaining the artistic vision is truly remarkable.",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    id: 2,
    name: "Graymatter",
    role: "Artist",
    content: "Will is a total pro and great to have around the studio. His ear for detail and dedication to quality took my project to the next level. If you need an audio engineer, he's the one to call.",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    id: 3,
    name: "RJ Mcgaw",
    role: "Drummer",
    content: "Will commands the soundboard and has an excellent ear for what is needed for a mix. He is precise with his assessments of frequencies and how to manipulate them. Will is also a quick thinker and can make adjustments when things don't go to plan.",
    image: "/placeholder.svg",
    rating: 5
  }
];
