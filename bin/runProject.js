 'use strict'; require('graceful-fs').gracefulify(require('fs'));require('react-native/local-cli/server/checkNodeVersion')();require('react-native/setupBabel')();const path = require('path');const fs = require("fs");const {project_dir, API_LEVEL,IDX_PATH, IDX_MOD, DEV} = require("./config/common");let is_dev = DEV;if(DEV){   if(process.argv.length > 2 && (process.argv[2] == "--test")){    is_dev = false;  }}const reset_cache = is_dev||process.argv.includes("--reset-cache") || process.argv.includes("-r");const miotNativePath = path.join(project_dir, "miot-sdk", "native");if(!is_dev){   const MetroResolver = require("metro-resolver");  MetroResolver._miot_resolve = MetroResolver.resolve;  MetroResolver.resolve = (context, moduleName, platform)=>{    if(!context._miot_dirExists){      context._miot_dirExists = context.dirExists;      
    context.dirExists = p=>{         if(p.startsWith(miotNativePath)){          return true;        }        return context._miot_dirExists(p);      };     context._miot_doesFileExist = context.doesFileExist;      context.doesFileExist = p=>{         if(p.startsWith(miotNativePath)){          const name = path.relative(miotNativePath, p);          if(name.indexOf(".") != name.lastIndexOf(".")            || !name.endsWith(".js")            || name.startsWith("android.")            || name.startsWith("ios.")            || name.startsWith("common.")          ){             return false;          };           return true;        }        return context._miot_doesFileExist(p);      }    }    return MetroResolver._miot_resolve(context, moduleName, platform);  }}const DependencyGraph = require("metro/src/node-haste/DependencyGraph");
    DependencyGraph._miot_load = DependencyGraph.load;DependencyGraph.load=opt=>{  return DependencyGraph._miot_load(opt).then(graph=>{     if(!is_dev){      const cache = graph._moduleCache;      cache._miot_getModule = cache.getModule;      cache.getModule = filepath=>{        const m = cache._miot_getModule(filepath);        if(m._sourceCode == null && filepath.startsWith(miotNativePath)){          m._sourceCode = "";         }         return m;      }    }    console.log('ready');    return graph;  });}; const {DEFAULT} = require('react-native/local-cli/util/Config');DEFAULT.getTransformModulePath=()=>{  return path.join(project_dir, "bin", "config", is_dev?"transformerForBuild.js":"transformer.js")}
 function findArgValue(name){  const argv = process.argv;  for(var i = 0; i < argv.length; i ++){     if(name == argv[i]){       i ++;      if(i == argv.length){        return false;      }       const val = argv[i];      if(val && val.length > 0){        if(val.charAt(0) == '-'){          return null;        }        return val;      }       return false;    }  }  return false;}const host = findArgValue("--host") || findArgValue("-h");const port = findArgValue("--port") || findArgValue("-p"); process.argv = ["", "", "start"]; if(reset_cache){    process.argv = [...process.argv, "--reset-cache"]}if(host){  process.argv = [...process.argv, "--host", host]}if(port){  process.argv = [...process.argv, "--port", port]} require('react-native/local-cli/cliEntry').run();