const glob = require('glob');
const fs = require('fs');
const path = require('path');


const ClientLibManager = class {
    constructor(params) {
        this.clientlibConfig = {};
        this.modules = params.modules;
        this.explicitCLConfig = {};
        this.tenant = params.tenant;
        this._isExplicitModule = false;
        this._isComponentModule = false;
        this.processModules();
    }

    processModules() {
        let modules = Object.keys(this.modules);
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            this.clientlibConfig[module] = {};
            this.setModuleType(module);
            this._getExplicitConfigs(module);
        }

    }

    setModuleType(module) {
        this._isComponentModule = this.modules[module].moduleType === 'components' ? true : false;
    }

    configureClientlibObj(module) {
        this._updateCLName(module);
        this._updateCLOutputPath(module);
        this._updateCLCategory(module);
        this._updateCLDependencies(module);
        this._updateCLEmbed(module);
        this._updateCLAssests(module);
    }

    _getCLRoot(module) {
        if (!this._isComponentModule) {
            return this._getPrerequisiteCLPath(module);
        } else {
            return this._getComponentCLPath(module);
        }
    }

    _getExplicitProperty(type) {
        let returnPropArray = [];
        if (this.explicitCLConfig[type]) {
            returnPropArray.push(...this.explicitCLConfig[type].split(','));
        }
        return returnPropArray;
    }

    _getPrerequisiteCLPath(module) {
        return `${this.modules[module].appClientlibRootDir}/${this.modules[module].namespace}`;
    }

    _getComponentCLPath(module) {
        return `${this.modules[module].appClientlibRootDir}/clientlibs`;
    }

    _updateCLName(module) {
        if (this._isExplicitModule) {
            this.clientlibConfig[module]['name'] = this.explicitCLConfig.name;
            return;
        }
        this.clientlibConfig[module]['name'] = module;
    }

    _updateCLOutputPath(module) {
        const clientlibRootDir = this.modules[module].appClientlibRootDir;
        const clientLibPath = this._isComponentModule ? `${clientlibRootDir}/clientlibs` : `${clientlibRootDir}/`;
        this.clientlibConfig[module]['outputPath'] = clientLibPath;
    }

    _updateCLCategory(module) {
        const categoriesArr = [];

        if (this._isExplicitModule || this.modules[module].isPrefixModule) {

            categoriesArr.push(...this._getExplicitProperty('categories'));

            if (this.modules[module].isReactComp) {
                categoriesArr.push(`sunlife.${this.tenant}-react-component`);
            }

            if (this._isComponentModule) {
                categoriesArr.push(`sunlife.${this.tenant}-components`, `sunlife.${this.tenant}-component.${module}`);
            }

            this.clientlibConfig[module]['categories'] = categoriesArr;
            return
        }


        if (this._isComponentModule) {
            categoriesArr.push(`sunlife.${this.tenant}.component`, `sunlife.${this.tenant}.components.content.${module}`);
        }

        if (this.modules[module].isReactComp) {
            categoriesArr.push(`sunlife.${this.tenant}.react-component`);
        }

        categoriesArr.push(`sunlife.${this.tenant}.${module}`, ...this._getExplicitProperty('categories'));

        this.clientlibConfig[module]['categories'] = categoriesArr;
    }

    _updateCLEmbed(module) {
        const embedArr = [];
        embedArr.push(...this._getExplicitProperty('embed'));
        this.clientlibConfig[module]['embed'] = embedArr;
    }

    _updateCLDependencies(module) {
        const dependenciesArr = [];
        dependenciesArr.push(...this._getExplicitProperty('dependencies'));
        this.clientlibConfig[module]['dependencies'] = dependenciesArr;
    }

    _updateCLAssests(module) {
        this.clientlibConfig[module]['assets'] = {
            js: this._getAssetInfo('js', module),
            css: this._getAssetInfo('css', module)
        };

        if (this.modules[module].isContainResources) {
            this.clientlibConfig[module]['assets']['resources'] = { base: "resources", files: ['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2', '*.png', '*.otf', '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.png', '**/*.otf'] };
        }
    }

    _getAssetInfo(type, module, configs) {
        return {
            cwd: this.modules[module].distClientlibDir,
            files: [`*.${type}`, `**/*.${type}`],
            flatten: false,
            ...configs
        }
    }

    _getExplicitConfigs(module) {
        const configPath = path.join(__dirname, '..', this.modules[module].currentModuleRootDir, 'context.json');

        if (fs.existsSync(configPath)) {
            let fileContent = null,
                explicitConfigs = null;
            try {
                fileContent = fs.readFileSync(configPath, { encoding: 'utf8' });
                explicitConfigs = JSON.parse(fileContent);
                this._isExplicitModule = explicitConfigs.isExplicitModule ? true : false;
                this.explicitCLConfig = { ...explicitConfigs }
            }
            catch (err) {
                console.log('Error while reading context.json at -', configPath, err);
                return;
            }
        } else {
            this.explicitCLConfig = {};
            this._isExplicitModule = false;
        }

        this.configureClientlibObj(module);
    }

    getClientlibs() {
        return this.clientlibConfig;
    }

    get isExplicitModule() {
        return this._isExplicitModule;
    }

    set isExplicitModule(flag) {
        this._isExplicitModule = flag;
    }
};

module.exports.clientLibManager = ClientLibManager;