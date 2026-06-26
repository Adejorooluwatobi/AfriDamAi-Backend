@echo off
echo ========================================
echo Real-Time Chat Testing Helper
echo ========================================
echo.

:menu
echo What would you like to do?
echo.
echo 1. Start Backend Server
echo 2. Open Test Client in Browser
echo 3. Create a Test Chat (requires token)
echo 4. View Backend Logs
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto open_client
if "%choice%"=="3" goto create_chat
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto end
goto menu

:start_backend
echo.
echo Starting backend server...
echo Press Ctrl+C to stop the server
echo.
npm run start:dev
goto menu

:open_client
echo.
echo Opening test client in browser...
start test-chat-client.html
echo.
echo Test client opened!
echo.
echo INSTRUCTIONS:
echo 1. Enter Backend URL: http://localhost:3000
echo 2. Enter your JWT token
echo 3. Enter Chat ID
echo 4. Enter User ID
echo 5. Click Connect
echo.
echo Open another browser window for the second user!
echo.
pause
goto menu

:create_chat
echo.
echo ========================================
echo Create a Test Chat
echo ========================================
echo.
set /p token="Enter JWT Token: "
set /p user1="Enter User 1 ID: "
set /p user2="Enter User 2 ID: "
echo.
echo Creating chat...
echo.
curl -X POST http://localhost:3000/chats -H "Authorization: Bearer %token%" -H "Content-Type: application/json" -d "{\"participant1Id\":\"%user1%\",\"participant2Id\":\"%user2%\"}"
echo.
echo.
echo COPY THE CHAT ID FROM ABOVE!
echo.
pause
goto menu

:view_logs
echo.
echo Opening backend logs...
echo Check your terminal where you started the backend
echo.
pause
goto menu

:end
echo.
echo Goodbye!
exit
