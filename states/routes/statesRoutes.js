const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

module.exports = app => {
  const statesController = require('../controllers/statesController');
  var router = require("express").Router();

  router.get('/', statesController.getAllStates)
  router.get('/:state', statesController.getStateData)
  router.get('/:state/funfact', statesController.getFunfacts)
  router.get('/:state/capital', statesController.getCapital)
  router.get('/:state/nickname', statesController.getNickname)
  router.get('/:state/population', statesController.getPopulation)
  router.get('/:state/admission', statesController.getAdmission)
  router.post('/:state/funfact', statesController.createFunfact)
  router.patch('/:state/funfact', statesController.patchFunfact)
  router.delete('/:state/funfact/:index', statesController.deleteFunfact)
  


  app.use("/states", router);
};
