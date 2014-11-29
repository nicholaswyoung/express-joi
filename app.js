/**
 * Dependencies
 */
var express = require('express')
,   joi     = require('joi')
,   errbot  = require('errbot')
,   body    = require('body-parser')
,   app     = express();

app.use(body.urlencoded({ extended: false }));
app.use(body.json());

/**
 * Setup Routes
 */
var router = express.Router()
,   schema;

schema = joi.object().keys({
  username: joi.string().alphanum().min(3).max(30),
  password: joi.string().alphanum().required(),
  email: joi.string().email().required()
});

router.use(function (req, res, next) {
  joi.validate(
    req.body,
    schema, { abortEarly: false, stripUnknown: true },
    function (err, value) {
      if (err) return next(errbot.conflict(err.details));
      req.body = value;
      next();
    }
  );
});

router.use(function (req, res) {
  res.json(req.body);
});

/**
 * Use Routes
 */
app.use(router);

/**
 * Error Handling
 */
app.use(function (err, req, res, next) {
  res.status(err.code).end();
});

/**
 * Initialize HTTP Server
 */
app.listen(process.env.PORT || 9292);
