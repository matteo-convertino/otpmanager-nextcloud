export class UserSetting {
  private readonly showCodes: boolean;
  private readonly darkMode: boolean | null;
  private readonly recordsPerPage: string;
  readonly toUpdate: boolean;

  constructor(
    showCodes: boolean,
    darkMode: boolean | null,
    recordsPerPage: string,
    toUpdate: boolean = false
  ) {
    this.showCodes = showCodes;
    this.darkMode = darkMode;
    this.recordsPerPage = recordsPerPage;
    this.toUpdate = toUpdate;
  }

  /*fromJson(json) {
    return this.copyWith({
      showCodes: json.show_codes,
      darkMode: json.dark_mode,
      recordsPerPage: json.records_per_page,
    });
  }*/

  copyWith({
    showCodes = null,
    darkMode = null,
    recordsPerPage = null,
    toUpdate = null,
  } = {}) {
    return new UserSetting(
      showCodes === null ? this.showCodes : showCodes,
      darkMode === null ? this.darkMode : darkMode,
      recordsPerPage === null ? this.recordsPerPage : recordsPerPage,
      toUpdate == null ? true : toUpdate
    );
  }
}
