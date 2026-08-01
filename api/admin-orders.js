// Returns all orders with their line items, for the admin page.
// Protected by a shared password (ADMIN_PASSWORD env var) — not full
// authentication, but enough to keep this off public view. Never expose
// the Supabase service role key to the browser; it only lives here.
//
// Set in Vercel: Project Settings → Environment Variables
//   ADMIN_PASSWORD
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ orders: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
