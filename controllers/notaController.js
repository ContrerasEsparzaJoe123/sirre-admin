const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/nota.model.js');
const Nota = mongoose.model('nota');

router.get('/', (req, res) => {
    res.render("nota/addOrEdit", {
        viewTitle: "Crear Notas"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var nota = new Nota();
    nota.titulo = req.body.titulo;
    nota.nota = req.body.nota;
    nota.fecha = req.fecha;
    
    
    nota.save((err, doc) => {
        if (!err)
            res.redirect('nota/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("nota/addOrEdit", {
                    viewTitle: "Insertar nota",
                    nota: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Nota.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('nota/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("nota/addOrEdit", {
                    viewTitle: 'Actualizar nota',
                    nota: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



router.get('/list', (req, res) => {
    Nota.find((err, docs) => {
        if (!err) {
            res.render("nota/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving nota list :' + err);
        }
    }).lean();
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Nota.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("nota/addOrEdit", {
                viewTitle: "Actualizar nota",
                nota: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    Nota.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/nota/list');
        }
        else { console.log('Error in nota delete :' + err); }
    });
});

module.exports = router;