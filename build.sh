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