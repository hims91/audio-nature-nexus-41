
import { PortfolioItem, ExternalLink } from "@/data/portfolio";
import { Toast } from "@/hooks/use-toast";

export const handleAddLink = (
  currentItem: PortfolioItem,
  setCurrentItem: React.Dispatch<React.SetStateAction<PortfolioItem | null>>,
  newLinkTitle: string,
  newLinkUrl: string, 
  newLinkIcon: string,
  setNewLinkTitle: React.Dispatch<React.SetStateAction<string>>,
  setNewLinkUrl: React.Dispatch<React.SetStateAction<string>>,
  setNewLinkIcon: React.Dispatch<React.SetStateAction<string>>,
  toast: { (...props: any): { id: string; dismiss: () => void; update: (props: any) => void } }
) => {
  if (!currentItem) return;
  if (!newLinkUrl) {
    toast({
      title: "Missing information",
      description: "Please provide a URL for the link",
      variant: "destructive"
    });
    return;
  }
  
  // For 'other' type links, require a title
  if (newLinkIcon === 'other' && !newLinkTitle) {
    toast({
      title: "Missing information",
      description: "Please provide a title for custom links",
      variant: "destructive"
    });
    return;
  }
  
  const newLink: ExternalLink = {
    type: newLinkIcon as ExternalLink['type'],
    url: newLinkUrl,
    ...(newLinkIcon === 'other' && { title: newLinkTitle })
  };
  
  const updatedExternalLinks = [...currentItem.externalLinks, newLink];
  
  setCurrentItem({
    ...currentItem,
    externalLinks: updatedExternalLinks
  });
  
  setNewLinkTitle("");
  setNewLinkUrl("");
  setNewLinkIcon("spotify");
  
  toast({
    title: "Link added",
    description: `Added ${newLinkIcon} link`,
  });
};

export const handleRemoveLink = (
  index: number,
  currentItem: PortfolioItem,
  setCurrentItem: React.Dispatch<React.SetStateAction<PortfolioItem | null>>,
  toast: { (...props: any): { id: string; dismiss: () => void; update: (props: any) => void } }
) => {
  if (!currentItem) return;
  
  const updatedLinks = [...currentItem.externalLinks];
  updatedLinks.splice(index, 1);
  
  setCurrentItem({
    ...currentItem,
    externalLinks: updatedLinks
  });
  
  toast({
    title: "Link removed",
    description: "The link has been removed",
  });
};
