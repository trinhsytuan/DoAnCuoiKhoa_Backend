#!/bin/bash

# Bước 1: Git pull
echo "Bước 1: Git pull"
git pull git@github.com:trinhsytuan/DoAnCuoiKhoa_Backend.git
cd src/Crypto
g++ -o GiaiMa GiaiMa.cpp -lgmp -lpbc
g++ -o MaHoa MaHoa.cpp -lgmp -lpbc
g++ -o MaHoaT MaHoaT.cpp -lgmp -lpbc
cd ../../
forever restartall
echo "Bước 2: Frontend"
cd /home/tsharesytuannet/tshare.sytuan.net/public_html/DoAnCuoiKhoa_FrontEnd
git pull git@github.com:trinhsytuan/DoAnCuoiKhoa_FrontEnd.git
echo "Bước 3: yarn install"
yarn install
echo "Bước 4: Build web"
npm run build
00
exit