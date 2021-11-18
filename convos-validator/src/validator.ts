export function isBlank(str : string) : boolean {
  return str === null || !str.trim()
}

export function isValidPassword(password : string) : boolean {
  const re = /^(?=.*?[a-zA-Z])(?=.*?[0-9~\`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]).{5,}$/g
  return isBlank(password) ? false : re.test(password)
}

export function isValidName(name : string) : boolean{
  return !isBlank(name)
}

export function isValidEmail(email: string) : boolean {
  const re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
