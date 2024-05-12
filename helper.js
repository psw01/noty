function openNote() {
	console.log(this);
	let ID = $(this).attr("data-noteID");
	let [id, title, state, note, index] = db.exec("select * from NOTES WHERE id == ?", [ID])[0].values[0];
	const noteDom = document.querySelector("#notePreview");
	noteDom.querySelector(".note-title").innerText = title;
	noteDom.querySelector(".note-content").innerText = note;
	$(".dialog").attr("open", true);
}

const notePresetElm = document.querySelector("#notePreset");
const noteContainer = document.querySelector("#noteContainer");
const noteStates = { TODO: "C_TODO", "in progress": "C_PROCESS", Done: "C_DONE" };

function createNoteDOM(title, state, ID) {
	let toBeAppended = notePresetElm.cloneNode(true);
	toBeAppended.setAttribute("data-noteID", ID);
	toBeAppended.querySelector(".note-title").innerText = title;

	noteContainer.querySelector("#" + noteStates[state]).appendChild(toBeAppended);
}

(async () => {
	await SQL;
	db.exec("select * from NOTES")[0].values.forEach((e) => {
		let [id, title, state, note, index] = e;
		console.log(id);
		createNoteDOM(title, state, id);
	});

	$(".tasks").dblclick(openNote);

	$(".tasks").bind("contextmenu", function (e) {
		return false;
	});
})();

// for (let i = 0; i < 10; i++) {
// 	const randomState = "#" + noteStates[Math.round(Math.random() * 2)];

// 	createNoteDOM("example " + i, randomState, i);
// }
