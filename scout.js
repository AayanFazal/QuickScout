//["30","1111","Swerve drive","B","false",4,4,3,0,0,5,5,0,"Docked",0,0,0,0,0,5,4,0,4,0,5,0,"75","4","Engaged","1","Slow",false,false,true,true,true,"Usert"]
//["101","2590","test","B","false",1,2,3,4,5,6,7,8,"Engaged",9,10,11,12,13,14,15,16,0,0,0,0,"50","3","Parked","1","Fast",false,true,false,false,true,"Aayan"]
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let db;
let fileName;

function processInput(input) {
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
      comment: dataArray[2],
      scoutName: dataArray[36],
    },
    AUTON: {
      startingPos: dataArray[3],
      leaveCommunity: dataArray[4],
      coneHigh_atn: dataArray[5],
      coneMid_atn: dataArray[6],
      coneLow_atn: dataArray[7],
      coneMissed_atn: dataArray[8],
      cubeHigh_atn: dataArray[9],
      cubeMid_atn: dataArray[10],
      cubeLow_atn: dataArray[11],
      cubeMissed_atn: dataArray[12],
      chargStat_atn: dataArray[13],
    },
    TP: {
      coneHigh_tp: dataArray[14],
      coneMid_tp: dataArray[15],
      coneLow_tp: dataArray[16],
      coneMissed_tp: dataArray[17],
      cubeHigh_tp: dataArray[18],
      cubeMid_tp: dataArray[19],
      cubeLow_tp: dataArray[20],
      cubeMissed_tp: dataArray[21],
      intke_Floor_InComm: dataArray[22],
      intke_Floor_OutComm: dataArray[23],
      intke_shelf: dataArray[24],
      intkeChute: dataArray[25],
      defQuant: dataArray[26],
      defQual: dataArray[27],
    },
    ENDGAME: {
      chargStat_end: dataArray[28],
      addRobot: dataArray[29],
    },
    OPTIONAL: {
      speed: dataArray[30],
      moveBtwnNode: dataArray[31],
      droppedCycl: dataArray[32],
      longIntake: dataArray[33],
      droppedHit: dataArray[34],
      tripleClimb: dataArray[35],
    },
  };

    db.run(
      "CREATE TABLE IF NOT EXISTS mytable (" +
      "id INTEGER PRIMARY KEY, " +
      "matchNum INTEGER, " +
      "teamNum INTEGER, " +
      "comment TEXT, " +
      "scoutName TEXT, " +
      "startingPos TEXT, " +
      "leaveCommunity TEXT, " +
      "coneHigh_atn INTEGER, " +
      "coneMid_atn INTEGER, " +
      "coneLow_atn INTEGER, " +
      "coneMissed_atn INTEGER, " +
      "cubeHigh_atn INTEGER, " +
      "cubeMid_atn INTEGER, " +
      "cubeLow_atn INTEGER, " +
      "cubeMissed_atn INTEGER, " +
      "chargStat_atn TEXT, " +
      "coneHigh_tp INTEGER, " +
      "coneMid_tp INTEGER, " +
      "coneLow_tp INTEGER, " +
      "coneMissed_tp INTEGER, " +
      "cubeHigh_tp INTEGER, " +
      "cubeMid_tp INTEGER, " +
      "cubeLow_tp INTEGER, " +
      "cubeMissed_tp INTEGER, " +
      "intke_Floor_InComm INTEGER, " +
      "intke_Floor_OutComm INTEGER, " +
      "intke_shelf INTEGER, " +
      "intkeChute INTEGER, " +
      "defQuant INTEGER, " +
      "defQual TEXT, " +
      "chargStat_end TEXT, " +
      "addRobot TEXT, " +
      "speed INTEGER, " +
      "moveBtwnNode TEXT, " +
      "droppedCycl INTEGER, " +
      "longIntake INTEGER, " +
      "droppedHit INTEGER, " +
      "tripleClimb TEXT)"
    );

  const prep = db.prepare(
    "INSERT INTO mytable VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)");
  prep.run(
    team.INFO.matchNum,
    team.INFO.teamNum,
    team.INFO.comment,
    team.INFO.scoutName,
    team.AUTON.startingPos,
    team.AUTON.leaveCommunity,
    team.AUTON.coneHigh_atn,
    team.AUTON.coneMid_atn,
    team.AUTON.coneLow_atn,
    team.AUTON.coneMissed_atn,
    team.AUTON.cubeHigh_atn,
    team.AUTON.cubeMid_atn,
    team.AUTON.cubeLow_atn,
    team.AUTON.cubeMissed_atn,
    team.AUTON.chargStat_atn,
    team.TP.coneHigh_tp,
    team.TP.coneMid_tp,
    team.TP.coneLow_tp,
    team.TP.coneMissed_tp,
    team.TP.cubeHigh_tp,
    team.TP.cubeMid_tp,
    team.TP.cubeLow_tp,
    team.TP.cubeMissed_tp,
    team.TP.intke_Floor_InComm,
    team.TP.intke_Floor_OutComm,
    team.TP.intke_shelf,
    team.TP.intkeChute,
    team.TP.defQuant,
    team.TP.defQual,
    team.ENDGAME.chargStat_end,
    team.ENDGAME.addRobot,
    team.OPTIONAL.speed,
    team.OPTIONAL.moveBtwnNode,
    team.OPTIONAL.droppedCycl,
    team.OPTIONAL.longIntake,
    team.OPTIONAL.droppedHit,
    team.OPTIONAL.tripleClimb
  );

  prep.finalize();

  console.log("\x1b[33m\x1b[3mScout: \x1b[94m%s  \x1b[0m--- \x1b[33m\x1b[3mTeam: \x1b[94m%d \x1b[0m--- \x1b[33m\x1b[3mMatch: \x1b[94m%d ",team.INFO.scoutName,team.INFO.teamNum,team.INFO.matchNum);

}

function getUserInput() {
  rl.question("\x1b[0m\nScan Scout: ", (input) => {
    if (input.toLowerCase() === "exit") {
      
      rl.close();
      db.close();
      console.log("\x1b[96mClosed");
      return;
    }
    processInput(input);
    getUserInput();
  });
}

function createDatabase() {
  db = new sqlite3.Database(`Databases/${fileName}.db`);
  db.run(
    "CREATE TABLE IF NOT EXISTS mytable (" +
    "id INTEGER PRIMARY KEY, " +
    "matchNum INTEGER, " +
    "teamNum INTEGER, " +
    "comment TEXT, " +
    "scoutName TEXT, " +
    "startingPos TEXT, " +
    "leaveCommunity TEXT, " +
    "coneHigh_atn INTEGER, " +
    "coneMid_atn INTEGER, " +
    "coneLow_atn INTEGER, " +
    "coneMissed_atn INTEGER, " +
    "cubeHigh_atn INTEGER, " +
    "cubeMid_atn INTEGER, " +
    "cubeLow_atn INTEGER, " +
    "cubeMissed_atn INTEGER, " +
    "chargStat_atn TEXT, " +
    "coneHigh_tp INTEGER, " +
    "coneMid_tp INTEGER, " +
    "coneLow_tp INTEGER, " +
    "coneMissed_tp INTEGER, " +
    "cubeHigh_tp INTEGER, " +
    "cubeMid_tp INTEGER, " +
    "cubeLow_tp INTEGER, " +
    "cubeMissed_tp INTEGER, " +
    "intke_Floor_InComm INTEGER, " +
    "intke_Floor_OutComm INTEGER, " +
    "intke_shelf INTEGER, " +
    "intkeChute INTEGER, " +
    "defQuant INTEGER, " +
    "defQual TEXT, " +
    "chargStat_end TEXT, " +
    "addRobot TEXT, " +
    "speed INTEGER, " +
    "moveBtwnNode TEXT, " +
    "droppedCycl INTEGER, " +
    "longIntake INTEGER, " +
    "droppedHit INTEGER, " +
    "tripleClimb TEXT)"
  );
  getUserInput();
}

function chooseExistingDatabase() {
  fs.readdirSync('Databases').forEach(file => {
    console.log("\x1b[96m%s",file);
  });

  rl.question("\x1b[0mChoose an existing DB: ", (database) => {
    fileName = database;
    db = new sqlite3.Database(`Databases/${fileName}.db`);
    getUserInput();
  });
}

function competition() {
  rl.question("New event? - yes/no ", (x) => {
    if (x.toLowerCase() === "yes") {
      rl.question("Event Name: ", (comp) => {
        fileName = comp;
        console.log("\x1b[96m %s File Created",fileName);
        createDatabase();
      });
    } else {
      chooseExistingDatabase();
    }
  });
}

// Start the competition function to set up the database and get user input
competition();
