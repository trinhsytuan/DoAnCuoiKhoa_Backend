#!/bin/bash

# Bước 1: Git pull
echo "Bước 1: Git pull"
git pull git@github.com:trinhsytuan/DoAnCuoiKhoa_Backend.git
cd src/Crypto
g++ -o GiaiMa GiaiMa.cpp -lgmp -lpbc
g++ -o MaHoa MaHoa.cpp -lgmp -lpbc
g++ -o MaHoaT MaHoaT.cpp -lgmp -lpbc
cd ../../
yarn install
forever restartall
echo "Bước 2: Frontend"
cd /home/tsharesytuannet/tshare.sytuan.net/public_html
echo "Clone lại"
rm -rf DoAnCuoiKhoa_FrontEnd
rm -rf node_modules
rm *
git clone git@github.com:trinhsytuan/DoAnCuoiKhoa_FrontEnd.git
cd DoAnCuoiKhoa_FrontEnd
echo "Bước 3: yarn install"
yarn install
echo "Bước 4: Build web"
npm run build
00
exit