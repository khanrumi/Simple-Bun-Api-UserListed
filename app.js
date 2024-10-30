import { serve } from 'bun';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpmbzvtclcpvaxnlhkfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbWJ6dnRjbGNwdmF4bmxoa2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNzcyMjYsImV4cCI6MjA0NTg1MzIyNn0.lphQkUDhgoJchh12LFwW9z2Qhcw3OnYbqQjUVn155CQ';
const supabase = createClient(supabaseUrl, supabaseKey);

serve({
  async fetch(req) {
    if (req.method === 'POST' && req.url.endsWith('/upload')) {
      const formData = await req.formData();
      const name = formData.get('name');
      const location = formData.get('location');
      const joiningTime = formData.get('joiningTime');
      const file = formData.get('file');
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
      }

      const filePath = `uploads/${file.name}`;
      
      // Upload file to Supabase Storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('users') // Replace with your storage bucket name
        .upload(filePath, file.stream());
      
      if (fileError) {
        return new Response(JSON.stringify({ error: fileError.message }), { status: 400 });
      }

      // Insert user data into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, location, joining_time: joiningTime, file_url: fileData?.path }]);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ data }), { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");
