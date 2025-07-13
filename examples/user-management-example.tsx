"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { usePermissions } from "@/lib/permissions"
import { useUserApi, type User, type UserFilters } from "@/hooks"

export default function UserManagementExample() {
  const { user: currentUser } = useAuth()
  const permissions = usePermissions(currentUser!)
  const userApi = useUserApi()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserFilters>({
    limit: 50,
    skip: 0
  })

  // Load users on component mount
  useEffect(() => {
    if (permissions.canManageUsers()) {
      loadUsers()
    }
  }, [filters])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the new function that automatically excludes other admins
      const userData = await userApi.getUsersExcludingAdmins(filters)
      setUsers(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserStatus = async (userId: number, newStatus: "active" | "suspended" | "pending") => {
    try {
      await userApi.updateUserStatus(userId, newStatus)
      // Reload users to reflect the change
      await loadUsers()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user status")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await userApi.deleteUser(userId)
      // Reload users to reflect the change
      await loadUsers()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
    }
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      skip: 0 // Reset pagination when searching
    }))
  }

  const handleRoleFilter = (role: "local_contact" | "coach" | "administrator" | "all") => {
    setFilters(prev => ({
      ...prev,
      role: role === "all" ? undefined : role,
      skip: 0 // Reset pagination when filtering
    }))
  }

  const handleStatusFilter = (status: "active" | "suspended" | "pending" | "all") => {
    setFilters(prev => ({
      ...prev,
      status: status === "all" ? undefined : status,
      skip: 0 // Reset pagination when filtering
    }))
  }

  if (!permissions.canManageUsers()) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You don't have permission to manage users.
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom, email..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              onChange={(e) => handleRoleFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="local_contact">Contact local</option>
              <option value="coach">Entraîneur</option>
              <option value="administrator">Administrateur</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              onChange={(e) => handleStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.avatar_url || "/placeholder-user.jpg"}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "administrator" 
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "coach"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.role === "administrator" && "Administrateur"}
                    {user.role === "coach" && "Entraîneur"}
                    {user.role === "local_contact" && "Contact local"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === "active" 
                      ? "bg-green-100 text-green-800"
                      : user.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.status === "active" && "Actif"}
                    {user.status === "pending" && "En attente"}
                    {user.status === "suspended" && "Suspendu"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {/* Status Actions */}
                  {user.status !== "active" && (
                    <button
                      onClick={() => handleUpdateUserStatus(user.id, "active")}
                      className="text-green-600 hover:text-green-900"
                    >
                      Activer
                    </button>
                  )}
                  {user.status !== "suspended" && (
                    <button
                      onClick={() => handleUpdateUserStatus(user.id, "suspended")}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Suspendre
                    </button>
                  )}
                  
                  {/* Delete Action - Don't allow deleting own account */}
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info about admin filtering */}
      {currentUser?.role === "administrator" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Note :</strong> Les autres administrateurs ne sont pas affichés dans cette liste pour des raisons de sécurité.
          </p>
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Affichage de {filters.skip! + 1} à {filters.skip! + users.length} utilisateurs
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, skip: Math.max(0, prev.skip! - prev.limit!) }))}
              disabled={filters.skip === 0}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, skip: prev.skip! + prev.limit! }))}
              disabled={users.length < filters.limit!}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 