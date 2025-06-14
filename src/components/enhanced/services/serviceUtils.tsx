
import React from "react";
import { AudioWaveform, Headphones, Music, Folder, Mic, Image, Star, Volume2, Wand2 } from "lucide-react";

export const getServiceIcon = (iconName: string) => {
  const iconMap = {
    "audio-waveform": AudioWaveform,
    "headphones": Headphones,
    "music": Music,
    "folder": Folder,
    "mic": Mic,
    "image": Image,
    "volume-2": Volume2,
    "wand-2": Wand2,
    "star": Star,
  };
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || AudioWaveform;
  return <IconComponent className="h-8 w-8" />;
};

export const getCategoryColor = (category: string) => {
  const colors = {
    "Production": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Creative": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "Content": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Premium": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    "Live": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "Restoration": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
};
