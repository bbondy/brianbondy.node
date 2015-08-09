var phantom = require('phantom');

function createPDF(serverURI, cb) {
  phantom.create(function(ph){
    ph.createPage(function(page) {
      page.open(serverURI + '/resume/html', function() {
        page.render('src/public/pdf/BrianRBondy_Resume.pdf', function() {
          console.log('PDF created');
          cb();
          ph.exit();
        });
      });
    });
  });
}

module.exports = createPDF;
