'use strict';
const fs=require('node:fs');let html=fs.readFileSync('template.html','utf8');for(const [tag,file]of [['TOKENS','tokens.css'],['CORE','core.js'],['APP','app.js']])html=html.replace('/*'+tag+'*/',()=>fs.readFileSync(file,'utf8'));fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/EvidenceLens.html',html);console.log('Built dist/EvidenceLens.html');
