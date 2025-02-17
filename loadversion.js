const latestversion = "1.4";
const latestdevversion = "1.4.1-DEV-SNAPSHOT+20240606";
const patchnotes = {
    "1": [],
    "1.1": ["Added Computer saving"],
    "1.2": ["Added settings.txt in Computer/system", "Added autosave and show file extensions settings"],
    "1.2.1": ["Added more settings"],
    "1.2.2": ["Added functionality to new settings"],
    "1.2.3": ["Temp fixed issue where changing font size makes windows impossible to move better fix will be added in the future"],
    "1.3": ["Added taskbar with file manager more will be added in the future","Fixed an unknown issue where if you closed a file manager all new ones would break","Fixed issue where opening a text editor would remove the ability to drag file manager windows","Better fix for issue where changing font size makes windows impossible to move","Added dev mode"],
    "1.3.1": ["Added better looking windows","Added Background images","added langv2"],
    "1.4": ["Added ability to delete files/folders through console using the .delete() method"]
};
let newin = false;

document.addEventListener("DOMContentLoaded", () => {
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    };

    if (localStorage.getItem("Computer") !== undefined && localStorage.getItem("Computer") !== null) {
        newin = false;
        let computer = JSON.parse(localStorage.getItem("Computer"));

        const scripts = [
            `${computer.version}/utility.js`,
            `${computer.version}/cpu.js`,
            `${computer.version}/gpu.js`,
            `${computer.version}/computer.js`,
            `${computer.version}/window manager.js`,
            `${computer.version}/tab.js`,
            `${computer.version}/files.js`,
            `${computer.version}/fm.js`,
            `${computer.version}/lang.js`,
            `${computer.version}/text.js`,
            `${computer.version}/game.js`,
            `${computer.version}/script.js`
        ];

        Promise.all(scripts.map(src => loadScript(src)))
            .then(() => {
                function reviver(key, value) {
                    if (value && typeof value === 'object' && value.__type) {
                        switch (value.__type) {
                            case 'File':
                                return new File(value.name, value.type, value.contents);
                            case 'Folder':
                                const folder = new Folder(value.name);
                                folder.contents = value.contents.map(item => reviver(null, item));
                                return folder;
                            default:
                                return value;
                        }
                    }
                    return value;
                }
                let computer = JSON.parse(localStorage.getItem("Computer"), reviver);

                Computer.totalram = computer.totalram;
                Computer.storage = computer.storage;
                Computer.storageuse = computer.storageuse;
                Computer.totalstorage = computer.totalstorage;
                Computer.version = computer.version;
                Computer.settings = computer.settings
                if (compareVersions(computer.version, "1.2.2") >= 0) {
                    document.body.style.backgroundColor = Computer.settings.system.backgroundColor
                    document.body.style.fontSize = Computer.settings.system.fontSize
                    document.body.style.color = Computer.settings.system.fontColor
                    document.body.style.backgroundImage = `url('${Computer.settings.system.backgroundimg}')`
                }

                if (compareVersions(computer.version, "1.3") >= 0) {
                    Computer.dev = computer.dev
                }

                if (compareVersions(computer.version, latestversion) < 0) {
                    let fullpatch = "";

                    // Get versions higher than the current version
                    const higherVersions = Object.keys(patchnotes)
                        .filter(version => compareVersions(version, computer.version) > 0)
                        .sort(compareVersions);

                    // Cycle through each version and its contents
                    higherVersions.forEach(version => {
                        fullpatch += `- ${version}\n`
                        patchnotes[version].forEach(note => {
                            fullpatch += `• ${note}\n`;
                        });
                    });

                    if (confirm(`New update ${latestversion} is available. Do you want to update? \n${fullpatch}`)) {
                        update();
                    }
                }

                if (compareVersions(computer.version, latestdevversion) < 0 && Computer.dev) {
                    let fullpatch = "";

                    // Get versions higher than the current version
                    const higherVersions = Object.keys(patchnotes)
                        .filter(version => compareVersions(version, computer.version) > 0)
                        .sort(compareVersions);

                    // Cycle through each version and its contents
                    higherVersions.forEach(version => {
                        fullpatch += `- ${version}\n`
                        patchnotes[version].forEach(note => {
                            fullpatch += `• ${note}\n`;
                        });
                    });

                    if (confirm(`New dev update ${latestdevversion} is available. Do you want to update? \n${fullpatch}`)) {
                        devupdate();
                    }
                }
            })
            .catch(error => {
                console.error('Error loading scripts:', error);
            });
    } else {
        newin = true;
        const scripts = [
            `${latestversion}/utility.js`,
            `${latestversion}/cpu.js`,
            `${latestversion}/gpu.js`,
            `${latestversion}/computer.js`,
            `${latestversion}/window manager.js`,
            `${latestversion}/tab.js`,
            `${latestversion}/files.js`,
            `${latestversion}/fm.js`,
            `${latestversion}/lang.js`,
            `${latestversion}/text.js`,
            `${latestversion}/game.js`,
            `${latestversion}/script.js`
        ];

        Promise.all(scripts.map(src => loadScript(src)))
            .catch(error => {
                console.error('Error loading scripts:', error);
            });
    }
});

function update() {
    if (compareVersions(Computer.version, "1.2") < 0) {
        Computer.storage[0].contents[0].saddFile(new File("Settings","txt",JSON.stringify({
            fm:{
                "showfileextention":true
            },
            text:{
                "autoSave":false
            }
        })))
        
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.2.1") < 0) {
        Computer.settings.system = {
            "backgroundColor":"white",
            "fontSize":"16px",
            "fontColor":"black",
        }
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.3") < 0) {
        Computer.dev = false
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    Computer.storage[0].contents[0].contents[0].contents = JSON.stringify(Computer.settings)
    Computer.version = latestversion;
    Computer.saveState();
    location.reload();
}


function devupdate() {
    if (compareVersions(Computer.version, "1.2") < 0) {
        Computer.storage[0].contents[0].saddFile(new File("Settings","txt",JSON.stringify({
            fm:{
                "showfileextention":true
            },
            text:{
                "autoSave":false
            }
        })))
        
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.2.1") < 0) {
        Computer.settings.system = {
            "backgroundColor":"white",
            "fontSize":"16px",
            "fontColor":"black",
        }
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.3") < 0) {
        Computer.dev = false
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.3.1") < 0) {
        Computer.settings.system.backgroundimg = ""
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    Computer.storage[0].contents[0].contents[0].contents = JSON.stringify(Computer.settings)
    Computer.version = latestdevversion;
    Computer.saveState();
    location.reload();
}

function devdowngrade(v) {
    if (compareVersions(v, "1.2.1") < 0) {
        delete Computer.settings.system;
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(v, "1.2") < 0) {
        Computer.storage[0].contents[0].contents.shift()
        
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }
    if (compareVersions(Computer.version, "1.3") < 0) {
        delete Computer.storage[1].contents[2]
        // Computer.storage[1].saddFile(new File("settings", "exe", "call js console.log('nothing yet...')"))
    }


    Computer.version = v;
    Computer.saveState();
    location.reload();
}

function compareVersions(v1, v2) {
    const parseVersion = (version) => {
        const parts = String(version).split('.');
        return parts.map(part => {
            const match = part.match(/(\d+)([a-z]*)/i);
            return [parseInt(match[1], 10), match[2] || ''];
        });
    };

    const v1Parts = parseVersion(v1);
    const v2Parts = parseVersion(v2);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const [v1Num, v1Alpha] = v1Parts[i] || [0, ''];
        const [v2Num, v2Alpha] = v2Parts[i] || [0, ''];
        
        if (v1Num > v2Num) return 1;
        if (v1Num < v2Num) return -1;
        if (v1Alpha > v2Alpha) return 1;
        if (v1Alpha < v2Alpha) return -1;
    }
    return 0;
}
