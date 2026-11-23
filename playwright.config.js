const {defineConfig}=require('@playwright/test');module.exports=defineConfig({testDir:'./tests',testMatch:'browser.spec.js',workers:1,use:{headless:true},reporter:'list'});
