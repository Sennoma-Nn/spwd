#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const defaultConfig = {
    color: {
        fileOrDir: '\x1b[31m',
        split: '\x1b[32m',
        abbr: '\x1b[31m\x1b[3m'
    },
    splitChar: {
        input: '/',
        output: ' > '
    },
    rootDirFlag: {
        enable: 'yes',
        flag: '/'
    },
    abbr: {
        homeDir: {
            enable: 'yes',
            path: '$HOME',
            flag: '~'
        },
        dir: {
            enable: 'yes',
            length: 1,
            fullDirs: 2
        }
    }
};

const configPath = path.join(process.env.HOME, '.config', 'spwd', 'config.json');

if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), 'utf-8');
}

let config = defaultConfig;

try {
    const configFileContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configFileContent);
} catch (error) {
    config = defaultConfig;
}

const reset = '\x1b[0m';

const replaceStart = (str, old, re) => {
    if (str.startsWith(old)) {
        return re + str.slice(old.length);
    }
    return str;
};

let pwd = process.argv.slice(2)[0] || process.env.PWD;

let homeDir = config.abbr.homeDir.path;
if (homeDir === '$HOME') {
    homeDir = process.env.HOME;
}

if (config.abbr.homeDir.enable === 'yes') {
    pwd = replaceStart(pwd, homeDir, config.abbr.homeDir.flag);
}

let sp_pwd = pwd.split(config.splitChar.input)
if (pwd !== '/') {
    if (sp_pwd.length > 0 && sp_pwd[sp_pwd.length - 1] === '') {
        sp_pwd.pop();
    }
    if (config.rootDirFlag.enable === 'yes') {
        if (sp_pwd[0] === "") sp_pwd.shift();
    }
}

let out = '';
if (pwd[0] === '/' && config.rootDirFlag.enable === 'yes') {
    out = config.color.fileOrDir + config.rootDirFlag.flag;
}

for (let i = 0; i < sp_pwd.length; i++) {
    const dir = sp_pwd[i];
    if (out !== '') {
        out += reset;
        out += config.color.split;
        out += config.splitChar.output;
    }

    out += reset;
    if (config.abbr.dir.enable === 'yes' && i < sp_pwd.length - config.abbr.dir.fullDirs) {
        out += config.color.abbr;
        out += dir.slice(0, config.abbr.dir.length);
    } else {
        out += config.color.fileOrDir;
        out += dir;
    }
}

process.stdout.write(out + reset);
