let db;
const SQL = initSqlJs({
	locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
}).then((SQL) => {
	const existingDatabase = localStorage.getItem("todo-list-database");
	if (existingDatabase) {
		const binaryPayload = new Uint8Array(existingDatabase.split(",").map(Number));
		db = new SQL.Database(binaryPayload);
	} else {
		db = new SQL.Database();
		const data = db.export();
		localStorage.setItem("todo-list-database", data);
	}
	db.exec(`
            CREATE TABLE IF NOT EXISTS NOTES (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    status TEXT CHECK(status IN ('TODO', 'in progress', 'Done')),
                    note TEXT,
                    index_number INTEGER
                );
            `);
	// db.exec(
	// 	`INSERT INTO NOTES (title, status, note, index_number) VALUES ('Call plumber', 'in progress', 'Fix leaky faucet', 2);
	// 	`
	// );
});

async function commitDB() {
	await SQL;
	const data = db.export();
	localStorage.setItem("todo-list-database", data);
	console.log("committed");
}

function downloadDatabase() {
	const data = db.export();
	const blob = new Blob([data], { type: "application/octet-stream" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "database.sqlite";
	a.click();

	URL.revokeObjectURL(url);
}

function loadDatabaseFromFile() {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = ".sqlite,.db";

	fileInput.addEventListener("change", async (event) => {
		const file = event.target.files[0];
		if (!file) return;
		try {
			const data = await file.arrayBuffer();
			const SQL = await initSqlJs({
				locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
			});
			db = new SQL.Database(new Uint8Array(data));
			console.log("Database loaded successfully");
			ClearDOMNotes();
			drawNotes();
		} catch (error) {
			console.error("Error loading database:", error);
		}
	});
	fileInput.click();
}
