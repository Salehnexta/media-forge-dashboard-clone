
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MousePointer, AlertTriangle, Bell } from 'lucide-react';
import { RichComponent } from '@/services/MorvoPollingService';

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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'حرج';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'عادي';
    }
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

          case 'alert_card':
            return (
              <Card 
                key={index} 
                className={`w-full max-w-md border-2 ${getPriorityColor(component.priority)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(component.priority)}
                      <CardTitle className="text-base">{component.title}</CardTitle>
                    </div>
                    {component.priority && (
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          component.priority === 'critical' ? 'border-red-500 text-red-700' :
                          component.priority === 'high' ? 'border-orange-500 text-orange-700' :
                          component.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                          component.priority === 'low' ? 'border-green-500 text-green-700' :
                          'border-blue-500 text-blue-700'
                        }`}
                      >
                        {getPriorityText(component.priority)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {component.description}
                  </CardDescription>
                  
                  <div className="flex gap-2">
                    {component.action_button && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => component.action_button?.action && handleAction(component.action_button.action)}
                        className="flex-1"
                      >
                        {component.action_button.text}
                      </Button>
                    )}
                    
                    {component.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(component.url, '_blank')}
                        className="gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        التفاصيل
                      </Button>
                    )}
                  </div>
                </CardContent>
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
