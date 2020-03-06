export class User {
    constructor(
      public id: string,
      public email: string,
      public name: string,
      public departmentId: string,
      public companyId: string,
      // public token: string,
      public role: string,
      public status: string,
      public position: string,
      public department: string,
    ) { }
}
