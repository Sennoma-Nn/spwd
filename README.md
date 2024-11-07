### Description

`spwd` is a command-line tool designed to display the current working directory in a formatted and customizable way. It allows users to abbreviate directory names, use custom colors, and format paths according to their preferences.

### Features

- Abbreviates directory names for a cleaner display.
- Customizable colors for directory and separator displays.
- Supports home directory abbreviation with `~`.
- Configurable through a JSON file located at `~/.config/spwd/config.json`.
- Special formatting options for output.

### Installation

You can install `spwd` globally using npm:

```bash
$ npm install -g spwd
```

Alternatively, you can clone the repository and install it manually:

1. Clone the repository:

   ```bash
   $ git clone https://github.com/Sennoma-Nn/spwd.git
   $ cd spwd
   ```

2. Install the package globally:

   ```bash
   $ npm install -g
   ```

### Usage

Simply run the `spwd` command in your terminal:

```bash
$ spwd
```

This will output the formatted current working directory based on the configuration.

### Configuration

- The configuration file is located at `~/.config/spwd/config.json`.
- You can customize colors, abbreviations, and other formatting options by editing this file.

### Example Configuration

```json
{
    "color": {
        "fileOrDir": "\x1b[31m",
        "split": "\x1b[32m",
        "abbr": "\x1b[31m\x1b[3m"
    },
    "splitChar": {
        "input": "/",
        "output": " > "
    },
    "rootDirFlag": {
        "enable": "yes",
        "flag": "/"
    },
    "abbr": {
        "homeDir": {
            "enable": "yes",
            "path": "$HOME",
            "flag": "~"
        },
        "dir": {
            "enable": "yes",
            "length": 1,
            "fullDirs": 2
        }
    },
    "specialFormat": {
        "enable": "no",
        "start": "",
        "end": ""
    }
}
```

### License

This project is licensed under the MIT License.