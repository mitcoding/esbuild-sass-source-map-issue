const startTime                  = Date.now();
const [, , ...opts]              = process.argv;
const isDev                      = opts.includes("--isDev");
const enableSourceMaps           = isDev ? "inline" : false;
const enableLogging              = isDev ? "info" : "error";
const __dirname                  = process.cwd();
const pathDelimiter              = __dirname.includes("\\") ? "\\" : "/";
const SOURCE_ROOT                = __dirname + pathDelimiter + 'src' + pathDelimiter + 'main' + pathDelimiter + 'webpack';
const OUT_DIR                    = __dirname + pathDelimiter + 'target';
const NODE_MODULES_ROOT          = __dirname + pathDelimiter + 'node_modules';
const entryPoints                = {
    site1: SOURCE_ROOT + '/site/site1/main.js',
    site2: SOURCE_ROOT + '/site/site2/main.js',
    site3: SOURCE_ROOT + '/site/site3/main.js',
    site4: SOURCE_ROOT + '/site/site4/main.js',
    site5: SOURCE_ROOT + '/site/site5/main.js',
    site6: SOURCE_ROOT + '/site/site6/main.js',
    site7: SOURCE_ROOT + '/site/site7/main.js',
    site8: SOURCE_ROOT + '/site/site8/main.js',
    site9: SOURCE_ROOT + '/site/site9/main.js',
    site10: SOURCE_ROOT + '/site/site10/main.js',
    site11: SOURCE_ROOT + '/site/site11/main.js',
    site12: SOURCE_ROOT + '/site/site12/main.js',
    site13: SOURCE_ROOT + '/site/site13/main.js',
    site14: SOURCE_ROOT + '/site/site14/main.js',
    site15: SOURCE_ROOT + '/site/site15/main.js'
};

/* Start library imports */
import browserslist               from "browserslist";
import esbuild                    from 'esbuild';
import fs                         from 'fs';
import packageJson                from './package.json' assert { type: 'json' };
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist";
import { sassPlugin }             from 'esbuild-sass-plugin';
import * as sorcery               from 'sorcery';
import { 
    transform, 
    browserslistToTargets 
}                                 from 'lightningcss';
const esbuildTargets = resolveToEsbuildTarget(browserslist("defaults"), {
    printUnknownTargets: false,
});
const lightningcssTargets = browserslistToTargets(browserslist(packageJson.browserslist));
/* End Library imports */

console.log("Libraries Finished Importing at: " + getFormatedTotalTime(Date.now() - startTime ));

function getFormatedTotalTime(totalTime) {
    let ms = totalTime % 1000;
    let secs = Math.floor(totalTime / 1000) % 60;
    let mins = Math.floor(totalTime / 1000 / 60) % 60;
    let hrs = Math.floor(totalTime / 1000 / 60 / 60);

    return (hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) + ":" : "") + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs) + "." + (ms < 100 ? ("0" + (ms < 10 ? "0" + ms : ms) ) : ms);
}

function mergeSourceMaps(filePath, code, map, origEsbuildFile) {
    if (filePath == null || code == null || map == null) { return code ? code.toString("utf-8") : null; }

    const tempMap = "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + map.toString("base64") + " */";
    const tempDir = OUT_DIR + pathDelimiter + "preMinification";
    const tempFilePath = tempDir + pathDelimiter + (filePath.replaceAll(pathDelimiter, "_"));
    const tempFile = code.toString("utf-8") + tempMap;
    
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFilePath, tempFile, { flush: true });
    fs.writeFileSync(tempFilePath + ".origEsbuild", origEsbuildFile, { flush: true });

    if (fs.existsSync(tempFilePath) ) {
        const chain = sorcery.loadSync(tempFilePath);
        const minifiedMap = "/*# sourceMappingURL=" + chain.apply().toUrl() + " */"
        fs.writeFileSync(tempFilePath + ".merged", code + minifiedMap, { flush: true });
        return code + minifiedMap;
    }

    return tempFile;
}

esbuild.build({
    bundle: true,
    entryPoints: entryPoints,
    entryNames: "clientlib-[name]/[name]",
    external: [
        "*.ico",
        "*.jpg",
        "*.png",
        "*.svg",
        "*.eot",
        "*.woff",
        "*.woff2",
        "*.ttf"
    ],
    logLevel: enableLogging,
    minify: true,
    outdir: OUT_DIR,
    plugins: [
        sassPlugin({
            embedded: true,
            loadPaths: [NODE_MODULES_ROOT],
            quietDeps: true,
            sourceMap: enableSourceMaps ? true : false,
            async transform(source, resolveDir, filePath) {
                const {code, map} = await transform({
                    filename: filePath,
                    code: Buffer.from(source.replaceAll(/\/\*\!/gi, "/*") ),
                    sourceMap: this.sourceMap,
                    minify: this.sourceMap ? false : true,
                    targets: lightningcssTargets
                });
                
                return mergeSourceMaps(filePath, code, map, source);
            }
        })
    ],
    sourcemap: enableSourceMaps,
    target: esbuildTargets
})
.then(() => {
    console.log("esbuild completed at -- " + getFormatedTotalTime(Date.now() - startTime ) );
})
.catch((error) => { 
    console.log("esbuild failed at -- " + getFormatedTotalTime(Date.now() - startTime ) + " with errors: " + error);
    process.exitCode = 1;
});
