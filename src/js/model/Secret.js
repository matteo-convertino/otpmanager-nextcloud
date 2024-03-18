export class Secret {
    constructor(
      password = "",
      passwordHash = "",
      iv = "",
    ) {
      this.password = password;
      this.passwordHash = passwordHash;
      this.iv = iv;
    }
  
    copyWith({
      password = null,
      passwordHash = null,
      iv = null,
    } = {}) {
      return new Secret(
        password == null ? this.password : password,
        passwordHash == null ? this.passwordHash : passwordHash,
        iv == null ? this.iv : iv,
      );
    }
  }
  