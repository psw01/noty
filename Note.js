class Note {
	constructor(title, status, note, indexNumber) {
		this.id = null;
		this.title = title;
		this.status = status;
		this.note = note;
		this.indexNumber = indexNumber;
	}

	getTitle() {
		return this.title;
	}

	setTitle(title) {
		this.title = title;
	}

	getStatus() {
		return this.status;
	}

	setStatus(status) {
		const allowedStatuses = ["TODO", "in progress", "Done"];
		if (allowedStatuses.includes(status)) {
			this.status = status;
		} else {
			throw new Error("Invalid status value");
		}
	}

	getNote() {
		return this.note;
	}

	setNote(note) {
		this.note = note;
	}

	getIndexNumber() {
		return this.indexNumber;
	}

	setIndexNumber(indexNumber) {
		this.indexNumber = indexNumber;
	}

	export() {
		if (this.id === null) {
			return `INSERT INTO NOTES (title, status, note, index_number) VALUES ('${this.title}', '${this.status}', '${this.note}', ${this.indexNumber});`;
		} else {
			return `UPDATE NOTES SET title = '${this.title}', status = '${this.status}', note = '${this.note}', index_number = ${this.indexNumber} WHERE id = ${this.id};`;
		}
	}
}
