export type SignInType = {
  email: string
  password: string
  action: string
}

export type PasswordType = {
  doctorId?: string
  patientId?: string
  oldPassword: string
  newPassword: string
  // confirmNewPassword?: string
}

export type PatientType = {
  fullName: string
  patientId: string
}
