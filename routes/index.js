/**
 * GET for the index.html template
 */
module.exports = function(utils, env, nunjucksEnv, appName) {

  var allowJS = env.get("JAVASCRIPT_ENABLED", false),
      appURL = env.get("HOSTNAME"),
      audience = env.get("AUDIENCE"),
      makeEndpoint = env.get("MAKE_ENDPOINT"),
      moment = require("moment"),
      previewLoader = env.get("PREVIEW_LOADER"),
      together = env.get("USE_TOGETHERJS") ? env.get("TOGETHERJS") : false,
      userbarEndpoint = env.get("USERBAR");

  return {
    index: function(req, res) {
      var content;
      moment.lang(req.localeInfo.momentLang);

      if (req.pageData) {
        content = req.pageData.replace(/'/g, '\\\'').replace(/\n/g, '\\n').replace(/\//g,'\\\/');
      } else {
        var tpl = nunjucksEnv.getTemplate("friendlycode/templates/default-content.html");
        content = tpl.render({
          title: req.gettext("Your Awesome Webpage created on"),
          time: moment().format('llll'),
          text: req.gettext("Make something amazing with the web")
        });
      }

      if (req.body.pageOperation === "remix") {
        content = content.replace(/<title([^>]*)>/, "<title$1>Remix of ");
      }

      res.render('index.html', {
        appname: appName,
        appURL: appURL,
        audience: audience,
        content: content,
        allowJS: allowJS,
        csrf: req.session._csrf,
        email: req.session.email || '',
        HTTP_STATIC_URL: '/',
        MAKE_ENDPOINT: makeEndpoint,
        pageOperation: req.body.pageOperation,
        previewLoader: previewLoader,
        origin: req.params.id,
        makeUrl: req.makeUrl,
        together: together,
        userbar: userbarEndpoint
      });
    },

    friendlycodeRoutes: function(app) {
      app.get( '/default-content', function( req, res ) {
        res.render('friendlycode/templates/default-content.html');
      });

      app.get( '/error-dialog', function( req, res ) {
        res.render('friendlycode/templates/error-dialog.html');
      });

      app.get( '/confirm-dialog', function( req, res ) {
        res.render('friendlycode/templates/confirm-dialog.html');
      });

      app.get( '/publish-dialog', function( req, res ) {
        res.render('friendlycode/templates/publish-dialog.html');
      });

      app.get( '/help-msg', function( req, res ) {
        res.render('friendlycode/templates/help-msg.html');
      });

      app.get( '/error-msg', function( req, res ) {
        res.render('friendlycode/templates/error-msg.html');
      });

      app.get( '/nav-options', function( req, res ) {
        res.render('friendlycode/templates/nav-options.html');
      });

      app.get( '/details-form', function( req, res ) {
        res.render('friendlycode/templates/details-form.html');
      });

      app.get( '/slowparse/spec/errors.base.html', function( req, res ) {
        res.render('/slowparse/spec/errors.base.html');
      });

      app.get( '/slowparse/spec/errors.forbidjs.html', function( req, res ) {
        res.render('/slowparse/spec/errors.forbidjs.html');
      });
    }
  };
};

