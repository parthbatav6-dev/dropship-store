// Verifies the Razorpay payment signature server-side, then marks the
// order as paid in Supabase using the SERVICE ROLE key (not the anon key —
// this bypasses RLS so we can update an order regardless of who created it).
//
// Set these in Vercel: Project Settings → Environment Variables
//   RAZORPAY_KEY_SECRET
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (find this in Supabase → Project Settings → API — keep it secret, server-side only)

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const verified = expectedSignature === razorpay_signature;

    if (verified) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          razorpay_payment_id,
        })
        .eq('id', dbOrderId);
    }

    return res.status(200).json({ verified });
  } catch (err) {
    return res.status(500).json({ verified: false, error: err.message });
  }
}
