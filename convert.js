const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function chooseDatabaseFile() {
  const databaseFolder = 'Databases';
  fs.readdirSync(databaseFolder).forEach(file => {
    console.log("\x1b[96m%s", file);
  });

  rl.question("\x1b[0mChoose a database file to convert: ", (database) => {
    const dbPath = path.join(databaseFolder, `${database}.db`);
    convertToCSV(dbPath, database);
  });
}

function getUniqueCSVFileName(csvFolderPath, baseFileName, counter) {
  const csvFileName = counter === 0 ? `${baseFileName}.csv` : `${baseFileName}_${counter}.csv`;
  const csvFilePath = path.join(csvFolderPath, csvFileName);

  if (fs.existsSync(csvFilePath)) {
    return getUniqueCSVFileName(csvFolderPath, baseFileName, counter + 1);
  }

  return csvFileName;
}

function convertToCSV(dbPath, databaseName) {
  const db = new sqlite3.Database(dbPath);
  const tableName = 'mytable'; // Assuming your table is named 'mytable'
  const csvFolderPath = './CSVFILE'; // The folder where you want to save CSV files

  // Ensure the CSV folder exists, create it if not
  if (!fs.existsSync(csvFolderPath)) {
    fs.mkdirSync(csvFolderPath);
  }

  // Query to select all rows from the specified table
  const query = `SELECT * FROM ${tableName}`;

  // Execute the query
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      db.close();
      return;
    }
    if (rows.length === 0) {
      console.log("No rows found in the table.");
      db.close();
      rl.close();
      return;
    }
    // Create a CSV header using the column names
    const header = Object.keys(rows[0]).join(',');

    // Create a CSV content by joining the values of each row
    const content = rows.map(row => Object.values(row).join(','));

    // Combine the header and content into a CSV string
    const csvData = `${header}\n${content.join('\n')}`;

    // Generate the file name and path within the CSV folder
    const baseCSVFileName = `${databaseName}`;
    const uniqueCSVFileName = getUniqueCSVFileName(csvFolderPath, baseCSVFileName, 0);
    const csvFilePath = path.join(csvFolderPath, uniqueCSVFileName);

    // Write the CSV string to a file
    fs.writeFileSync(csvFilePath, csvData, 'utf8');

    console.log(`\x1b[96m CSV file '${uniqueCSVFileName}' has been created in the '${csvFolderPath}' folder.`);

    // Close the database connection
    db.close();
    rl.close();
  });
}

// Start by choosing the database file
chooseDatabaseFile();
