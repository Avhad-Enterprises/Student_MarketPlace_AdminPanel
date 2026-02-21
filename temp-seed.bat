@echo off
cd ..\student-marketplace-backend-v2
npx ts-node -r tsconfig-paths/register src/scripts/create-sim-table.ts > ..\student_marketplace_frontend\create_table_output.log 2>&1
npx ts-node -r tsconfig-paths/register src/scripts/seed-sim-cards.ts > ..\student_marketplace_frontend\seed_output.log 2>&1
