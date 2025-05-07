class Serializable {
	#data = null;
	constructor(data) {
		this.#data = data;
	}
	get data() {
		return this.#data;
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
			return new Serializable(localStorage.getItem(key));
		} catch (error) {
			throw error;
		}
	}
}