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
    },
    specialFormat: {
        enable: 'no',
        start: '',
        end: ''
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

const isEnable = (enable, isTrue, isFalse) => {
    if (isTrue !== undefined) {
        return enable === 'yes' ? isTrue || '' : isFalse || '';
    }
    return enable === 'yes';
}

let pwd = process.argv.slice(2)[0] || process.env.PWD;

let homeDir = config.abbr.homeDir.path;
if (homeDir === '$HOME') {
    homeDir = process.env.HOME;
}

if (isEnable(config.abbr.homeDir.enable)) {
    pwd = replaceStart(pwd, homeDir, config.abbr.homeDir.flag);
}

let sp_pwd = pwd.split(config.splitChar.input)
if (pwd !== '/') {
    if (sp_pwd.length > 0 && sp_pwd[sp_pwd.length - 1] === '') {
        sp_pwd.pop();
    }
    if (isEnable(config.rootDirFlag.enable)) {
        if (sp_pwd[0] === "") sp_pwd.shift();
    }
}

let out = '';
if (pwd[0] === '/' && isEnable(config.rootDirFlag.enable)) {
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
    if (isEnable(config.abbr.dir.enable) && i < sp_pwd.length - config.abbr.dir.fullDirs) {
        let len = config.abbr.dir.length;
        out += config.color.abbr;
        out += dir.slice(0, Number(dir[0] === '.') + len);
    } else {
        out += config.color.fileOrDir;
        out += dir;
    }
}

out = (isEnable(config.specialFormat.enable, config.specialFormat.start))
    + out
    + reset
    + (isEnable(config.specialFormat.enable, config.specialFormat.end));
process.stdout.write(out);
