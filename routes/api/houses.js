const express = require("express");
const router = express.Router();
const db = require("../../database");

const houses = require("../../Houses");

// get all houses
router.get("/", (req, res) => {
  res.json(houses);
});

// get house by id
router.get("/:id", async (req, res) => {
  console.log("request id ==> ", req.params.id);
  try {
    const housesList = await db
      .promise()
      .query(`select * from Houses where ID= ${req.params.id}`);
    if (housesList[0].length>0) {
      res.json(
        housesList[0][0]
      );
    } else {
      res.status(400).json({
        msg: `No house found for id ${req.params.id}`,
      });
    }
  } catch (error) {
    console.log("error found while getting data from houses");
  }
});

// add house
router.post("/", (req, res) => {
  const newHouse = {
    id: houses.length + 1,
    location: req.body.location,
    flat: req.body.flat,
  };
  if (!newHouse.location || !newHouse.flat) {
    return send400(res, "fill all the fields");
  }
  houses.push(newHouse);
  res.json(houses);
});

// update house
router.put("/", (req, res) => {
  const found = houses.some((house) => house.id == req.body.id);
  if (found) {
    const updatedHouse = req.body;
    houses.forEach((house) => {
      if (house.id == updatedHouse.id) {
        house.location = updatedHouse.location
          ? updatedHouse.location
          : house.location;
        house.flat = updatedHouse.flat ? updatedHouse.flat : house.flat;

        res.json({
          msg: `House with id ${house.id} updated successfully`,
          house,
        });
      }
    });
  } else {
    send400(res, `No house found for id ${req.body.id}`);
  }
});

// delete house
router.delete("/", (req, res) => {
  const memberToDelete = houses.some((house) => house.id == req.body.id);
  if (memberToDelete) {
    res.json({
      msg: `House with id ${req.body.id} deleted`,
      houses: houses.filter((house) => house.id != req.body.id),
    });
  } else {
    send400(res, `House with id ${req.body.id} not found`);
  }
});

const send400 = (res, msg) => {
  return res.status(400).json({
    msg: msg,
  });
};

module.exports = router;
