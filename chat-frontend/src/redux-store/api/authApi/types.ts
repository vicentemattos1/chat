export interface ApiError {
  message: string
  status: number
  data?: any
}

export interface SignUserBody {
  username: string
  password: string
}

export interface RegisterUserBody {
  username: string
  password: string
  email: string
}

export interface SignUserResponse {
  access_token: string
  token_type: string
}
