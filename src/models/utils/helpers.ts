export const hasLowerCase = (str: string) => {
  return str.toUpperCase() !== str
}

export const hasUpperCase = (str: string) => {
  return str.toLowerCase() !== str
}

export const hasNumber = (string: string) => {
  return /\d/.test(string)
}

export const hasSpecialChar = (str: string) => {
  var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/
  if (format.test(str)) {
    return true
  } else {
    return false
  }
}

export const isPasswordSafe = (password: string) => {
  if (
    hasSpecialChar(password) &&
    hasNumber(password) &&
    hasUpperCase(password) &&
    hasLowerCase(password)
  ) {
    return true
  }
  throw new Error('Password not valid')
}
