// Updates fulfillment_status and tracking_number for a given order.
// Same password protection as admin-orders.js.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { orderId, fulfillment_status, tracking_number } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from('orders')
      .update({ fulfillment_status, tracking_number })
      .eq('id', orderId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
