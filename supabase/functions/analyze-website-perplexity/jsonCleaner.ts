
export const cleanJsonResponse = (content: string): string => {
  console.log('Original content:', content);
  
  // إزالة markdown code blocks
  let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // إزالة أي نص قبل أو بعد JSON
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  console.log('Cleaned content:', cleaned);
  return cleaned;
};
