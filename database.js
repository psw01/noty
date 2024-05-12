let db;
const SQL = initSqlJs({
	locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
}).then((SQL) => {
	const existingDatabase = localStorage.getItem("database");
	if (existingDatabase) {
		const binaryPayload = new Uint8Array(existingDatabase.split(",").map(Number));
		db = new SQL.Database(binaryPayload);
	} else {
		db = new SQL.Database();
		const data = db.export();
		localStorage.setItem("database", data);
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
	db.exec(
		`INSERT INTO NOTES (title, status, note, index_number) VALUES ('Call plumber', 'in progress', 'Fix leaky faucet', 2);
		INSERT INTO NOTES (title, status, note, index_number) VALUES ('Test Da daTABase', 'TODO', 'DO IT ASAP', 2);`
	);
});

async function commitDB() {
	await SQL;
	const data = db.export();
	localStorage.setItem("database", data);
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
