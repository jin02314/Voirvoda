import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create storage bucket on startup
const WORKS_BUCKET = 'make-93c83ab0-works';
const EQUIPMENT_BUCKET = 'make-93c83ab0-equipment';
const ABOUT_BUCKET = 'make-93c83ab0-about';

async function initBuckets() {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  const worksBucketExists = buckets?.some(bucket => bucket.name === WORKS_BUCKET);
  if (!worksBucketExists) {
    await supabase.storage.createBucket(WORKS_BUCKET, { public: false });
    console.log(`Created bucket: ${WORKS_BUCKET}`);
  }
  
  const equipmentBucketExists = buckets?.some(bucket => bucket.name === EQUIPMENT_BUCKET);
  if (!equipmentBucketExists) {
    await supabase.storage.createBucket(EQUIPMENT_BUCKET, { public: false });
    console.log(`Created bucket: ${EQUIPMENT_BUCKET}`);
  }

  const aboutBucketExists = buckets?.some(bucket => bucket.name === ABOUT_BUCKET);
  if (!aboutBucketExists) {
    await supabase.storage.createBucket(ABOUT_BUCKET, { public: false });
    console.log(`Created bucket: ${ABOUT_BUCKET}`);
  }
}

initBuckets().catch(console.error);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify auth
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-93c83ab0/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ENDPOINTS ============

// Sign up endpoint
app.post("/make-server-93c83ab0/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Sign up failed' }, 500);
  }
});

// ============ WORK ARCHIVE ENDPOINTS ============

// Get all works
app.get("/make-server-93c83ab0/works", async (c) => {
  try {
    const works = await kv.getByPrefix('work:');
    return c.json({ works });
  } catch (error) {
    console.error('Error fetching works:', error);
    return c.json({ error: 'Failed to fetch works' }, 500);
  }
});

// Add work
app.post("/make-server-93c83ab0/works", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const workData = JSON.parse(formData.get('data') as string);
    const workId = `work:${Date.now()}`;
    
    // Upload thumbnail
    if (formData.has('thumbnail')) {
      const thumbnail = formData.get('thumbnail') as File;
      const thumbnailPath = `${workId}/thumbnail-${Date.now()}.${thumbnail.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from(WORKS_BUCKET)
        .upload(thumbnailPath, thumbnail);
      
      if (error) {
        console.error('Thumbnail upload error:', error);
        return c.json({ error: 'Failed to upload thumbnail' }, 500);
      }
      
      const { data: signedData } = await supabase.storage
        .from(WORKS_BUCKET)
        .createSignedUrl(thumbnailPath, 31536000); // 1 year
      
      workData.thumbnail = signedData?.signedUrl;
    }
    
    // Upload images for photo type
    if (workData.type === 'photo' && formData.has('images')) {
      const imageUrls = [];
      let imageIndex = 0;
      
      while (formData.has(`image_${imageIndex}`)) {
        const image = formData.get(`image_${imageIndex}`) as File;
        const imagePath = `${workId}/image-${imageIndex}-${Date.now()}.${image.name.split('.').pop()}`;
        
        const { error } = await supabase.storage
          .from(WORKS_BUCKET)
          .upload(imagePath, image);
        
        if (error) {
          console.error(`Image ${imageIndex} upload error:`, error);
        } else {
          const { data: signedData } = await supabase.storage
            .from(WORKS_BUCKET)
            .createSignedUrl(imagePath, 31536000);
          
          if (signedData) {
            imageUrls.push(signedData.signedUrl);
          }
        }
        
        imageIndex++;
      }
      
      workData.images = imageUrls;
    }
    
    await kv.set(workId, workData);
    
    return c.json({ work: workData, id: workId });
  } catch (error) {
    console.error('Error adding work:', error);
    return c.json({ error: 'Failed to add work' }, 500);
  }
});

// Update work
app.put("/make-server-93c83ab0/works/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workId = c.req.param('id');
    const formData = await c.req.formData();
    const workData = JSON.parse(formData.get('data') as string);
    
    // Get existing work
    const existingWork = await kv.get(workId);
    
    // Upload new thumbnail if provided
    if (formData.has('thumbnail')) {
      const thumbnail = formData.get('thumbnail') as File;
      const thumbnailPath = `${workId}/thumbnail-${Date.now()}.${thumbnail.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from(WORKS_BUCKET)
        .upload(thumbnailPath, thumbnail);
      
      if (!error) {
        const { data: signedData } = await supabase.storage
          .from(WORKS_BUCKET)
          .createSignedUrl(thumbnailPath, 31536000);
        
        workData.thumbnail = signedData?.signedUrl;
      }
    } else if (existingWork) {
      workData.thumbnail = existingWork.thumbnail;
    }
    
    // Upload new images if provided
    if (workData.type === 'photo' && formData.has('images')) {
      const imageUrls = [];
      let imageIndex = 0;
      
      while (formData.has(`image_${imageIndex}`)) {
        const image = formData.get(`image_${imageIndex}`) as File;
        const imagePath = `${workId}/image-${imageIndex}-${Date.now()}.${image.name.split('.').pop()}`;
        
        const { error } = await supabase.storage
          .from(WORKS_BUCKET)
          .upload(imagePath, image);
        
        if (!error) {
          const { data: signedData } = await supabase.storage
            .from(WORKS_BUCKET)
            .createSignedUrl(imagePath, 31536000);
          
          if (signedData) {
            imageUrls.push(signedData.signedUrl);
          }
        }
        
        imageIndex++;
      }
      
      workData.images = imageUrls;
    } else if (existingWork) {
      workData.images = existingWork.images;
    }
    
    await kv.set(workId, workData);
    
    return c.json({ work: workData });
  } catch (error) {
    console.error('Error updating work:', error);
    return c.json({ error: 'Failed to update work' }, 500);
  }
});

// Delete work
app.delete("/make-server-93c83ab0/works/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workId = c.req.param('id');
    
    // Delete files from storage
    const { data: files } = await supabase.storage
      .from(WORKS_BUCKET)
      .list(workId);
    
    if (files && files.length > 0) {
      const filePaths = files.map(file => `${workId}/${file.name}`);
      await supabase.storage
        .from(WORKS_BUCKET)
        .remove(filePaths);
    }
    
    await kv.del(workId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting work:', error);
    return c.json({ error: 'Failed to delete work' }, 500);
  }
});

// ============ EQUIPMENT ENDPOINTS ============

// Get all equipment
app.get("/make-server-93c83ab0/equipment", async (c) => {
  try {
    const equipment = await kv.getByPrefix('equipment:');
    return c.json({ equipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return c.json({ error: 'Failed to fetch equipment' }, 500);
  }
});

// Add equipment
app.post("/make-server-93c83ab0/equipment", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const equipmentData = JSON.parse(formData.get('data') as string);
    const equipmentId = `equipment:${Date.now()}`;
    
    // Upload image
    if (formData.has('image')) {
      const image = formData.get('image') as File;
      const imagePath = `${equipmentId}/image-${Date.now()}.${image.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from(EQUIPMENT_BUCKET)
        .upload(imagePath, image);
      
      if (!error) {
        const { data: signedData } = await supabase.storage
          .from(EQUIPMENT_BUCKET)
          .createSignedUrl(imagePath, 31536000);
        
        equipmentData.image = signedData?.signedUrl;
      }
    }
    
    await kv.set(equipmentId, equipmentData);
    
    return c.json({ equipment: equipmentData, id: equipmentId });
  } catch (error) {
    console.error('Error adding equipment:', error);
    return c.json({ error: 'Failed to add equipment' }, 500);
  }
});

// Update equipment
app.put("/make-server-93c83ab0/equipment/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const equipmentId = c.req.param('id');
    const formData = await c.req.formData();
    const equipmentData = JSON.parse(formData.get('data') as string);
    
    // Get existing equipment
    const existingEquipment = await kv.get(equipmentId);
    
    // Upload new image if provided
    if (formData.has('image')) {
      const image = formData.get('image') as File;
      const imagePath = `${equipmentId}/image-${Date.now()}.${image.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from(EQUIPMENT_BUCKET)
        .upload(imagePath, image);
      
      if (!error) {
        const { data: signedData } = await supabase.storage
          .from(EQUIPMENT_BUCKET)
          .createSignedUrl(imagePath, 31536000);
        
        equipmentData.image = signedData?.signedUrl;
      }
    } else if (existingEquipment) {
      equipmentData.image = existingEquipment.image;
    }
    
    await kv.set(equipmentId, equipmentData);
    
    return c.json({ equipment: equipmentData });
  } catch (error) {
    console.error('Error updating equipment:', error);
    return c.json({ error: 'Failed to update equipment' }, 500);
  }
});

// Delete equipment
app.delete("/make-server-93c83ab0/equipment/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const equipmentId = c.req.param('id');
    
    // Delete files from storage
    const { data: files } = await supabase.storage
      .from(EQUIPMENT_BUCKET)
      .list(equipmentId);
    
    if (files && files.length > 0) {
      const filePaths = files.map(file => `${equipmentId}/${file.name}`);
      await supabase.storage
        .from(EQUIPMENT_BUCKET)
        .remove(filePaths);
    }
    
    await kv.del(equipmentId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return c.json({ error: 'Failed to delete equipment' }, 500);
  }
});

// ============ CONTACT INFO ENDPOINTS ============

// Get contact info
app.get("/make-server-93c83ab0/contact", async (c) => {
  try {
    const contact = await kv.get('contact:info') || {
      email: '',
      phone: '',
      address: '',
      website: '',
      instagram: '',
      youtube: '',
      additionalInfo: ''
    };
    return c.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return c.json({ error: 'Failed to fetch contact info' }, 500);
  }
});

// Update contact info
app.put("/make-server-93c83ab0/contact", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contactData = await c.req.json();
    await kv.set('contact:info', contactData);
    
    return c.json({ contact: contactData });
  } catch (error) {
    console.error('Error updating contact:', error);
    return c.json({ error: 'Failed to update contact info' }, 500);
  }
});

// ============ ABOUT INFO ENDPOINTS ============

// Get about info
app.get("/make-server-93c83ab0/about", async (c) => {
  try {
    const about = await kv.get('about:info') || {
      title: '',
      subtitle: '',
      bio: '',
      experience: '',
      skills: '',
      achievements: '',
      profileImage: ''
    };
    return c.json({ about });
  } catch (error) {
    console.error('Error fetching about:', error);
    return c.json({ error: 'Failed to fetch about info' }, 500);
  }
});

// Update about info
app.put("/make-server-93c83ab0/about", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const aboutData = JSON.parse(formData.get('data') as string);
    
    // Get existing about info
    const existingAbout = await kv.get('about:info');
    
    // Upload new profile image if provided
    if (formData.has('image')) {
      const image = formData.get('image') as File;
      const imagePath = `profile/image-${Date.now()}.${image.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from(ABOUT_BUCKET)
        .upload(imagePath, image);
      
      if (!error) {
        const { data: signedData } = await supabase.storage
          .from(ABOUT_BUCKET)
          .createSignedUrl(imagePath, 31536000);
        
        aboutData.profileImage = signedData?.signedUrl;
      }
    } else if (existingAbout) {
      aboutData.profileImage = existingAbout.profileImage;
    }
    
    await kv.set('about:info', aboutData);
    
    return c.json({ about: aboutData });
  } catch (error) {
    console.error('Error updating about:', error);
    return c.json({ error: 'Failed to update about info' }, 500);
  }
});

Deno.serve(app.fetch);