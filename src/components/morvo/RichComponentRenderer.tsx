
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, MousePointer } from 'lucide-react';
import { RichComponent } from '@/services/MorvoWebSocketService';

interface RichComponentRendererProps {
  components: RichComponent[];
  onAction?: (action: string) => void;
}

export const RichComponentRenderer = ({ components, onAction }: RichComponentRendererProps) => {
  if (!components || components.length === 0) return null;

  const handleAction = (action: string) => {
    console.log('🎯 Rich component action triggered:', action);
    onAction?.(action);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4" dir="rtl">
      {components.map((component, index) => {
        switch (component.type) {
          case 'button':
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => component.action && handleAction(component.action)}
                className="gap-2"
              >
                <MousePointer className="w-4 h-4" />
                {component.text}
              </Button>
            );

          case 'card':
            return (
              <Card key={index} className="w-full max-w-sm">
                <CardHeader className="pb-3">
                  {component.imageUrl && (
                    <img
                      src={component.imageUrl}
                      alt={component.title || ''}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  {component.title && (
                    <CardTitle className="text-lg">{component.title}</CardTitle>
                  )}
                </CardHeader>
                {component.description && (
                  <CardContent>
                    <CardDescription className="text-sm">
                      {component.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            );

          case 'link':
            return (
              <Button
                key={index}
                variant="link"
                size="sm"
                onClick={() => component.url && window.open(component.url, '_blank')}
                className="gap-2 p-0 h-auto"
              >
                <ExternalLink className="w-4 h-4" />
                {component.text}
              </Button>
            );

          default:
            return (
              <div key={index} className="text-sm text-gray-500">
                Unknown component type: {component.type}
              </div>
            );
        }
      })}
    </div>
  );
};
