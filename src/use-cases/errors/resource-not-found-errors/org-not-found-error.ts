export class OrgNotFoundError extends Error {
  constructor() {
    super('The ORG must exist')
  }
}
