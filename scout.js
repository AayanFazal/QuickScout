const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let db;
let fileName;

async function processInput(input) {
  const StringInput = String(input);
  const dataArray = StringInput.replace(/"/g, '').slice(1, -1).split(',');
  for (let i = 0; i < dataArray.length; i++) {
    const value = dataArray[i];
    if (value === 'true') {
      dataArray[i] = true;
    } else if (value === 'false') {
      dataArray[i] = false;
    } else if (!isNaN(value)) {
      dataArray[i] = parseFloat(value);
    }
  }

  const team = {
    INFO: {
      matchNum: dataArray[0],
      teamNum: dataArray[1],
      scoutName: dataArray[2],
    },
    AUTON: {
      startingPos: dataArray[3],
      leaveWing: dataArray[4],
      spkrMade_atn: dataArray[5],
      spkrMissed_atn: dataArray[6],
      ampMade_atn: dataArray[7],
      ampMissed_atn: dataArray[8],
    },
    TP: {
      spkrMade_tp: dataArray[9],
      spkrMissed_tp: dataArray[10],
      ampMade_tp: dataArray[11],
      ampMissed_tp: dataArray[12],
      coopertition: dataArray[13], 
      climbLvl: dataArray[14], 
      trap: dataArray[15], 
    },
    ENDGAME: {
      noShow: dataArray[16],
      defQuant: dataArray[17],
      defQual: dataArray[18],
    },
  };

  try {
    await db.run(
      "CREATE TABLE IF NOT EXISTS mytable (" +
      "id INTEGER PRIMARY KEY, " +
      "matchNum INTEGER, " +
      "teamNum INTEGER, " +
      "scoutName TEXT, " +
      "startingPos TEXT, " +
      "leaveWing Boolean, " +
      "spkrMade_atn INTEGER, " +
      "spkrMissed_atn INTEGER, " +
      "ampMade_atn INTEGER, " +
      "ampMissed_atn INTEGER, " +
      "spkrMade_tp INTEGER, " +
      "spkrMissed_tp INTEGER, " +
      "ampMade_tp INTEGER, " +
      "ampMissed_tp INTEGER, " +
      "coopertition Boolean, " +
      "climbLvl INTEGER, " +
      "trap INTEGER, " +
      "noShow Boolean, " +
      "defQuant INTEGER, " +
      "defQual INTEGER)"
    );

    const prep = db.prepare(
      "INSERT INTO mytable VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"
    );

    await prep.run(
      team.INFO.matchNum,
      team.INFO.teamNum,
      team.INFO.scoutName,

      team.AUTON.startingPos,
      team.AUTON.leaveWing,
      team.AUTON.spkrMade_atn,
      team.AUTON.spkrMissed_atn,
      team.AUTON.ampMade_atn,
      team.AUTON.ampMissed_atn,

      team.TP.spkrMade_tp,
      team.TP.spkrMissed_tp,
      team.TP.ampMade_tp,
      team.TP.ampMissed_tp,
      team.TP.coopertition,
      team.TP.climbLvl,
      team.TP.trap,

      team.ENDGAME.noShow, 
      team.ENDGAME.defQuant,
      team.ENDGAME.defQual
    );

    prep.finalize();

    console.log("\x1b[33m\x1b[3mScout: \x1b[94m%s  \x1b[0m--- \x1b[33m\x1b[3mTeam: \x1b[94m%d \x1b[0m--- \x1b[33m\x1b[3mMatch: \x1b[94m%d ",team.INFO.scoutName,team.INFO.teamNum,team.INFO.matchNum);
  } catch (error) {
    console.error('Error processing input:', error);
  }
}

async function getUserInput() {
  rl.question("\x1b[0m\nScan Scout: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      await db.close();
      console.log("\x1b[96mClosed");
      return;
    }
    await processInput(input);
    await getUserInput();
  });
}

async function createDatabase() {
  try {
    db = new sqlite3.Database(`Databases/${fileName}.db`);
    await getUserInput();
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

async function chooseExistingDatabase() {
  try {
    const files = fs.readdirSync('Databases');
    console.log("\x1b[96m%s",files);
    rl.question("\x1b[0mChoose an existing DB: ", async (database) => {
      fileName = database;
      db = new sqlite3.Database(`Databases/${fileName}.db`);
      await getUserInput();
    });
  } catch (error) {
    console.error('Error choosing existing database:', error);
  }
}

async function competition() {
  try {
    rl.question("New event? - yes/no ", async (x) => {
      if (x.toLowerCase() === "yes") {
        rl.question("Event Name: ", async (comp) => {
          fileName = comp;
          console.log("\x1b[96m %s File Created",fileName);
          await createDatabase();
        });
      } else {
        await chooseExistingDatabase();
      }
    });
  } catch (error) {
    console.error('Error during competition:', error);
  }
}

// Start the competition function to set up the database and get user input
competition();
