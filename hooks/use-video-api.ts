import { useApi } from "./use-api"

export function useVideoApi() {
  const { get, put, del, post, apiFetch } = useApi()

  // Get all videos
  const getVideos = () =>
    get("http://localhost:8000/api/v1/videos/")
      .then(res => res.json())
      .then(data => data.videos) // Extract the array

  // Upload video (FormData)
  const uploadVideo = (formData: FormData) =>
    apiFetch("http://localhost:8000/api/v1/videos/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type, browser will set it for FormData
    })

  // Get video by ID
  const getVideo = (videoId: string | number) =>
    get(`http://localhost:8000/api/v1/videos/${videoId}`).then(res => res.json())

  // Update video
  const updateVideo = (
    videoId: string | number,
    data: {
      title: string
      description: string
      weapon_type: string
      competition_name: string
      competition_date: string
      opponent_name: string
      score: string
      is_public: boolean
    }
  ) => put(`http://localhost:8000/api/v1/videos/${videoId}`, data)

  // Delete video
  const deleteVideo = (videoId: string | number) =>
    del(`http://localhost:8000/api/v1/videos/${videoId}`)

  // Update video status
  const updateVideoStatus = (videoId: string | number, newStatus: string) =>
    put(`http://localhost:8000/api/v1/videos/${videoId}/status?new_status=${encodeURIComponent(newStatus)}`, {})

  return {
    getVideos,
    uploadVideo,
    getVideo,
    updateVideo,
    deleteVideo,
    updateVideoStatus,
  }
}

// Set your FastAPI backend URL here
const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000/api/v1/videos";

export async function uploadVideo({
  file,
  title,
  description,
  athleteRight_id,
  athleteLeft_id,
  weapon_type,
  competition_name,
  competition_date,
  score,
  is_public = true,
  token,
}: {
  file: File,
  title: string,
  description?: string,
  athleteRight_id: number,
  athleteLeft_id?: number,
  weapon_type?: string,
  competition_name?: string,
  competition_date?: string,
  score?: string,
  is_public?: boolean,
  token?: string,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  if (description) formData.append('description', description);
  if (athleteRight_id) formData.append('athleteRight_id', String(athleteRight_id));
  if (athleteLeft_id) formData.append('athleteLeft_id', String(athleteLeft_id));
  if (weapon_type) formData.append('weapon_type', weapon_type);
  if (competition_name) formData.append('competition_name', competition_name);
  if (competition_date) formData.append('competition_date', competition_date);
  if (score) formData.append('score', score);
  formData.append('is_public', String(is_public));

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Log request details for debugging
  console.log('=== UPLOAD REQUEST DETAILS ===');
  console.log('URL:', `${BASE_URL}/upload`);
  console.log('Method: POST');
  console.log('Headers:', headers);
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    if (key === 'file') {
      console.log(`  ${key}:`, {
        name: (value as File).name,
        size: (value as File).size,
        type: (value as File).type
      });
    } else {
      console.log(`  ${key}:`, value);
    }
  }
  console.log('==============================');

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  console.log('=== RESPONSE DETAILS ===');
  console.log('Status:', res.status);
  console.log('Status Text:', res.statusText);
  console.log('Headers:', Object.fromEntries(res.headers.entries()));
  console.log('========================');

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
      console.log('=== ERROR RESPONSE BODY ===');
      console.log('Error data:', errorData);
      console.log('===========================');
    } catch (parseError) {
      console.log('Failed to parse error response as JSON:', parseError);
      errorData = {};
    }

    // Create a detailed error message
    const errorMessage = errorData.detail || 
                        errorData.message || 
                        errorData.error || 
                        `HTTP ${res.status}: ${res.statusText}`;
    
    // Log the full error context
    console.error('=== UPLOAD ERROR ===');
    console.error('Status:', res.status);
    console.error('Status Text:', res.statusText);
    console.error('Error Message:', errorMessage);
    console.error('Full Error Data:', errorData);
    console.error('===================');

    throw new Error(`Upload failed: ${errorMessage}`);
  }
  
  const responseData = await res.json();
  console.log('=== SUCCESS RESPONSE ===');
  console.log('Response data:', responseData);
  console.log('=======================');
  
  return responseData;
}

export async function fetchVideos({ token }: { token?: string }) {
  const res = await fetch(`http://localhost:8000/api/v1/videos/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération des vidéos');
  return await res.json();
}

export async function fetchVideoById(videoId: number, token?: string) {
  const res = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération de la vidéo');
  return await res.json();
}

export async function updateVideo(videoId: number, data: any, token?: string) {
  const res = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour de la vidéo');
  return await res.json();
}

export async function deleteVideo(videoId: number, token?: string) {
  const res = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression de la vidéo');
  return await res.json();
}

export async function updateVideoStatus(videoId: number, newStatus: string, token?: string) {
  const res = await fetch(`http://localhost:8000/api/v1/videos/${videoId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ new_status: newStatus }),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour du statut de la vidéo');
  return await res.json();
} 