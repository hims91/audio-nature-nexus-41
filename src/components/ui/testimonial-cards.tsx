
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  handleShuffle: () => void;
  content: string;
  author: string;
  role: string;
  company: string;
  position: string;
  id: number;
}

export function TestimonialCard ({ 
  handleShuffle, 
  content, 
  author, 
  role, 
  company, 
  position, 
  id 
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%"
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-nature-moss bg-white/90 backdrop-blur-md p-6 shadow-xl ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${id}`}
        alt={`Avatar of ${author}`}
        className="pointer-events-none mx-auto h-32 w-32 rounded-full border-2 border-nature-sage bg-nature-mist object-cover"
      />
      <span className="text-center text-lg italic text-nature-bark">"{content}"</span>
      <div className="text-center">
        <span className="block text-sm font-semibold text-nature-forest">{author}</span>
        <span className="block text-xs text-nature-stone">{role}, {company}</span>
      </div>
    </motion.div>
  );
}

interface ShuffleCardsProps {
  testimonials: Array<{
    id: number;
    content: string;
    author: string;
    role: string;
    company: string;
  }>;
}

export function ShuffleCards({ testimonials }: ShuffleCardsProps) {
  const [positions, setPositions] = React.useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop());
    setPositions(newPositions);
  };

  return (
    <div className="grid place-content-center overflow-hidden bg-gradient-to-br from-nature-mist to-white px-8 py-24 text-nature-forest min-h-[600px] h-full w-full">
      <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            content={testimonial.content}
            author={testimonial.author}
            role={testimonial.role}
            company={testimonial.company}
            handleShuffle={handleShuffle}
            position={positions[index]}
            id={testimonial.id}
          />
        ))}
      </div>
    </div>
  );
}
