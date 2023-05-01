const glob = require('glob');
const fs = require('fs');
const path = require('path');

const APP_PROJECT_DIR = path.join(__dirname,
    '..','ui.apps','src','main','content','jcr_root','apps','sunlife');

const UI_APP = 'ui.apps';

const tenant = 'ca';

const explicitModules = [
'src/main/webpack/components/content/full-header/index_module.js',
'src/main/webpack/prerequisite/base/index_module.js'];


const ModulesManager = class {
    constructor(params) {
        this.modules = {};
        this.resourceModules = [];
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
        const modules = this.debug ? explicitModules : glob.sync('*/**/index_module.js');
       
        for (let i = 0; i < modules.length; i++) {
            const modulePath = modules[i];
            const md = this.getModuleDefinition(modulePath);
            if (md) {
                if(!this.modules[md.namespace]) {
                    this.modules[md.namespace] = md;
                } else {
                    this.modules[md.pathReferencedModuleName] = md;
                }
            }
        }
    }

    getModule(name) {
        return this.getModules()[name];
    }

    getModuleName(namespace, pathReferencedModuleName) {
        if(!this.modules[namespace]) {
            return namespace;
        } else {
            return pathReferencedModuleName;
        }
    }

    getModuleDefinition(currentModuleRootFile) {
        const currentModuleRootFileChunks = currentModuleRootFile.split('/');

        currentModuleRootFileChunks.shift();

        const namespace = currentModuleRootFileChunks[currentModuleRootFileChunks.length - 2];
        const moduleType = currentModuleRootFileChunks.includes('components') ? 'components' : 'prerequisite';
        const currentModulePathDir = moduleType ==='components' ? path.join('components', ...currentModuleRootFileChunks.slice(3, currentModuleRootFileChunks.length - 1)) : 'clientlibs' ;
        const appClientlibRootDir = path.join(this.tenantDir, currentModulePathDir).replace(/\\/g, '/');
        const currentModuleRootDir = currentModuleRootFile.replace('index_module.js', '');
        const pathReferencedModuleName = [...currentModuleRootFileChunks.slice(3, currentModuleRootFileChunks.length - 1)].join('.');
        
        const type = moduleType === 'components' ? 'comp-':'';
        const moduleName =  this.getModuleName(namespace, pathReferencedModuleName);
        const distClientlibDir = `clientlib-${type}${moduleName}`;
        
        let isContainResources = false;

        try {
            if (fs.existsSync(path.join(currentModuleRootDir,'resources'))) {
                isContainResources = true;
                let files = glob.sync(currentModuleRootDir+'resources/*.*');
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    this.resourceModules.push(
                        {
                            from: `./${file}`, to: `./${distClientlibDir}/resources`
                        }
                    )
                }
            } 
        } catch(e) {
            console.log("An error occurred.", currentModuleRootDir, e)
        }

        return {
            namespace,
            currentModuleRootFile,
            currentModuleRootDir,
            moduleType,
            appClientlibRootDir,
            pathReferencedModuleName,
            distClientlibDir,
            isContainResources
        };
    }

    getModules() {
        return this.modules;
    }

    getResourceModules() {
        return this.resourceModules;
    }
};


module.exports.ModulesManager = ModulesManager;

module.exports.instance = new ModulesManager({
    namespace: 'sunlife',
    debug: false,
    tenant: tenant
});