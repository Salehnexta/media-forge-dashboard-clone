
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleVisualizationError } from './visualizationUtils';

interface UseRealtimeSubscriptionsProps {
  onTemplatesChange: () => Promise<void>;
  onPreferencesChange: () => Promise<void>;
  onLayoutsChange: () => Promise<void>;
}

export const useRealtimeSubscriptions = ({
  onTemplatesChange,
  onPreferencesChange,
  onLayoutsChange
}: UseRealtimeSubscriptionsProps) => {
  useEffect(() => {
    const setupSubscriptions = () => {
      try {
        const templatesChannel = supabase
          .channel('chart_templates_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'chart_templates'
          }, () => {
            onTemplatesChange();
          })
          .subscribe();

        const preferencesChannel = supabase
          .channel('preferences_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'visualization_preferences'
          }, () => {
            onPreferencesChange();
          })
          .subscribe();

        const layoutsChannel = supabase
          .channel('layouts_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'dashboard_layouts'
          }, () => {
            onLayoutsChange();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(templatesChannel);
          supabase.removeChannel(preferencesChannel);
          supabase.removeChannel(layoutsChannel);
        };
      } catch (error) {
        handleVisualizationError(error, 'إعداد المراقبة المباشرة');
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, [onTemplatesChange, onPreferencesChange, onLayoutsChange]);
};
