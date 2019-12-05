#!/usr/bin/env node

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inquirer = _interopDefault(require('inquirer'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var balancedMatch = _interopDefault(require('balanced-match'));
var constants = _interopDefault(require('constants'));
var glob = _interopDefault(require('glob'));
var plist = _interopDefault(require('plist'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var loadAppId_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


function loadAppId() {
    const envFile = path.join(process.cwd(), '.env');
    if (fs.existsSync(envFile)) {
        const envFileContent = fs.readFileSync(envFile).toString();
        const regex = /^VK_APP_ID=(\d+)/gm;
        const match = regex.exec(envFileContent);
        if (match) {
            return match[1];
        }
    }
}
exports.default = loadAppId;
});

unwrapExports(loadAppId_1);

var findAppDelegate_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



function findFileByAppName(paths, appName) {
    if (paths.length === 0 || !appName) {
        return null;
    }
    for (const path of paths) {
        if (path && path.indexOf(appName) !== -1) {
            return path;
        }
    }
    return null;
}
function findAppDelegate(packageName) {
    const appDelegatePaths = glob.sync('**/AppDelegate.m', {
        ignore: 'node_modules/**',
    });
    const appDelegatePath = findFileByAppName(appDelegatePaths, packageName);
    if (!appDelegatePath) {
        throw new Error('cannot find AppDelegate.m location');
    }
    fs.accessSync(appDelegatePath, constants.F_OK);
    return appDelegatePath;
}
exports.default = findAppDelegate;
});

unwrapExports(findAppDelegate_1);

var getPackageName_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


function getPackageName() {
    const pjsonPath = path.join(process.cwd(), './package.json');
    const content = fs.readFileSync(pjsonPath, 'utf8');
    const pjson = JSON.parse(content);
    return pjson.name || null;
}
exports.default = getPackageName;
});

unwrapExports(getPackageName_1);

var modifyAppDelegate_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PRJ_IMPORT = '#import <VKSdkFramework/VKSdkFramework.h>';
const PODS_IMPORT = '#import "VKSdk.h"';
const APP_DELEGATE_HEADER = `
#if __has_include(<VKSdkFramework/VKSdkFramework.h>)
${PRJ_IMPORT}
#else
${PODS_IMPORT}
#endif
`;
const APP_DELEGATE_CODE = `

//iOS 9 workflow
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
    [VKSdk processOpenURL:url fromApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
    return YES;
}

//iOS 8 and lower
-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    [VKSdk processOpenURL:url fromApplication:sourceApplication];
    return YES;
}
`;
function modifyAppDelegate() {
    try {
        const packageName = getPackageName_1.default();
        const appDelegatePath = findAppDelegate_1.default(packageName);
        let content = fs.readFileSync(appDelegatePath, 'utf8');
        if (content.indexOf(PODS_IMPORT) === -1 &&
            content.indexOf(PRJ_IMPORT) === -1) {
            const match = content.match(/#import "AppDelegate.h"[ \t]*\r*\n/);
            if (match === null) {
                console.warn(`Could not find line '#import "AppDelegate.h"' in file AppDelegate.m.
      You have to update AppDelegate.m manually`);
                return;
            }
            const existingLine = match[0];
            content = content.replace(existingLine, `${existingLine}${APP_DELEGATE_HEADER}\n`);
        }
        else {
            console.warn('VK iOS SDK header already added to AppDelegate.m');
        }
        if (content.indexOf(APP_DELEGATE_CODE) === -1) {
            if (content.indexOf('openURL') !== -1) {
                console.warn(`Looks like you already have openURL method(s) in your AppDelegate.m
      Maybe already added Facebook login? In this case you have to update AppDelegate.m manually`);
                return;
            }
            const start = content.indexOf('didFinishLaunchingWithOptions');
            const tail = content.substr(start);
            const { end } = balancedMatch('{', '}', tail);
            const insertAt = start + end + 1;
            content =
                content.slice(0, insertAt) +
                    APP_DELEGATE_CODE +
                    content.slice(insertAt);
        }
        else {
            console.warn('VK iOS SDK openURL methods already added to AppDelegate.m');
        }
        fs.writeFileSync(appDelegatePath, content);
    }
    catch (e) {
        console.warn(e);
        console.warn('Failed to automatically update AppDelegate.m. Please update it manually.');
    }
}
exports.default = modifyAppDelegate;
});

unwrapExports(modifyAppDelegate_1);

var modifyManifest_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const VK_ACTIVITY_NAME = 'com.vk.sdk.VKServiceActivity';
const MANIFEST_ACTIVITY = ' android:name="com.vk.sdk.VKServiceActivity" android:label="ServiceActivity" android:theme="@style/VK.Transparent" />';
function findFile(file, folder = process.cwd()) {
    const filePaths = glob.sync(path.join('**', file), {
        cwd: folder,
        ignore: ['node_modules/**', '**/build/**', 'Examples/**', 'examples/**'],
    });
    const filePath = filePaths.find((fp) => fp.indexOf('main') >= 0);
    return filePath ? path.join(folder, filePath) : null;
}
function modifyManifest() {
    const manifest = findFile('AndroidManifest.xml');
    if (!manifest) {
        console.warn('Could not find AndroidManifest.xml, please update it manually');
        return;
    }
    try {
        let manifestContent = fs.readFileSync(manifest).toString();
        if (manifestContent.indexOf(VK_ACTIVITY_NAME) === -1) {
            const prevStart = manifestContent.lastIndexOf('<activity');
            const prevEnd = manifestContent.indexOf('/>', prevStart) + 2;
            const matches = manifestContent.match(/$(\W*<activity)/gm);
            const head = matches.pop();
            manifestContent =
                manifestContent.slice(0, prevEnd) +
                    head +
                    MANIFEST_ACTIVITY +
                    manifestContent.slice(prevEnd);
            fs.writeFileSync(manifest, manifestContent);
        }
        else {
            console.warn('Manifest already contains VK activity');
        }
    }
    catch (e) {
        console.warn(e.message);
        console.warn('Failed to automatically update android manifest. Please continue manually.');
    }
}
exports.default = modifyManifest;
});

unwrapExports(modifyManifest_1);

var modifyPlist_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





function modifyPlist(vkAppId) {
    try {
        const packageName = getPackageName_1.default();
        const appDelegatePath = findAppDelegate_1.default(packageName);
        const plistPath = path.join(path.dirname(appDelegatePath), 'Info.plist');
        const plistContents = fs.readFileSync(plistPath, 'utf8');
        const plistJson = plist.parse(plistContents);
        const schemes = plistJson.LSApplicationQueriesSchemes || [];
        if (schemes.indexOf('vk') === -1) {
            schemes.push('vk');
        }
        if (schemes.indexOf('vk-share') === -1) {
            schemes.push('vk-share');
        }
        if (schemes.indexOf('vkauthorize') === -1) {
            schemes.push('vkauthorize');
        }
        plistJson.LSApplicationQueriesSchemes = schemes;
        let urlTypes = plistJson.CFBundleURLTypes || [];
        const urlType = `vk${vkAppId}`;
        urlTypes = urlTypes.filter((ut) => !/vk\d+/.test(ut.CFBundleURLName));
        urlTypes.push({
            CFBundleTypeRole: 'Editor',
            CFBundleURLName: urlType,
            CFBundleURLSchemes: [urlType],
        });
        plistJson.CFBundleURLTypes = urlTypes;
        const newPlistContents = plist.build(plistJson);
        fs.writeFileSync(plistPath, newPlistContents);
    }
    catch (e) {
        console.warn(e);
        console.warn('Failed to automatically update Info.plist. Please update it manually.');
    }
}
exports.default = modifyPlist;
});

unwrapExports(modifyPlist_1);

var saveAppId_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


function saveAppId(appId, replaceExisting) {
    const envFile = path.join(process.cwd(), '.env');
    const keyValue = `VK_APP_ID=${appId}`;
    let envFileContent = keyValue;
    if (fs.existsSync(envFile)) {
        envFileContent = fs.readFileSync(envFile).toString();
        envFileContent = replaceExisting
            ? envFileContent.replace(/^VK_APP_ID=\d+/gm, keyValue)
            : `${envFileContent}\n${keyValue}`;
    }
    fs.writeFileSync(envFile, envFileContent);
}
exports.default = saveAppId;
});

unwrapExports(saveAppId_1);

var postlink_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });






async function postlink() {
    console.info('[react-native-vkontakte-login] Postlink');
    const vkAppId = loadAppId_1.default();
    const answers = await inquirer.prompt([
        {
            name: 'manifest',
            type: 'confirm',
            message: '[react-native-vkontakte-login] Automatically modify Android manifest?',
            default: true,
        },
        {
            name: 'plist',
            type: 'confirm',
            message: '[react-native-vkontakte-login] Automatically modify iOS Info.plist?',
            default: true,
        },
        {
            name: 'delegate',
            type: 'confirm',
            message: '[react-native-vkontakte-login] Automatically modify iOS AppDelegate.m?',
            default: true,
        },
        {
            name: 'appId',
            type: 'input',
            message: '[react-native-vkontakte-login] Enter your VK Application ID',
            initial: vkAppId,
            validate: (appId) => {
                const valid = /\d+/.test(appId);
                return valid || 'VK Application ID can only contain digits';
            },
            when: (hash) => hash.manifest || hash.plist,
        },
    ]);
    if (answers.appId && answers.appId !== vkAppId) {
        saveAppId_1.default(answers.appId, !!vkAppId);
    }
    if (answers.manifest) {
        modifyManifest_1.default();
    }
    if (answers.plist) {
        modifyPlist_1.default(answers.appId);
    }
    if (answers.delegate) {
        modifyAppDelegate_1.default();
    }
}
postlink();
});

var postlink = unwrapExports(postlink_1);

module.exports = postlink;
