import { useApi } from "./use-api"

// Types based on OpenAPI schema
export interface Evaluation {
  id: number
  athlete_id: number
  evaluator_id: number
  video_id: number
  technique_score?: number
  tactics_score?: number
  physical_score?: number
  mental_score?: number
  overall_score?: number
  strengths?: string
  areas_for_improvement?: string
  specific_feedback?: string
  recommendations?: string
  created_at: string
  updated_at?: string
  evaluator_name?: string
  athlete_name?: string
  video_title?: string
}

export interface EvaluationList {
  evaluations: Evaluation[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface EvaluationCreate {
  athlete_id: number
  technique_score?: number
  tactics_score?: number
  physical_score?: number
  mental_score?: number
  strengths?: string
  areas_for_improvement?: string
  specific_feedback?: string
  recommendations?: string
}

export interface EvaluationUpdate {
  technique_score?: number
  tactics_score?: number
  physical_score?: number
  mental_score?: number
  strengths?: string
  areas_for_improvement?: string
  specific_feedback?: string
  recommendations?: string
}

export interface EvaluationFilters {
  athlete_id?: number
  skip?: number
  limit?: number
}

export interface AdminEvaluationFilters {
  skip?: number
  limit?: number
  evaluator_id?: number
  athlete_id?: number
  video_id?: number
}

export function useEvaluationApi() {
  const { get, put, del, post } = useApi()

  // Create a new evaluation for an athlete on a video
  const createEvaluation = async (videoId: number, data: EvaluationCreate): Promise<Evaluation> => {
    const response = await post(`http://localhost:8000/api/v1/videos/${videoId}/evaluations`, data)
    return response.json()
  }

  // Get evaluations for a video
  const getVideoEvaluations = async (videoId: number, filters?: EvaluationFilters): Promise<EvaluationList> => {
    const params = new URLSearchParams()
    if (filters?.athlete_id !== undefined) params.append("athlete_id", filters.athlete_id.toString())
    if (filters?.skip !== undefined) params.append("skip", filters.skip.toString())
    if (filters?.limit !== undefined) params.append("limit", filters.limit.toString())

    const url = `http://localhost:8000/api/v1/videos/${videoId}/evaluations?${params.toString()}`
    const response = await get(url)
    return response.json()
  }

  // Get a specific evaluation by ID
  const getEvaluation = async (evaluationId: number): Promise<Evaluation> => {
    const response = await get(`http://localhost:8000/api/v1/evaluations/${evaluationId}`)
    return response.json()
  }

  // Update an evaluation
  const updateEvaluation = async (evaluationId: number, data: EvaluationUpdate): Promise<Evaluation> => {
    const response = await put(`http://localhost:8000/api/v1/evaluations/${evaluationId}`, data)
    return response.json()
  }

  // Delete an evaluation
  const deleteEvaluation = async (evaluationId: number): Promise<void> => {
    await del(`http://localhost:8000/api/v1/evaluations/${evaluationId}`)
  }

  // Get all evaluations for a specific athlete
  const getAthleteEvaluations = async (athleteId: number, filters?: { skip?: number; limit?: number }): Promise<EvaluationList> => {
    const params = new URLSearchParams()
    if (filters?.skip !== undefined) params.append("skip", filters.skip.toString())
    if (filters?.limit !== undefined) params.append("limit", filters.limit.toString())

    const url = `http://localhost:8000/api/v1/athletes/${athleteId}/evaluations?${params.toString()}`
    const response = await get(url)
    return response.json()
  }

  // Get all evaluations (coaches and admins only)
  const getAllEvaluations = async (filters?: AdminEvaluationFilters): Promise<EvaluationList> => {
    const params = new URLSearchParams()
    if (filters?.skip !== undefined) params.append("skip", filters.skip.toString())
    if (filters?.limit !== undefined) params.append("limit", filters.limit.toString())
    if (filters?.evaluator_id !== undefined) params.append("evaluator_id", filters.evaluator_id.toString())
    if (filters?.athlete_id !== undefined) params.append("athlete_id", filters.athlete_id.toString())
    if (filters?.video_id !== undefined) params.append("video_id", filters.video_id.toString())

    const url = `http://localhost:8000/api/v1/evaluations?${params.toString()}`
    const response = await get(url)
    return response.json()
  }

  return {
    createEvaluation,
    getVideoEvaluations,
    getEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getAthleteEvaluations,
    getAllEvaluations,
  }
} 