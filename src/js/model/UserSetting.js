export class UserSetting {
  constructor(showCodes, darkMode, recordsPerPage, toUpdate = false) {
    this.showCodes = showCodes;
    this.darkMode = darkMode;
    this.recordsPerPage = recordsPerPage;
    this.toUpdate = toUpdate;
  }

  static fromJson(json) {
    return new UserSetting(
        json.show_codes,
        json.dark_mode,
        json.records_per_page
      );
  }

  copyWith({ showCodes = null, darkMode = null, recordsPerPage = null } = {}) {
    return new UserSetting(
      showCodes === null ? this.showCodes : showCodes,
      darkMode === null ? this.darkMode : darkMode,
      recordsPerPage === null ? this.recordsPerPage : recordsPerPage,
      true
    );
  }
}
