const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types
export interface User {
  id: number
  email: string
  name?: string
  createdAt?: string
  updatedAt?: string
}

export interface Song {
  id: number
  title: string
  artist: string[]
  album: string
  genre?: string
  releaseDate: string
  duration: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ApiError {
  message: string | string[]
  error?: string
  statusCode: number
}

// API Client Class
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message)
    }
    return response.json()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    return this.handleResponse<T>(response)
  }

  // Set token for authenticated requests
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  // Clear token
  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }, false)
    
    this.setToken(response.access_token)
    return response
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false)
    
    this.setToken(response.access_token)
    return response
  }

// Neon Auth
// 1. Send the Neon access token, project ID, and server key to your backend
// 2. Your backend will validate these credentials
// 3. Upon successful validation, it will return a JWT token
// 4. The API client will automatically store this JWT token for future authenticated requests
  async neonAuth(accessToken: string): Promise<AuthResponse> {
    const projectId = process.env.NEXT_PUBLIC_NEON_PROJECT_ID
    const serverKey = process.env.NEXT_PUBLIC_NEON_SERVER_KEY
    
    if (!projectId || !serverKey) {
      throw new Error('Neon Auth configuration is missing')
    }

    const response = await this.request<AuthResponse>('/auth/neon', {
      method: 'POST',
      headers: {
        'x-stack-access-type': 'server',
        'x-stack-project-id': projectId,
        'x-stack-secret-server-key': serverKey,
        'x-stack-access-token': accessToken
      }
    }, false)
    
    this.setToken(response.access_token)
    return response
  }

  async googleAuth(token: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token })
    }, false)

    this.setToken(response.access_token)
    return response
  }

  async githubAuth(code: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code })
    }, false)

    this.setToken(response.access_token)
    return response
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile')
  }

  // Songs endpoints
  async createSong(song: Omit<Song, 'id'>): Promise<Song> {
    return this.request<Song>('/songs', {
      method: 'POST',
      body: JSON.stringify(song),
    })
  }

  async getAllSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs')
  }

  async getSongById(id: number): Promise<Song> {
    return this.request<Song>(`/songs/${id}`)
  }

  async updateSong(id: number, song: Partial<Song>): Promise<Song> {
    return this.request<Song>(`/songs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(song),
    })
  }

  async deleteSong(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/songs/${id}`, {
      method: 'DELETE',
    })
  }

  async searchSongs(query: string): Promise<Song[]> {
    return this.request<Song[]>(`/songs/search?q=${encodeURIComponent(query)}`)
  }

  async getSongsByGenre(genre: string): Promise<Song[]> {
    return this.request<Song[]>(`/songs/genre/${encodeURIComponent(genre)}`)
  }

  async getSongsByArtist(artist: string): Promise<Song[]> {
    return this.request<Song[]>(`/songs/artist/${encodeURIComponent(artist)}`)
  }

  async getSongsByAlbum(album: string): Promise<Song[]> {
    return this.request<Song[]>(`/songs/album/${encodeURIComponent(album)}`)
  }

  async getPopularSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs/popular')
  }

  async getRecentSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs/recent')
  }

  async getTopSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs/top')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
