import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93c83ab0`;

// Create Supabase client for auth
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// ============ AUTH API ============

export async function signUp(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign up failed');
  }

  return response.json();
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Get auth token for API calls
async function getAuthToken() {
  const session = await getSession();
  return session?.access_token || publicAnonKey;
}

// ============ WORK ARCHIVE API ============

export async function getWorks() {
  const response = await fetch(`${API_BASE}/works`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch works');
  }

  const data = await response.json();
  return data.works;
}

export async function addWork(workData: any, thumbnailFile: File | null, imageFiles: File[]) {
  const token = await getAuthToken();
  const formData = new FormData();
  
  formData.append('data', JSON.stringify(workData));
  
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }
  
  if (imageFiles.length > 0) {
    formData.append('images', 'true');
    imageFiles.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
  }

  const response = await fetch(`${API_BASE}/works`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add work');
  }

  return response.json();
}

export async function updateWork(workId: string, workData: any, thumbnailFile: File | null, imageFiles: File[]) {
  const token = await getAuthToken();
  const formData = new FormData();
  
  formData.append('data', JSON.stringify(workData));
  
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }
  
  if (imageFiles.length > 0) {
    formData.append('images', 'true');
    imageFiles.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
  }

  const response = await fetch(`${API_BASE}/works/${workId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update work');
  }

  return response.json();
}

export async function deleteWork(workId: string) {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE}/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete work');
  }

  return response.json();
}

// ============ EQUIPMENT API ============

export async function getEquipment() {
  const response = await fetch(`${API_BASE}/equipment`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch equipment');
  }

  const data = await response.json();
  return data.equipment;
}

export async function addEquipment(equipmentData: any, imageFile: File | null) {
  const token = await getAuthToken();
  const formData = new FormData();
  
  formData.append('data', JSON.stringify(equipmentData));
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add equipment');
  }

  return response.json();
}

export async function updateEquipment(equipmentId: string, equipmentData: any, imageFile: File | null) {
  const token = await getAuthToken();
  const formData = new FormData();
  
  formData.append('data', JSON.stringify(equipmentData));
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE}/equipment/${equipmentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update equipment');
  }

  return response.json();
}

export async function deleteEquipment(equipmentId: string) {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE}/equipment/${equipmentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete equipment');
  }

  return response.json();
}
