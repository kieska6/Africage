// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!
    )
  } catch (err) {
    console.error(err.message)
    return new Response(err.message, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const product_id = lineItems.data[0].price?.product as string

    if (!userId) {
      console.error('No userId in checkout session')
      return new Response('Webhook Error: No userId', { status: 400 })
    }

    // Déterminez combien de tokens ajouter en fonction du produit acheté
    let tokensToAdd = 0;
    if (product_id === 'prod_SjVnqXIJqtlej7') { // Pack Découverte
      tokensToAdd = 1;
    } else if (product_id === 'prod_SjVoF9FTWbHX2D') { // Pack Avantage
      tokensToAdd = 5;
    } else if (product_id === 'prod_SjVx6UIeCx970t') { // Pack Premium
      tokensToAdd = 12;
    }

    if (tokensToAdd > 0) {
      // Utilise une fonction RPC pour ajouter les tokens de manière atomique
      const { error } = await supabaseAdmin.rpc('add_tokens_to_user', {
        user_id_input: userId,
        tokens_to_add: tokensToAdd
      })

      if (error) {
        console.error('Error updating token balance:', error)
        return new Response('Error updating token balance', { status: 500 })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})