@echo off
cd ..\student-marketplace-backend-v2
npx ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/server.ts
