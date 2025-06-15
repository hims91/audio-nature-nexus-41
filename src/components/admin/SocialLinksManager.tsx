
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, PlusCircle, Edit, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksManagerProps {
  links: SocialLink[];
  onUpdate: (links: SocialLink[]) => void;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ links, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<SocialLink | null>(null);
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  const handleAddOrUpdate = () => {
    if (!platform || !url) return;

    if (currentLink) {
      const updatedLinks = links.map(link =>
        link.id === currentLink.id ? { ...link, platform, url } : link
      );
      onUpdate(updatedLinks);
    } else {
      const newLink: SocialLink = { id: crypto.randomUUID(), platform, url };
      onUpdate([...links, newLink]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (link: SocialLink) => {
    setCurrentLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(links.filter(link => link.id !== id));
  };

  const resetForm = () => {
    setCurrentLink(null);
    setPlatform('');
    setUrl('');
  };

  const openNewLinkDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-nature-forest" />
              Social Media Links
            </CardTitle>
            <CardDescription>
              Manage links to your social media profiles. These can be displayed in the site footer.
            </CardDescription>
          </div>
          <Button onClick={openNewLinkDialog} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No social media links configured yet.</p>
        ) : (
          <div className="space-y-4">
            {links.map(link => (
              <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium">{link.platform}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate max-w-xs block">{link.url}</a>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(link.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentLink ? 'Edit' : 'Add'} Social Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="e.g., Twitter, Instagram" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://twitter.com/username" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddOrUpdate}>
                {currentLink ? 'Save Changes' : 'Add Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SocialLinksManager;
