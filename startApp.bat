@echo off

start cmd /K "cd .\backend && npm install && npm dev"

start cmd /K "cd .\frontend && npm install && npm start"

