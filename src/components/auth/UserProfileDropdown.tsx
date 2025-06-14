
import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, FolderOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UserProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === 'TerraEchoStudios@gmail.com';

  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  const fullName = firstName && lastName 
    ? `${firstName} ${lastName}`
    : user.user_metadata?.full_name || 'User';
  
  const userInitials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : (user.email?.[0]?.toUpperCase() || 'U');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-10 h-10 rounded-full p-0 bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
        >
          <div className="w-8 h-8 rounded-full bg-nature-forest text-white flex items-center justify-center text-sm font-medium">
            {userInitials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl"
        align="end"
        sideOffset={5}
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {fullName}
              {isAdmin && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-nature-forest text-white">
                  Admin
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={() => {
            navigate('/manage-portfolio');
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-gray-500" />
          <span>Manage Portfolio</span>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem 
            onClick={() => {
              navigate('/admin/dashboard');
              setIsOpen(false);
            }}
            className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-nature-forest" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => {
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Settings className="w-4 w-4 text-gray-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
