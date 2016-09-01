/**
 * 请注意，并不是真的md5签名，还是时间戳，缩短文件名而已，嘻嘻....
 * init({
 * 	'inPath':'',
 * 	'staticUrl':'http://static.xuebadev.com/activity-eqtest/',
 * 	'outPath':'dist'
 *  'imageVersion':'1.0'
 * });
 */
var path = require('path');
var fs = require('fs');
/**
 * 遍历当前文件目录的所有html文件,自定义目录,传相对地址
 */
function init(opts){
	var files = getAllFiles(opts,'.html');
	files.forEach(function(filename){
		updateVersion(opts,filename);
	});
}
/**
 * 遍历目录下所有文件
 */
function getAllFiles(opts,filetype){
	var pwd = process.cwd();
	if(opts['inPath'] != ''){
		pwd = process.cwd()+'/'+opts['inPath'];
	}
	var result = [];
	var files = fs.readdirSync(pwd,'utf8');
	files.forEach(function(item){
		if(path.extname(item) == filetype){
			result.push(item);
		}
	});
	return result;
}
/**
 * 更新html文件内的css,js文件链接的版本号
 */
function updateVersion(opts,filename){
	var pwd = process.cwd();
	var readFileName;
	if(opts['inPath']){
		readFileName = pwd+'/'+opts['inPath']+'/'+filename;
	}else{
		readFileName = pwd+'/'+filename;
	}
	fs.readFile(readFileName,'utf8',function(err,data){
		if(err){ console.log(err);}
		// 抽出src,href
		var reg = /\s(href|src).*\.\w{2,3}/g;
		var result = data.replace(reg,function(args){
			if(args.indexOf('http') >= 0){
				return args;
			}
			var timestamp = Date.now();
			var fileUrl = args.split('=');
			var attrString = fileUrl[0];
			var name = fileUrl[1].slice(1);
			var tempResult = '';
			if(args.indexOf('.png') > 0||args.indexOf('.jpg') > 0){
				tempResult = attrString+'='+fileUrl[1].slice(0,1)+opts['staticUrl']+name+'?v='+opts['imageVersion'];
			}else{
				tempResult = attrString+'='+fileUrl[1].slice(0,1)+opts['staticUrl']+name+'?v='+timestamp;
			}
			return tempResult;
		});
		// 重写文件
		var writeFileName = pwd+'/'+opts['outPath']+'/'+filename;
		saveFile(writeFileName,result);
	});
}
/**
 * 覆盖本地文件
 */
function saveFile(filename,data){
	fs.writeFile(filename,data,'utf8',function(err){
		if(err){ console.log(err);}
	});
}
module.exports = init;