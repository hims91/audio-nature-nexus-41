
import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, Activity } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useNavigate } from 'react-router-dom';
import InteractiveButton from '@/components/interactive/InteractiveButton';
import OptimizedAvatar from '@/components/performance/OptimizedAvatar';
import { sanitizeText } from '@/utils/security';

const UserProfileDropdown: React.FC = () => {
  const { user, signOut } = useEnhancedAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  const fullName = firstName && lastName 
    ? sanitizeText(`${firstName} ${lastName}`)
    : sanitizeText(user.user_metadata?.full_name || 'User');
  
  const userInitials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : (user.email?.[0]?.toUpperCase() || 'U');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <InteractiveButton
          variant="ghost"
          className="w-10 h-10 rounded-full p-0 bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          hapticType="selection"
        >
          <OptimizedAvatar
            src={user.user_metadata?.avatar_url}
            alt={fullName}
            fallbackText={userInitials}
            size="md"
            priority
          />
        </InteractiveButton>
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
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {sanitizeText(user.email || '')}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={() => {
            navigate('/profile');
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <User className="w-4 h-4 text-gray-500" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => {
            navigate('/manage-portfolio');
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-gray-500" />
          <span>Manage Portfolio</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => {
            navigate('/settings');
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => {
            navigate('/sessions');
            setIsOpen(false);
          }}
          className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Activity className="w-4 h-4 text-gray-500" />
          <span>Active Sessions</span>
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
