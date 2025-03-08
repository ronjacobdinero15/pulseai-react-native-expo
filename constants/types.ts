export type SignInType = {
  email: string
  password: string
}

export type PasswordType = {
  patientId: string
  oldPassword: string
  newPassword: string
  confirmNewPassword?: string
}

export const apiUrl = process.env.EXPO_PUBLIC_DB_URL
