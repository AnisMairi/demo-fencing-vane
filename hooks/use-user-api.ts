import { useApi } from "./use-api"

export function useUserApi() {
  const { get, put, del, post } = useApi()

  // Register user
  const register = (data: { email: string; password: string; [key: string]: any }) =>
    post("http://localhost:8000/api/v1/auth/register", data)

  // Get all users except administrators
  const getUsers = () =>
    get("http://localhost:8000/api/v1/users/")
      .then(res => res.json())
      .then(users => Array.isArray(users) ? users : users.users || users)
      .then(users => users.filter((u: any) => u.role !== "administrator"))

  // Get current user profile
  const getMe = () => get("http://localhost:8000/api/v1/users/me").then(res => res.json())

  // Update current user profile
  const updateMe = (data: {
    name: string
    phone: string
    club_name: string
    bio: string
    avatar_url: string
  }) => put("http://localhost:8000/api/v1/users/me", data)

  // Get user by ID
  const getUser = (userId: string | number) =>
    get(`http://localhost:8000/api/v1/users/${userId}`).then(res => res.json())

  // Delete user by ID
  const deleteUser = (userId: string | number) =>
    del(`http://localhost:8000/api/v1/users/${userId}`)

  // Update user status
  const updateUserStatus = (userId: string | number, newStatus: string) =>
    put(`http://localhost:8000/api/v1/users/${userId}/status?new_status=${encodeURIComponent(newStatus)}`, {})

  return {
    register,
    getUsers,
    getMe,
    updateMe,
    getUser,
    deleteUser,
    updateUserStatus,
  }
} 