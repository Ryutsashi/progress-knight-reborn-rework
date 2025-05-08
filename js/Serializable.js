class Serializable {
	static #anchorElement = document.createElement("a");
	#data = null;
	constructor(data) {
		this.#data = data;
	}
	get data() {
		return this.#data;
	}
	createDeepClone(options) {
		return new Serializable(structuredClone(this.#data, options));
	}
	toJSON() {
		return new Serializable(JSON.stringify(this.#data));
	}
	fromJSON() {
		return new Serializable(JSON.parse(this.#data));
	}
	toBase64() {
		return new Serializable(window.btoa(this.#data));
	}
	fromBase64() {
		return new Serializable(window.atob(this.#data));
	}
	toLocalStorage(key) {
		try {
			localStorage.setItem(key, this.#data);
		} catch (error) {
			throw error;
		}
	}
	static fromLocalStorage(key) {
		try {
			let data = localStorage.getItem(key);
			if (data === null) throw new Error("No data found in local storage");
			return new Serializable(data);
		} catch (error) {
			console.warn(error);
			return new Serializable(null);
		}
	}
	toTextBlob(options = {type: "text/plain"}) {
		return new Blob([this.#data], options);
	}
	toJSONBlob(options = {type: "application/json"}) {
		return new Blob([this.#data], options);
	}
	static downloadAsFile(data, fileName) {
		Serializable.#anchorElement.download = fileName;
		Serializable.#anchorElement.href = URL.createObjectURL(data);
		Serializable.#anchorElement.click();
		URL.revokeObjectURL(Serializable.#anchorElement.href);
	}
}