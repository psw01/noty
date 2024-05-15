function openNote() {
	console.log(this);
	let ID = $(this).attr("data-noteID");
	let [id, title, state, note, index] = db.exec("select * from NOTES WHERE id == ?", [ID])[0].values[0];
	const noteDom = document.querySelector("#notePreview");
	noteDom.querySelector("#noteID").value = id;
	noteDom.querySelector(".note-title").innerText = title;
	noteDom.querySelector(".note-content").innerText = note;
	noteDom.querySelector("#noteStatus").innerText = state;

	$(".preview-dialog").attr("open", true);
}

function closeNote() {
	$(".preview-dialog").attr("open", false);
}

function switchToEditMode(note) {
	console.log(note);
	let form = document.querySelector(".edit-dialog");
	let ID = note.querySelector("#noteID").value;
	let title = note.querySelector(".note-title").innerText;
	let content = note.querySelector(".note-content").value;
	let state = note.querySelector("#noteStatus").innerText;

	form.querySelector(".edit-content").value = content;
	form.querySelector(".note-title").value = title;
	form.querySelector(".note-status").value = state;
	form.querySelector(".noteID").value = ID;

	$(form).attr("open", true);
	$("#notePreview").removeAttr("open");
	console.log(form.querySelector("#finishBT"));
}

function sortAndOrder(e, ui) {
	console.log(ui.item[0].parentNode.children.length);
	const state = ui.item[0].parentNode.children[0].getAttribute("data-state");
	const ID = ui.item[0].getAttribute("data-noteID");
	db.exec("UPDATE NOTES SET status = ? WHERE id = ?", [state, ID]);
	for (let i = 1; i <= ui.item[0].parentNode.children.length - 1; i++) {
		const ID = ui.item[0].parentNode.children[i].getAttribute("data-noteID");
		db.exec("UPDATE NOTES SET index_number = ? WHERE id = ?", [i, ID]);
	}
}

function updateNote() {
	let form = document.querySelector(".edit-dialog");
	let ID = form.querySelector(".noteID").value;
	let title = form.querySelector(".note-title").value;
	let content = form.querySelector(".note-content").value;
	let state = form.querySelector(".note-status").value;
	console.log([title, state, content, ID]);

	db.exec("UPDATE NOTES SET title = ?, status = ?, note = ? WHERE id = ?", [title, state, content, ID]);
	ClearDOMNotes();
	drawNotes();
	$(".edit-dialog").removeAttr("open");
}

function deleteNote(note) {
	if (!confirm("Are you sure you want to delete this note?")) return;
	db.exec("DELETE FROM NOTES where id = ?", [note.getAttribute("data-noteID")]);
	$(note).fadeOut(500, function () {
		$(this).remove();
	});
}

function addNote() {
	let form = document.querySelector(".add-dialog");
	let note_content = form.querySelector(".edit-content");
	let title = form.querySelector(".inp-title");
	let state = form.querySelector(".inp-status");

	db.exec(
		`INSERT INTO NOTES (title, status, note, index_number) VALUES (?, ?, ?, 0);
    `,
		[title.value, state.value, note_content.value]
	);
	title.value = "";
	note_content.value = "";
	ClearDOMNotes();
	drawNotes();
}

const notePresetElm = document.querySelector("#notePreset");
const noteContainer = document.querySelector("#noteContainer");
const noteStates = { TODO: "C_TODO", "in progress": "C_PROCESS", Done: "C_DONE" };

function createNoteDOM(title, state, ID) {
	let toBeAppended = notePresetElm.cloneNode(true);
	toBeAppended.setAttribute("data-noteID", ID);
	toBeAppended.removeAttribute("id");
	toBeAppended.querySelector(".note-title").innerText = title;

	noteContainer.querySelector("#" + noteStates[state]).appendChild(toBeAppended);
}

function ClearDOMNotes() {
	Object.values(noteStates).forEach((value) => {
		console.log(value);
		$("#" + value)
			.children()
			.not(".ui-state-disabled")
			.remove();
	});
}

async function drawNotes() {
	await SQL;
	try {
		ClearDOMNotes();

		const notes = db.exec("SELECT * FROM NOTES ORDER BY index_number ASC");

		for (const note of notes[0].values) {
			const [id, title, state, noteText, indexNumber] = note;
			createNoteDOM(title, state, id, indexNumber);
		}

		initUI();
	} catch (error) {
		console.error("Error drawing notes:", error);
	}
}

drawNotes();
