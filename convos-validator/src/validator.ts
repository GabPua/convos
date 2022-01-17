export function isBlank(str: string): boolean {
  return str === null || !str.trim()
}

export function isValidPassword(password: string): boolean {
  const re = /^(?=.*?[a-zA-Z])(?=.*?[0-9~\`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]).{5,}$/g
  return isBlank(password) ? false : re.test(password)
}

export function isValidGroupName(name: string): boolean {
  return !isBlank(name) && name.length <= 20
}

export function isValidName(name: string): boolean {
  return !isBlank(name) && name.length <= 15
}

export function isValidEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const passwordErrorMessage = "Password must be at least 5 characters long with at least one letter and at least one special character/digit"

export const usernameErrorMessage = "Username must not be blank nor exceed 15 characters"

export const groupNameErrorMessage = "Group name must not be blank nor exceed 20 characters"
