/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const path = require('path');
const modulesManager = require('./conf/modulesManger').instance;
const ClientLibManager = require('./conf/clientlibManger').clientLibManager;

const tenant = 'ca';
const BUILD_DIR = path.join(__dirname, 'dist');
const CLIENTLIB_DIR = path.join(
  __dirname,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'sunlife',
  tenant,
  'clientlibs'
);

const allModuleDefinations = modulesManager.getModules();

const clientLibsConfig = new ClientLibManager({
  modules: allModuleDefinations,
  tenant: tenant
});

const clientlibsConfigObj = clientLibsConfig.getClientlibs();

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml'
};

function getLibs() {
  let libs = [];

  let clientlibsArr = Object.keys(clientlibsConfigObj);

  for (let i = 0; i < clientlibsArr.length; i++) {
    const clientlib = clientlibsArr[i];
    let clientlibConfig = clientlibsConfigObj[clientlib];
    clientlibConfig.outputPath = path.join(
      __dirname,
      '..',
      ...clientlibConfig.outputPath.split('/')
    );
    libs.push({ ...libsBaseConfig, ...clientlibConfig })
  }

  return libs;
}

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  verbose: true,
  libs: getLibs()
};
