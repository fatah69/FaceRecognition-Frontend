'use client';

import { useState, useEffect } from "react";

// Get the API URL from environment variables, with a fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  name: string;
  registrationDate: string;
}

interface UserImage {
  filename: string;
  registrationDate: string;
}

interface UserDetail {
  name: string;
  images: UserImage[];
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError(null);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        setEditName(data.name);
        setError(null);
      } else {
        setError("Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("An error occurred while fetching user details");
    }
  };

  const deleteUser = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_URL}/api/users/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
        if (selectedUser && selectedUser.name === name) {
          setSelectedUser(null);
        }
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("An error occurred while deleting the user");
    } finally {
      setIsDeleting(false);
    }
  };

  const updateUser = async (oldName: string) => {
    if (!editName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${oldName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
        if (selectedUser) {
          fetchUserDetails(editName.trim()); // Refresh the user details
        }
        setIsEditing(false);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("An error occurred while updating the user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <div className="flex items-center space-x-3">
            <a
              href="/register"
              className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Register Faces
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Attendance
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Registered Users</h2>
              <p className="text-slate-600 mt-1">Manage all registered users in the system</p>
            </div>
            
            <div className="p-5">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* User List */}
                  <div className="lg:col-span-1">
                    <div className="bg-slate-50 rounded-xl p-4 h-full">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">User List</h3>
                      {users.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          <h3 className="text-xl font-medium text-slate-600 mb-2">No Users Found</h3>
                          <p className="text-slate-500">
                            No users have been registered yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                          {users.map((user, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedUser && selectedUser.name === user.name
                                  ? "bg-sky-100 border border-sky-200"
                                  : "bg-white hover:bg-slate-100 border border-slate-200"
                              }`}
                              onClick={() => fetchUserDetails(user.name)}
                            >
                              <div className="font-medium text-slate-800">{user.name}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                Registered: {new Date(user.registrationDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* User Details */}
                  <div className="lg:col-span-2">
                    {selectedUser ? (
                      <div className="bg-slate-50 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800">{selectedUser.name}</h3>
                            <p className="text-slate-600 mt-1">
                              Registered on {new Date(selectedUser.images[0]?.registrationDate || selectedUser.images[0]?.registrationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => updateUser(selectedUser.name)}
                                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditName(selectedUser.name);
                                  }}
                                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setIsEditing(true)}
                                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L1.828 15H9v-2.828l8.586-8.586z"></path>
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteUser(selectedUser.name)}
                                  disabled={isDeleting}
                                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50"
                                >
                                  {isDeleting ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  )}
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {isEditing && (
                          <div className="mb-6">
                            <label htmlFor="editName" className="block text-sm font-medium text-slate-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              id="editName"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-slate-900"
                            />
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-slate-800 mb-3">Registered Images</h4>
                          {selectedUser.images.length === 0 ? (
                            <p className="text-slate-600">No images found for this user.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {selectedUser.images.map((image, index) => (
                                <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                  <div className="aspect-square flex items-center justify-center">
                                    <img 
                                      src={`${API_URL}/api/users/${selectedUser.name}/images/${image.filename}`}
                                      alt={`Registered face ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E";
                                      }}
                                    />
                                  </div>
                                  <div className="p-2">
                                    <div className="text-xs text-slate-500 truncate">
                                      {new Date(image.registrationDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-12 text-center h-full flex items-center justify-center">
                        <div>
                          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <h3 className="text-xl font-medium text-slate-600 mb-2">Select a User</h3>
                          <p className="text-slate-500 max-w-md">
                            Choose a user from the list to view details, edit information, or delete the user.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>Face Recognition Attendance System &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}