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