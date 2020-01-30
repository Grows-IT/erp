export class User {
    constructor(
      public id: string,
      public email: string,
      public token: string,
      public role: string,
      public status: string
    ) { }
}
