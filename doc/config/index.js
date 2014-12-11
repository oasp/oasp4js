"use strict";

var path = require('canonical-path');
var packagePath = __dirname;

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called angularjs. This package depends upon
// the ngdoc,nunjucks and examples packages defined in the dgeni-packages npm module.
module.exports = new Package('angularjs', [
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/examples')
])


.factory(require('../angularTemplate/config/services/errorNamespaceMap'))
.factory(require('./services/getVersion'))



.factory(require('./services/deployments/debug'))
.factory(require('./services/deployments/default'))
//.factory(require('../angularTemplate/config/services/deployments/jquery'))
//.factory(require('../angularTemplate/config/services/deployments/production'))

.factory(require('../angularTemplate/config/inline-tag-defs/type'))


.processor(require('./processors/error-docs'))
.processor(require('../angularTemplate/config/processors/index-page'))
.processor(require('../angularTemplate/config/processors/keywords'))
.processor(require('../angularTemplate/config/processors/pages-data'))



.config(function(dgeni, log, readFilesProcessor, writeFilesProcessor) {

  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'debug';

  readFilesProcessor.basePath = path.resolve(__dirname,'../..');  //go to project root
  readFilesProcessor.sourceFiles = [
    { include: 'app/main/**/*.js', basePath: 'app/main' },
    { include: 'app/oasp-security/**/*.js', basePath: 'app/oasp-security' },
    { include: 'app/oasp-ui/**/*.js', basePath: 'app/oasp-ui' },
    { include: 'app/offer-mgmt/**/*.js', basePath: 'app/offer-mgmt' },
    { include: 'app/table-mgmt/**/*.js', basePath: 'app/table-mgmt' },
    { include: 'app/sales-mgmt/**/*.js', basePath: 'app/sales-mgmt' },
    //in this place you can add more modules
    { include: 'doc/staticContent/**/*.ngdoc', basePath: 'doc/staticContent' }
  ];

  writeFilesProcessor.outputFolder = 'doc/dist/docs';

})

.config(function(parseTagsProcessor) {
  parseTagsProcessor.tagDefinitions.push(require('../angularTemplate/config/tag-defs/sortOrder'));  

})



.config(function(inlineTagProcessor, typeInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(typeInlineTagDef);
})


.config(function(templateFinder) {
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));

})


.config(function(computePathsProcessor, computeIdsProcessor) {

  computePathsProcessor.pathTemplates.push({
    docTypes: ['error'],
    pathTemplate: 'error/${namespace}/${name}',
    outputPathTemplate: 'partials/error/${namespace}/${name}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['errorNamespace'],
    pathTemplate: 'error/${name}',
    outputPathTemplate: 'partials/error/${name}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['overview'],
    getPath: function(doc) {
      var docPath = path.dirname(doc.fileInfo.relativePath);
      if ( doc.fileInfo.baseName !== 'index' ) {
        docPath = path.join(docPath, doc.fileInfo.baseName);
      }
      return docPath;
    },
    outputPathTemplate: 'partials/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['e2e-test'],
    getPath: function() {},
    outputPathTemplate: 'ptore2e/${example.id}/${deployment.name}_test.js'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module' ],
    pathTemplate: '${area}/${name}',
    outputPathTemplate: 'partials/${area}/${name}.html'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['componentGroup' ],
    pathTemplate: '${area}/${moduleName}/${groupType}',
    outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}.html'
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview', 'e2e-test', 'indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['error', 'errorNamespace'],
    getId: function(doc) { return 'error:' + doc.name; },
    getAliases: function(doc) { return [doc.id]; }
  });
})

.config(function(checkAnchorLinksProcessor) {
  checkAnchorLinksProcessor.base = '/';
  // We are only interested in docs that have an area (i.e. they are pages)
  checkAnchorLinksProcessor.checkDoc = function(doc) { return doc.area; };
})


.config(function(
  generateIndexPagesProcessor,
  generateProtractorTestsProcessor,
  generateExamplesProcessor,
  debugDeployment, defaultDeployment) {
  //jqueryDeployment, productionDeployment) {

  generateIndexPagesProcessor.deployments = [
    debugDeployment,
    defaultDeployment,
    //jqueryDeployment,
    //productionDeployment
  ];

  generateProtractorTestsProcessor.deployments = [
    defaultDeployment,
    //jqueryDeployment
  ];

  generateProtractorTestsProcessor.basePath = 'dist/docs/';

  generateExamplesProcessor.deployments = [
    debugDeployment,
    defaultDeployment,
    //jqueryDeployment,
    //productionDeployment
  ];
});