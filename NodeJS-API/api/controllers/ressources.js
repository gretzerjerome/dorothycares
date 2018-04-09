const mongoose = require("mongoose");

const Ressources = require ("../models/ressources");

exports.get_all_ressources = (req, res, next) => {
  Ressources.find()
    .select("_id name intro installation documentation tutorials")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        ressources: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            intro: doc.intro,
            installation: doc.installation,
            documentation: doc.documentation,
            tutorials: doc.tutorials,
            request: {
              type: "GET",
              url: "http://localhost:3000/ressources/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.get_ressource = (req, res, next) => {
  Ressources.findById(req.params.ressourceId)
    .exec()
    .then(ressources => {
      if (!ressources) {
        return res.status(404).json({
          message: "Ressources not found"
        });
      }
      res.status(200).json({
        ressources: ressources,
        request: {
          type: "GET",
          url: "http://localhost:3000/ressources/"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.create_ressource = (req, res, next) => {
  const newRessources = new Ressources({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    intro: req.body.intro,
    installation: req.body.installation,
    documentation: req.body.documentation,
    tutorials: req.body.tutorials
  });
  newRessources
  .save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "Created ressources successfully",
      createdRessources: {
          name: result.name,
          intro: result.intro,
          installation: result.installation,
          documentation: result.documentation,
          tutorials: result.tutorials,
          _id: result._id,
          request: {
              type: 'GET',
              url: "http://localhost:3000/ressources/" + result._id
          }
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}

exports.update_ressource = (req, res, next) => {
  
  const id = req.params.ressourceId;

  Ressources.findOneAndUpdate({ _id: id }, req.body, { new:false })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Ressources updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/ressources/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.delete_ressource = (req, res, next) => {
  const id = req.params.ressourceId;
  Ressources.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Ressources deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/ressources/',
              body: { name: 'String', price: 'Number' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}