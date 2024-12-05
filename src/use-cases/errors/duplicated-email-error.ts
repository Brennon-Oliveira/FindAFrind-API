export class DuplicatedEmailError extends Error {
  constructor() {
    super('Email is duplicated')
  }
}
