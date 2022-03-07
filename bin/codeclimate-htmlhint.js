#!/usr/bin/env node

/** Credit codeclimate-stylelint  */

/* eslint-disable no-console */
const HTMLHint = require('htmlhint').HTMLHint;
const fs = require('fs');
const glob = require('glob');
const { cosmiconfigSync } = require('cosmiconfig');
const CONFIG_PATH = "/config.json"
const CODE_PATH = "/code"

// Set Default extensions to htm and html for now
const options = { extensions: ['.htm', '.html'] };

let engineConfig;
let analysisFiles;

function runTiming(name) {
  const start = new Date();

  return () => {
    const duration = (new Date() - start) / 1000;
    console.error(`•• Timing: .${name}: ${duration}s`);
  };
}

function buildIssueJson(message, filepath) {
  const checkName = message.rule.id;
  const line = message.line || 1;
  const column = message.col || 1;
  const currentDir = process.cwd();
  const severity = (message.type === "error") ? "major" : "minor";

  const issue = {
    type: 'issue',
    categories: (message.type === "error") ? ['Bug Risk'] : ['Style'],
    check_name: checkName,
    description: message.message,
    remediation_points: 50000,
    severity: severity,
    location: {
      path: filepath.replace(`${currentDir}/`, ''),
      positions: {
        begin: {
          line,
          column
        },
        end: {
          line,
          column
        }
      }
    }
  };

  return JSON.stringify(issue);
}

function isFileWithMatchingExtension(file, extensions) {
  const stats = fs.lstatSync(file);
  const extension = `.${file.split('.').pop()}`;
  return stats.isFile() && !stats.isSymbolicLink() && extensions.indexOf(extension) >= 0;
}

function prunePathsWithinSymlinks(paths) {
  // Extracts symlinked paths and filters them out, including any child paths
  const symlinks = paths.filter(p => fs.lstatSync(p).isSymbolicLink());

  return paths.filter(p => {
    let withinSymlink = false;
    symlinks.forEach(symlink => {
      if (p.indexOf(symlink) === 0) {
        withinSymlink = true;
      }
    });
    return !withinSymlink;
  });
}

/** This might not be needed as CC does this automatically */
function exclusionBasedFileListBuilder(excludePaths){
  return extensions => {
    let analysisFiles = [];
    let allFiles = glob.sync(`${CODE_PATH}/**/**`, {});


    allFiles.forEach(function(file){
      
      if(excludePaths.indexOf(file.split(`${CODE_PATH}/`)[1]) < 0) {
        if(!fs.lstatSync(file).isDirectory() && isFileWithMatchingExtension(file, extensions)){
          analysisFiles.push(file);
        }
      }
    });

    return analysisFiles;
  }
}

function inclusionBasedFileListBuilder(includePaths) {
  // Uses glob to expand the files and directories in includePaths, filtering
  // down to match the list of desired extensions.
  return extensions => {
    const filesAnalyzed = [];

    includePaths.forEach(fileOrDirectory => {
      if (/\/$/.test(fileOrDirectory)) {
        // if it ends in a slash, expand and push
        const filesInThisDirectory = glob.sync(`${fileOrDirectory}/**/**`);
        prunePathsWithinSymlinks(filesInThisDirectory).forEach(file => {
          if (isFileWithMatchingExtension(file, extensions)) {
            filesAnalyzed.push(file);
          }
        });
      } else if (isFileWithMatchingExtension(fileOrDirectory, extensions)) {
        filesAnalyzed.push(fileOrDirectory);
      }
    });

    return filesAnalyzed;
  };
}

function obtainHtmlhintConfig() {
  const explorerSync = cosmiconfigSync('htmlhint');
  let result;

  if (options.configFile) {
    result = explorerSync.load(`${process.cwd()}/${options.configFile}`);
  } else {
    result = explorerSync.search(process.cwd());
  }

  if(result){
    return result.config;
  }
  
}


function configEngine() {
  
  let buildFileList;


  if (fs.existsSync(CONFIG_PATH)) {
    engineConfig = JSON.parse(fs.readFileSync(CONFIG_PATH));

    if (engineConfig.include_paths) {
      buildFileList = inclusionBasedFileListBuilder(engineConfig.include_paths);
    } else {
      buildFileList = inclusionBasedFileListBuilder(['./']);
    }

    if (engineConfig.extensions && Array.isArray(engineConfig.extensions)) {
      options.extensions = engineConfig.extensions;
    }

    analysisFiles = buildFileList(options.extensions);

    if (!analysisFiles.length) {
      console.error(`No files to lint with the extensions: "${options.extensions.join('", "')}".`);
      process.exit(0);
    }

    const userConfig = engineConfig.config || {};

    if (userConfig.config) {
      options.configFile = userConfig.config;
    }

  } else {
    buildFileList = inclusionBasedFileListBuilder(['./']);
    analysisFiles = buildFileList(options.extensions);
    // console.log(JSON.stringify(analysisFiles, null, 2) );
  }
}


function analyzeFiles() {
  const htmlhintConfig = obtainHtmlhintConfig();
  
  analysisFiles.forEach(function(path){
    // console.log(`Analyzing file ${path}`)
    const src  = fs.readFileSync(path,'utf8');
    const issues = HTMLHint.verify(src,htmlhintConfig || HTMLHint.defaultRuleset);
 
    if (!issues) {
      return;
    } 
    
    issues.forEach((issue)=>{
      const issueJson = buildIssueJson(issue,path);
      process.stdout.write(`${issueJson}\u0000`);
    })
  })
  
}


configEngine();
analyzeFiles();
