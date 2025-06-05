
import { handleRailwayWebhook, RailwayWebhookEvent } from '@/api/webhooks/railwayWebhook';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookEvent: RailwayWebhookEvent = req.body;
    
    // Validate the webhook payload
    if (!webhookEvent.type || !webhookEvent.status || !webhookEvent.project) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    console.log('🚂 Processing Railway webhook:', webhookEvent.type, webhookEvent.status);
    
    const result = await handleRailwayWebhook(webhookEvent);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error processing Railway webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
