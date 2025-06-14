
import { useEffect } from "react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAdminMonitoring = () => {
  const { user, isAdmin } = useEnhancedAuth();

  const logAdminAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    if (!isAdmin || !user) return;

    try {
      console.log('📊 Logging admin action:', { action, resourceType, resourceId });
      
      const { error } = await supabase.rpc('log_admin_activity', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId || null,
        p_details: details || {}
      });

      if (error) {
        console.error('❌ Failed to log admin activity:', error);
      }
    } catch (error) {
      console.error('❌ Error logging admin activity:', error);
    }
  };

  const trackPageView = (pageName: string) => {
    if (isAdmin) {
      logAdminAction('page_view', 'admin_page', pageName, {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      });
    }
  };

  const trackPortfolioAction = (action: string, itemId?: string, details?: Record<string, any>) => {
    if (isAdmin) {
      logAdminAction(action, 'portfolio_item', itemId, details);
    }
  };

  useEffect(() => {
    // Track admin session start
    if (isAdmin && user) {
      logAdminAction('admin_session_start', 'session', undefined, {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        email: user.email
      });

      // Track session end on unmount
      return () => {
        logAdminAction('admin_session_end', 'session', undefined, {
          timestamp: new Date().toISOString()
        });
      };
    }
  }, [isAdmin, user]);

  return {
    logAdminAction,
    trackPageView,
    trackPortfolioAction
  };
};
