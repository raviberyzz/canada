const glob = require('glob');
const fs = require('fs');
const path = require('path');

const APP_PROJECT_DIR = path.join(__dirname,
    '..','ui.apps','src','main','content','jcr_root','apps','sunlife');

const UI_APP = 'ui.apps';

const tenant = 'ca';


const ModulesManager = class {
    constructor(params) {
        this.modules = {};
        this.debug = params.debug;
        this.tenant = params.tenant;
        this.tenantDir = this.getTenantDir(this.tenant);
        this.initModules();
    }

    initModules() {
        this.findModules();
    }

    getTenantDir(tenant) {
        const tenantDir = path.join(APP_PROJECT_DIR, tenant);
        return UI_APP.concat(tenantDir.split(UI_APP)[1]);
    }

    findModules() {
        const modules = glob.sync('*/**/index_module.js');

        for (let i = 0; i < modules.length; i++) {
            const modulePath = modules[i];
            const md = this.getModuleDefinition(modulePath);
            if (md) this.modules[md.namespace] = md;
        }
    }

    getModule(name) {
        return this.getModules()[name];
    }

    getModuleDefinition(currentModuleRootFile) {
        const currentModuleRootFileChunks = currentModuleRootFile.split('/');

        currentModuleRootFileChunks.shift();

        const namespace = currentModuleRootFileChunks[currentModuleRootFileChunks.length - 2];
        const moduleType = currentModuleRootFileChunks.includes('components') ? 'components' : 'prerequisite';
        const currentModulePathDir = moduleType ==='components' ? path.join('components', ...currentModuleRootFileChunks.slice(3, currentModuleRootFileChunks.length - 1)) : 'clientlibs' ;
        const appClientlibRootDir = path.join(this.tenantDir, currentModulePathDir).replace(/\\/g, '/');
        const currentModuleRootDir = currentModuleRootFile.replace('index_module.js', '');

        return {
            namespace,
            currentModuleRootFile,
            currentModuleRootDir,
            moduleType,
            appClientlibRootDir,
        };
    }

    getModules() {
        console.log('this.modules--->', this.modules);
        return this.modules;
    }
};


module.exports.ModulesManager = ModulesManager;

module.exports.instance = new ModulesManager({
    namespace: 'sunlife',
    debug: false,
    tenant: tenant
});