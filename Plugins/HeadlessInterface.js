const { EventEmitter } = require("events");
const path = require("path");
//const fs = require("fs");
//const { v4: uuid } = require("uuid");
/**
 *
 * @class HeadlessInterface
 * @extends {EventEmitter}
 */
class HeadlessInterface extends EventEmitter {
	/**
	 *
	 * @param {String | 'child_process'} headlessPath
	 * @param {String} [configPathRelative]
	 * @param {any} [options]
	 */
	constructor(headlessPath, configPathRelative, options) {
		super();
		this.State = {
			Running: false,
			Starting: true,
			CompatibilityHash: null,
			log: false,
			logMsg: 0,
			sessionId: null,
			sessionIdAttempts: 0,
		};
		this.Options = options || {};
		if (this.Options.SafeReady == null) this.Options.SafeReady = 1000;
		if (this.Options.Events == null) this.Options.Events = false;
		if (this.Options.sessionIdAttempts == null)
			this.Options.sessionIdAttempts = 15;
		if (typeof headlessPath == "string") {
			if (process.platform === "win32") {
				//Windows
				this.NeosVR = require("child_process").spawn(
					path.join(headlessPath, "Neos.exe"),
					[
						"--config",
						configPathRelative
							? configPathRelative
							: path.join(headlessPath, "Config/Config.json"),
					],
					{
						windowsHide: false,
						cwd: headlessPath /* Folder to Neos Headless For Binaries*/,
					}
				);
			} else {
				//Linux requires Mono
				this.NeosVR = require("child_process").spawn(
					"mono",
					[
						path.join(headlessPath, "Neos.exe"),
						"--config",
						configPathRelative
							? configPathRelative
							: path.join(headlessPath, "/Config/Config.json"),
					],
					{
						windowsHide: true,
						cwd: headlessPath /* Folder to Neos Headless For Binaries*/,
					}
				);
			}
		} else {
			this.NeosVR = headlessPath;
		}
		this.Queue = new CommandQueue(this);
		this.InternalEvents = new EventEmitter();
		this.InternalEvents.setMaxListeners(1);
		this.NeosVR.stdout.on("data", (data) => {
			var message = data.toString();
			if (message.startsWith("World running...")) {
				this.State.Starting = false;
				if (!this.State.Running) {
					this.State.Running = true;
					this.sessionId.then((sessionId) => {
						/**
						 * Fires when the headless client is Ready
						 * @event HeadlessInterface#ready
						 * @type {String} SessionId
						 *
						 */
						this.emit("ready", sessionId);
					});
				}
			}
			this.InternalEvents.emit("HeadlessResponse", message);

			/**
			 * @event HeadlessInterface#message
			 * @type {String}
			 */
			this.emit("message", message);
		});
	}
	/**
	 * Can the headless client send another command right now?
	 * @readonly
	 * @memberof HeadlessInterface
	 */
	get CanSend() {
		return this.InternalEvents._events.HeadlessResponse == null;
	}

	/**
	 * Get the Headless Client SessionId
	 *
	 * @readonly
	 * @memberof HeadlessInterface
	 */
	get sessionId() {
		if (this.State.sessionId) return this.State.sessionId;
		else
			return this.Send("sessionId").then((sessionId) => {
				if (
					sessionId != null &&
					typeof sessionId === "string" &&
					sessionId.startsWith("S-")
				) {
					this.State.sessionId = sessionId;
					return sessionId;
				} else {
					this.State.sessionIdAttempts++;
					if (this.State.sessionIdAttempts > this.Options.SessionIdAttempts) {
						this.emit("error", "Coult not retrieve sessionId");
						this.State.sessionIdAttempts = 0;
						return null;
					}
					return this.sessionId; // Try Again
				}
			});
	}

	/**
	 *End the Process
	 *
	 * @returns
	 * @memberof HeadlessInterface
	 */
	Kill() {
		return this.NeosVR.kill(0);
	}
	/**
	 * Send a command to the Headless Client
	 * @param {String} text
	 * @returns {Promise<String>}
	 */
	Send(text) {
		if (this.InternalEvents._events.HeadlessResponse) {
			//TODO Race Conditions! Add Queue, Currently limited to 1 response at a time. System might need to be complex
			this.emit(
				"error",
				"Tried Calling .Send while another command was processing, This Error is to prevent a Race Condition"
			);
			return new Promise((resolve) => {
				resolve("Error, Command Not Sent. Race Condition");
			});
		}
		let response = new Promise((Resolve) =>
			this.InternalEvents.on("HeadlessResponse", function (data) {
				if (!data.endsWith(">")) {
					// Filter out Input text and wait for proper response
					//TODO Add Timeout
					console.log(data);
					this.removeListener(
						"HeadlessResponse",
						this._events.HeadlessResponse
					);
					Resolve(data);
				}
			})
		);
		this.NeosVR.stdin.write(text + "\n");
		return response;
	}
}

/**
 *
 * @private
 * @class CommandQueue
 */
class CommandQueue {
	constructor(HeadlessInterface) {
		this.HeadlessInterface = HeadlessInterface;
		this.Queue = [];
		this.Promises = [];
		this.InternalClock = null; //TODO internal timer
	}
	/*
	Add(Command) {
		var context = this; //Passing into ES6

		return new Promise();
	}
	*/
}
module.exports = HeadlessInterface;
