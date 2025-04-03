
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FooterActionsProps {
  onCancel: () => void;
  onUpdate: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({ onCancel, onUpdate }) => {
  return (
    <div className="pt-4 flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={onUpdate}
        className="bg-nature-forest hover:bg-nature-leaf"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
};

export default FooterActions;
