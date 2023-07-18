var express = require('express');
var router = express.Router();
const { findAboutService, updateAboutService } = require('../service/aboutService');

router.get('/', async function (req, res, next) {
    res.send(await findAboutService());
});

router.post('/', async function (req, res, next) {
    res.send(await updateAboutService(req.body.url));
})

module.exports = router;
