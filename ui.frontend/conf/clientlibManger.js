const glob = require('glob');
const fs = require('fs');
const path = require('path');

const ClientLibManager = class {
    constructor(params) {
        this.clientlibConfig = {};
        this.modules = params.modules;
        this.explicitCLConfig = {};
        this.processModules();  
    }

    processModules() {
        let modules = Object.keys(this.modules);
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            this.clientlibConfig[module] = {};
            this._getExplicitConfigs(module);
        }
        
    }

    configureClientlibObj(module) {
        this._updateCLName(module);
        this._updateCLOutputPath(module);
        this._updateCLCategory(module);
        this._updateCLDependencies(module);
        this._updateCLEmbed(module);
        this._updateCLAssests(module);
    }

    _getCLRoot(module){
        if(this.modules[module].moduleType==='prerequisite') {
            return this._getPrerequisiteCLPath(module);
        } else {
            return this._getComponentCLPath(module);
        }
    }

    _getExplicitProperty(type) {
        let returnPropArray = [];
        if(this.explicitCLConfig[type]) {
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
        this.clientlibConfig[module]['name'] = module;
    }
    
    _updateCLOutputPath(module) {
        const clientLibPath = this.modules[module].moduleType==='prerequisite'? this._getPrerequisiteCLPath(module) : this._getComponentCLPath(module);
        this.clientlibConfig[module]['outputPath'] = clientLibPath;
    }

    _updateCLCategory(module) {
        const categoriesArr = [];
        categoriesArr.push(`sunlife.ca.${module}`, ...this._getExplicitProperty('categories'));
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
            css: this._getAssetInfo('css', module),
            resources: this._getAssetInfo('', module, {ignore: ['**/*.js', '**/*.css']}),
        };
    }

    _getAssetInfo(type, module, configs) {
        return {
            cwd: `clientlib-${module}`,
            files: [`*.${type}`,`**/*.${type}`],
            flatten: false,
            ...configs
        }
    }

    _getExplicitConfigs(module) {
        const configPath = path.join(__dirname, '..', this.modules[module].currentModuleRootDir, 'context.json');
        
        if(fs.existsSync(configPath)) {
            let fileContent = null,
            explicitConfigs = null;
            try {
                fileContent = fs.readFileSync(configPath, { encoding:'utf8'});
                explicitConfigs = JSON.parse(fileContent);
                this.explicitCLConfig = { ...explicitConfigs }
            } 
            catch (err) {
                console.log('Error while reading context.json at -', configPath, err);
                return;
            }
        }

        this.configureClientlibObj(module);
    }
    
    getClientlibs() {
        return this.clientlibConfig;
    }
};

module.exports.clientLibManager = ClientLibManager;