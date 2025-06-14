
import React from "react";
import { type PortfolioItem } from "@/types/portfolio";
import PortfolioEditor from "./PortfolioEditor";
import EmptyState from "./EmptyState";

interface PortfolioMainContentProps {
  isCreating: boolean;
  selectedItem: PortfolioItem | null;
  onSaveNew: (itemData: Partial<PortfolioItem>) => Promise<void>;
  onUpdate: (item: PortfolioItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
  onCreateNew: () => void;
  isLoading: boolean;
}

const PortfolioMainContent: React.FC<PortfolioMainContentProps> = ({
  isCreating,
  selectedItem,
  onSaveNew,
  onUpdate,
  onDelete,
  onCancel,
  onCreateNew,
  isLoading
}) => {
  if (isCreating) {
    return (
      <PortfolioEditor 
        mode="create"
        onSave={onSaveNew}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    );
  }

  if (selectedItem) {
    return (
      <PortfolioEditor 
        mode="edit"
        item={selectedItem}
        onSave={onUpdate}
        onDelete={() => onDelete(selectedItem.id)}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    );
  }

  return <EmptyState onCreateNew={onCreateNew} />;
};

export default PortfolioMainContent;
