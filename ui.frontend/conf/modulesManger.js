const glob = require('glob');
const fs = require('fs');
const path = require('path');
const Util = require('./util');

const APP_PROJECT_DIR = path.join(__dirname,
    '..', 'ui.apps', 'src', 'main', 'content', 'jcr_root', 'apps', 'sunlife');

const UI_APP = 'ui.apps';

const tenant = 'ca';

const util = new Util({ module: 'ModulesManager' });

Util.tenantPrefix = `${tenant}-`;

const explicitModules = [
    'src/main/webpack/components/content/full-header/index_module.js',
    'src/main/webpack/prerequisite/base/index_module.js'];


const ModulesManager = class {
    constructor(params) {
        this.modules = {};
        this.resourceModules = [];
        this.reactComps = [];
        this.debug = params.debug;
        this.tenant = params.tenant;
        this.tenantDir = this.getTenantDir(this.tenant);
        this.moduleVersion = null;
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
                if (!this.modules[md.namespace]) {
                    this.modules[md.namespace] = md;
                } else {
                    this.modules[md.pathReferencedModuleName] = md;
                }
            }
        }

        if (this.reactComps.length) {
            util.logger(`Indexed react-components ${this.reactComps}`);
            this.modules['react-components'].currentModuleRootFile = this.reactComps;
        }
    }

    getModule(name) {
        return this.getModules()[name];
    }

    getModuleName(namespace, pathReferencedModuleName) {
        if (!this.modules[namespace]) {
            return namespace;
        } else {
            return pathReferencedModuleName;
        }
    }

    getModuleDefinition(currentModuleRootFile) {
        let isReactComp = false;
        let isContainResources = false;
        let jsxFiles = [];
        let moduleNamespaceIndex = null;
        let isPrefixModule = false;
        this.moduleVersion = null;

        /* current given root file paths root directory */
        const currentModuleRootDir = currentModuleRootFile.replace('index_module.js', '');

        /* search for jsx file in current directory */
        jsxFiles = glob.sync(`${currentModuleRootDir}**/*jsx`);

        /* if jsx(react) files exist then push then to any array for bundling together as one */
        if (jsxFiles.length) {
            isReactComp = true;
            this.reactComps.push(currentModuleRootFile);
            return
        }

        /* collect root file path chucks in a array */
        const currentModuleRootFileChunks = currentModuleRootFile.split('/');

        this.moduleVersion = currentModuleRootFileChunks.filter(util.getVersion)[0];

        isPrefixModule = currentModuleRootFileChunks.some(util.isTenantPrefixModule);

        currentModuleRootFileChunks.shift();

        if (this.moduleVersion) {
            moduleNamespaceIndex = currentModuleRootFileChunks.indexOf(this.moduleVersion) - 1;
        } else {
            moduleNamespaceIndex = currentModuleRootFileChunks.length - 2
        }

        /* assign a namespace to module as its folder name */
        const namespace = `${currentModuleRootFileChunks[moduleNamespaceIndex]}${this.moduleVersion ? '.' + this.moduleVersion : ''}`;

        /* check module type as component or prerequisite */
        const moduleType = currentModuleRootFileChunks.includes('components') ? 'components' : 'prerequisite';

        const moduleTypeDir = moduleType === 'components' ? 'components' : 'clientlibs';
        const currentModulePathDir = path.join(moduleTypeDir, ...currentModuleRootFileChunks.slice(3, currentModuleRootFileChunks.length - 1));


        const appClientlibRootDir = path.join(this.tenantDir, currentModulePathDir).replace(/\\/g, '/');

        /* make unique module name by appending it with parent folder to avoid duplicate modules if exist */
        const pathReferencedModuleName = [...currentModuleRootFileChunks.slice(3, currentModuleRootFileChunks.length - 1)].join('.');

        const type = moduleType === 'components' ? 'comp-' : '';
        const moduleName = this.getModuleName(namespace, pathReferencedModuleName);

        /* folder name for webpack output bundle for current module */
        const distClientlibDir = `clientlib-${type}${moduleName}`;

        /* if current module contain any resources directory then create webpack copy plugin pattern array to move everything in that clientlib dist folder */
        try {
            if (fs.existsSync(path.join(currentModuleRootDir, 'resources'))) {
                isContainResources = true;
                let files = glob.sync(currentModuleRootDir + 'resources/*.*');
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    this.resourceModules.push(
                        {
                            from: `./${file}`, to: `./${distClientlibDir}/resources`
                        }
                    )
                }
            }
        } catch (e) {
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
            isContainResources,
            isReactComp,
            isPrefixModule
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