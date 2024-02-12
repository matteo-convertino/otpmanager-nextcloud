export class UserSetting {
  constructor(showCodes, darkMode, recordsPerPage, password = "", passwordHash = "", iv = "", toUpdate = false) {
    this.showCodes = showCodes;
    this.darkMode = darkMode;
    this.recordsPerPage = recordsPerPage;
    this.password = password;
    this.passwordHash = passwordHash;
    this.iv = iv;
    this.toUpdate = toUpdate;
  }

  static fromJson(json) {
    return new UserSetting(
        json.show_codes,
        json.dark_mode,
        json.records_per_page
      );
  }

  copyWith({ showCodes = null, darkMode = null, recordsPerPage = null, password = null, passwordHash = null, iv = null } = {}) {    
    return new UserSetting(
      showCodes === null ? this.showCodes : showCodes,
      darkMode === null ? this.darkMode : darkMode,
      recordsPerPage === null ? this.recordsPerPage : recordsPerPage,
      password == null ? this.password : password,
      passwordHash == null ? this.passwordHash : passwordHash,
      iv == null ? this.iv : iv,
      true
    );
  }
}
