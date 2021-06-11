const express = require('express')
const path = require('path')
const pegparser = require('markdown-parser/src/parser.js')
const markdown = require("markdown").markdown
const hbs = require('hbs')
const app = express()
const port = 3000
const fs = require('fs')
const {createProxyMiddleware} = require('http-proxy-middleware')
const watch = require('node-watch')
// const hostname = '157.227.227.253';

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'hbs')
const readPaths = (viewsPath) => {
    let index = []
    fs.readdirSync(viewsPath).forEach(function(name) {
        const filePath = path.join(viewsPath, name)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            if (fs.existsSync(filePath + '/README.md')) {
                const fileContents = fs.readFileSync(filePath + '/README.md', 'utf8')
                let result = pegparser.parse(fileContents)
                let content = {}
                content.title = result.headings[0] ? result.headings[0] : ''
                content.subTitle = result.headings[1] ? result.headings[1] : ''
                content.path = filePath.replace(/.*views/, '/views').replace(/\\/gi, '/')
                content.children = readPaths(filePath)
                index.push(content)
            }
        }
    })
    return index
}

app.get('/', (req, res) => {
    let viewsPath = path.join(__dirname, 'src') + '/views'
    let index = {}
    index.list = readPaths(viewsPath)
    res.render('index', index)
})

app.get(/.views\/.*.html$/, (req, res) => {
    let viewsPath = path.join(__dirname, 'src') + req.path.replace('.html', '').replace(/\/\//g, '\\')
    let content = {}
    if (fs.existsSync(viewsPath + '/index.hbs')) {
        let module = req.path.replace('/views/','').replace(/\/.*/,'');
        const mdFileContent = fs.readFileSync(viewsPath + '/README.md', 'utf8')
        const mdContents = pegparser.parse(mdFileContent)
        const fileContent = fs.readFileSync(viewsPath + '/index.hbs', 'utf8')
        let source = hbs.handlebars.compile(fileContent)
        let data = mdContents.codes[0] ? mdContents.codes[0].code ? JSON.parse(mdContents.codes[0].code) : {} : {}
        content.componentName = mdContents.headings[0] ? mdContents.headings[0] : ''
        content.componentContent = source(data)
        content.componentInformation = markdown.toHTML(mdFileContent)
        if(module != 'core') {
            content.module = module;
        }
    }
    res.render('component', content)
})

watch(path.join(__dirname, 'src/views'), { recursive: true, filter: /\.hbs$/ }, function(evt, name) {
    const fileContent = fs.readFileSync(name, 'utf8')
    const hbsName = name.replace(/.*views/, '').replace(/\\/gi, '-').replace(/\//gi, '-').replace(/^-/, '')
    hbs.handlebars.registerPartial(hbsName ? hbsName.substr(0, hbsName.lastIndexOf('-')) : name.replace('.hbs', ''), fileContent)
})

const loadHandlebars = function(viewsPath) {
    fs.readdirSync(viewsPath).forEach(function(name) {
        if (name.endsWith('.hbs')) {
            const fileContent = fs.readFileSync(viewsPath + '/' + name, 'utf8')
            const hbsName = viewsPath.replace(/.*views/, '').replace(/\\/gi, '-').replace(/\//gi, '-').replace(/^-/, '')
            hbs.handlebars.registerPartial(hbsName ? hbsName : name.replace('.hbs', ''), fileContent)
        }
        const filePath = path.join(viewsPath, name)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            loadHandlebars(filePath)
        }
    })
}

const loadServices = function() {
    const fileContents = fs.readFileSync('services.properties', 'utf8').split(/\r?\n/);
    fileContents.forEach(function(line){
        const props = line.split('=');
        app.use(props[0], createProxyMiddleware({target: props[1], changeOrigin: true})); 
    });
}

loadHandlebars(path.join(__dirname, 'src/views'));
loadServices();

// app.listen(port, hostname, () => console.log(`Sunlife core app started at http://${hostname}:${port}/`))

app.listen(port, () => console.log(`Sunlife core app started at http://localhost:3001!`))