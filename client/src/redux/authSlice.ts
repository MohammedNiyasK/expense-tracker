import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface AuthState {
  userData: UserDataType | null
  refreshToken: string | null
  accessToken: string | null
  signInError: string | null
  signUpError: string[]
  successMessage: string | null
}

interface UserDataType {
  // Properties of userData
}
