
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CommandSuggestion {
  command: string;
  description: string;
}

interface CommandSuggestionsProps {
  suggestions: CommandSuggestion[];
  onSelect: (command: string) => void;
}

export const CommandSuggestions = ({ suggestions, onSelect }: CommandSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-2 max-w-md">
      <CardContent className="p-3">
        <div className="text-xs text-gray-600 mb-2">الأوامر المتاحة:</div>
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-right h-auto py-2"
              onClick={() => onSelect(suggestion.command)}
            >
              <div className="text-right">
                <div className="font-medium text-sm">{suggestion.command}</div>
                <div className="text-xs text-gray-500">{suggestion.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
