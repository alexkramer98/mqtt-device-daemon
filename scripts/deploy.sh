npx tsc
ssh alex@bridgepi.local "rm -r ~/server/build/*"
rsync .env alex@bridgepi.local:~/server/build/.env
rsync package.json alex@bridgepi.local:~/server/package.json
rsync -r build/ alex@bridgepi.local:~/server/build
rsync -r hisense-certs/ alex@bridgepi.local:~/server/hisense-certs
ssh bridgepi.local "cd ~/server && yarn install && sudo supervisorctl restart mqtt-daemon"