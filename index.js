import { serve } from 'bun';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = 'https://zpmbzvtclcpvaxnlhkfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbWJ6dnRjbGNwdmF4bmxoa2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNzcyMjYsImV4cCI6MjA0NTg1MzIyNn0.lphQkUDhgoJchh12LFwW9z2Qhcw3OnYbqQjUVn155CQ';
const supabase = createClient(supabaseUrl, supabaseKey);

serve({
  async fetch(req) {
    console.log("Received request:", req.method, req.url); // Log each request

    if (req.method === 'POST') {
      const { name, location, joiningTime } = await req.json();
      console.log("Received data:", { name, location, joiningTime });

      // Save to Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, location, joining_time: joiningTime }]);

      if (error) {
        console.error("Error saving to Supabase:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ data }), { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  },
  port: 3000,
});

console.log("Server is running on http://localhost:3000");