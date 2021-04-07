class UserStatus {
	static get STATUS_RESET_SECONDS() {
		return 120;
	}
	static get REMOVED_STATUS_KEEP_SECONDS() {
		return 300;
	}
	constructor($b) {
		if (!$b) $b = {};
		this.OnlineStatus = $b.onlineStatus;
		this.LastStatusChange = $b.lastStatusChange;
		this.CurrentSessionId = $b.currentSessionId;
		this.CurrentSessionAccessLevel = $b.currentSessionAccessLevel;
		this.CurrentSessionHidden = $b.currentSessionHidden;
		this.CurrentHosting = $b.currentHosting;
		this.CompatibilityHash = $b.compatibilityHash;
		this.NeosVersion = $b.neosVersion;
		this.PublicRSAKey = $b.publicRSAKey;
		this.OutputDevice = $b.outputDevice;
		this.IsMobile = $b.isMobile;
		this.ActiveSessions = $b.activeSessions;
	}
	/**
	 *
	 * @returns {SessionInfo}
	 * @readonly
	 * @memberof UserStatus
	 */
	get CurrentSession() {
		let activeSessions = this.ActiveSessions;
		if (activeSessions == null) return null;
		return activeSessions.find((s) => s.SessionId === this.CurrentSessionId);
	}
	/**
	 *
	 * @returns {boolean}
	 * @param {UserStatus} other
	 * @memberof UserStatus
	 */
	IsSame(other) {
		if (
			other == null ||
			this.OnlineStatus !== other.OnlineStatus ||
			this.CurrentSessionId !== other.CurrentSessionId
		)
			return false;
		return true; //TODO remove when implimented
		/**
		Let activeSessions1 = this.ActiveSessions;
		let num1 = activeSessions1 != null ? ActiveSessions1.Count : 0;
		let activeSessions2 = this.ActiveSessions;
		let num2 = activeSessions2 != null ? ActiveSessions2.Count : 0;
		let activeSessions3 = other.ActiveSessions;
		let num3 = activeSessions3 != null ? ActiveSessions3.Count : 0;
		if (num2 != num3) return false;
		for (let index = 0; index < num1; index++) {
			if (!this.ActiveSessions[index].IsSame(other.ActiveSessions[index]))
				return false;
		}
		return true;.
		 */
	}
	SortSessions() {
		if (this.ActiveSessions == null) return;
		this.ActiveSessions.sort((a, b) => {
			if (a.SessionId === this.CurrentSessionId) return -1;
			if (b.SessionId === this.CurrentSessionId) return 1;
			if (a.AwaySince != null && b.AwaySince != null)
				return a.AwaySince.toLocaleString().localeCompare(
					b.AwaySince.toLocaleString()
				);
			return a.SessionId.localeCompare(b.SessionId);
		});
	}
}
module.exports = {
	UserStatus,
};
