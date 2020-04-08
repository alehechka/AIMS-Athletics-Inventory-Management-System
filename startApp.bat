@echo off

start cmd /K "cd .\backend && npm install && npm run dev"

start cmd /K "cd .\frontend && npm install && npm start"

