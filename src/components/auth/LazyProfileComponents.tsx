
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load profile components for better performance
const UserProfileDropdown = lazy(() => import('./UserProfileDropdown'));
const AuthCard = lazy(() => import('./AuthCard'));
const SocialButton = lazy(() => import('./SocialButton'));

// Loading fallbacks
export const ProfileDropdownSkeleton = () => (
  <div className="w-10 h-10 rounded-full">
    <Skeleton className="w-full h-full rounded-full" />
  </div>
);

export const AuthCardSkeleton = () => (
  <div className="w-full max-w-md mx-auto">
    <Skeleton className="w-full h-96 rounded-2xl" />
  </div>
);

export const SocialButtonSkeleton = () => (
  <Skeleton className="w-full h-12 rounded-full" />
);

// Lazy wrapped components with suspense boundaries
export const LazyUserProfileDropdown: React.FC<any> = (props) => (
  <Suspense fallback={<ProfileDropdownSkeleton />}>
    <UserProfileDropdown {...props} />
  </Suspense>
);

export const LazyAuthCard: React.FC<any> = (props) => (
  <Suspense fallback={<AuthCardSkeleton />}>
    <AuthCard {...props} />
  </Suspense>
);

export const LazySocialButton: React.FC<any> = (props) => (
  <Suspense fallback={<SocialButtonSkeleton />}>
    <SocialButton {...props} />
  </Suspense>
);

LazyUserProfileDropdown.displayName = 'LazyUserProfileDropdown';
LazyAuthCard.displayName = 'LazyAuthCard';
LazySocialButton.displayName = 'LazySocialButton';
