var mongoose = require('mongoose');

const data = {
    states: require('../models/statesData.json'),
    setStates: function(data){this.states = data}
}

const dbState = require('../models/state');

const getAllStates = async (req, res) => {
  let states = data.states;
  
  if (req.query.contig === 'true') {
    states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (req.query.contig === 'false') {
    states = states.filter(state => state.code === 'AK' || state.code === 'HI');
  }

  for (var i=0; i < states.length; i++) {
    const funfactTable = await dbState.findOne({ code: states[i].code }).exec();
    if (funfactTable) {
      states[i]["funfacts"] = funfactTable.funfacts;
    }
    console.log(states[i])
  }

  
  res.json(states);
};

const getStateData = async (req, res) => {
  const stateCode = req.params.state;
  console.log("code param: " + stateCode);
  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/

  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());
  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });

  }

  const funfactTable = await dbState.findOne({ code: stateCode }).exec();
  if (funfactTable) {
    state["funfacts"] = funfactTable.funfacts;
  }

  // Return the state data
  return res.json(state);
};

const getFunfacts = (req, res) => {
    
  const stateCode = req.params.state;
  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/


  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());
   
  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }



  dbState.findOne({ code: stateCode })
  .then(s => {
    return res.json(s.funfacts);
  })
  .catch(err => {
    return res.status(404).json({ error: 'No Fun Facts found for Georgia' });
  });
}

const getCapital = (req, res) => {
    
  const stateCode = req.params.state;
  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/

  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());

  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }

  // Return the state data
  return res.send({'state': state.state, 'capital': state.capital_city});
}

const getNickname = (req, res) => {
    
  const stateCode = req.params.state;
  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/

  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());

  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }

  // Return the state data
  return res.send({'state': state.state, 'nickname': state.nickname});
}

const getPopulation = (req, res) => {
    
  const stateCode = req.params.state;

  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/

  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());

  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }

  // Return the state data
  return res.send({'state': state.state, 'population': state.population});
}

const getAdmission = (req, res) => {
    
  const stateCode = req.params.state;
  /*if (stateCode.length != 2){
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }*/

  // Find the state with the given code
  const state = data.states.find(s => s.code.toLowerCase() === stateCode.toLowerCase());

  // If state is not found, return a 404 response
  if (!state) {
    //return res.status(404).json({ error: 'State not found' });
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }

  // Return the state data
  return res.send({'state': state.state, 'admitted': state.admission_date});
}

const createFunfact = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const stateCode = req.params.state;

  var query = {'code': stateCode},
  update = { expire: new dbState({
                code: stateCode,
                funfacts: req.body.funfacts,
              }),
              "$push": { "funfacts": req.body.funfacts }
  },
  options = { upsert: true, new: true, setDefaultsOnInsert: true };

  dbState.findOneAndUpdate(query, update, options)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update state with id=${stateCode}. Maybe State was not found!`
        });
      } else {
        res.send({ message: "Funfact was updated successfully.", firstElement: data.funfacts[0] });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating State with code=" + stateCode
      });
    });
};

const patchFunfact = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to patch can not be empty!"
    });
  }

  const stateCode = req.params.state;
  const index = req.body.index -1;
  
  var query = {'code': stateCode,
                ['funfacts.'+index] : { "$exists": true },

              },
      update = { 
        "$set": { ['funfacts.'+index]: req.body.funfact } 
              
      }
      options = { upsert: true, new: true};
  dbState.findOneAndUpdate(query, update, options)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot patch State with code=${stateCode}. Maybe State was not found!`
        });
      } else {
        res.send({ message: "Funfact was patched successfully." ,
                   firstElement: data.funfacts[0]});
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error patching state with code=" + stateCode
      });
    });
};

const deleteFunfact = async (req, res) => {
  

  if (!req?.body?.index) return res.status(400).json({ 'message': 'Funfact index required.' });

  const stateCode = req.params.state;

  const state = await dbState.findOne({ code: stateCode }).exec();
  console.log(state);
  if (!state) {
      return res.status(204).json({ "message": `No state matches code ${stateCode}.` });
  }
  const funfacts = state.funfacts;
  const funfactsLength = funfacts.length;
  console.log("length" +funfactsLength);
  const index = req.body.index;

  if (funfactsLength >= index){
    console.log("funfact length is: " + funfactsLength + " index is: " + index);
    const arrIndex = index - 1;
    console.log(arrIndex)
    console.log("at zero before splice " + funfacts[0]);
    funfacts.splice(arrIndex, 1);
    console.log("at zero after splice" + funfacts[0]);
    state.funfacts = funfacts;
  }
  else {
    res.status(400).json({ 'message': 'index out of range.' });

  }
  const result = await state.save();
  console.log(result);

  
  res.json(result);
};

module.exports = {
   getAllStates,
   getStateData,
   getFunfacts,
   getCapital,
   getNickname,
   getPopulation,
   getAdmission,
   createFunfact,
   patchFunfact,
   deleteFunfact
}



