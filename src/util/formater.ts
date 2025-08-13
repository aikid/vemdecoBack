const returnStringMessage = (info: number) => {
  if (info !== undefined) {
    return info.toString()
  }
  return ''
}

export { returnStringMessage }
