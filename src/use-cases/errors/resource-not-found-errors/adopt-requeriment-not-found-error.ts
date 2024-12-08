export class AdoptRequerimentNotFoundError extends Error {
  constructor() {
    super('The adopt requeriment must exist')
  }
}
