const express = require("express");
const router = express.Router();
const db = require("../../database");

// get area and location
router.get("/", async (req, res) => {
  try {
    var fetchQuery =
      "select a.name as Area,l.Name as Location from `Areas` a inner join `Locations` l on a.id=l.area_id";
    const data = await db.promise().query(fetchQuery);
    res.json(data[0]);
  } catch (error) {
    res.send("Error in the query");
  }
});

// add location
router.post("/", async (req, res) => {
  try {
    await insertIntoArea(req.body);
    await insertIntoLocation(req.body);
    res.send("Added Successfully");
  } catch (error) {
    res.send("Error in the query");
  }
});

const insertIntoArea = async (jsonList) => {
  var distinctAreas = getDistinctAreas(jsonList);
  if (distinctAreas.length > 0) {
    var insertQuery = "INSERT INTO `Areas` (`Name`) VALUES ";
    for (var i = 0; i < distinctAreas.length; i++) {
      if (i != 0) {
        insertQuery += ",";
      }
      insertQuery += `('${distinctAreas[i]}')`;
    }
    await db.promise().query(insertQuery);
  }
};

const insertIntoLocation = async (jsonList) => {
  var insertQuery = "insert into `Locations` (`area_id`,`Name`) values ";
  var flag = false;
  for (var i = 0; i < jsonList.length; i++) {
    var obj = jsonList[i];
    if (obj.area) {
      if (flag == true) {
        insertQuery += ",";
      }
      insertQuery += `( (select id from Areas where Name = '${obj.area}'), '${obj.location}' )`;
      flag = true;
    }
  }
  await db.promise().query(insertQuery);
};

const getDistinctAreas = (jsonList) => {
  var areas = [];
  for (var i = 0; i < jsonList.length; i++) {
    var obj = jsonList[i];
    if (obj.area) {
      areas.push(obj.area);
    }
  }
  return getUniqueFromArray(areas);
};

const getUniqueFromArray = (myArray) => {
  return myArray.filter((v, i, a) => a.indexOf(v) === i);
};

const send400 = (res, msg) => {
  return res.status(400).json({
    msg: msg,
  });
};

module.exports = router;
