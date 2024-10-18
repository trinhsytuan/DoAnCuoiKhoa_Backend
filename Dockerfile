FROM buildpack-deps:buster

RUN apt-get update && apt-get install -y --no-install-recommends \
                bison \
                flex \
    && rm -rf /var/lib/apt/lists/*

ENV PBC_VERSION 0.5.14

RUN set -ex \
        \
        && wget -O pbc.tar.gz "https://crypto.stanford.edu/pbc/files/pbc-$PBC_VERSION.tar.gz" \
        && mkdir -p /usr/src/pbc \
        && tar -xzC /usr/src/pbc --strip-components=1 -f pbc.tar.gz \
        && rm pbc.tar.gz \
	    \
	    && cd /usr/src/pbc \
        && ./configure \
        && make \
        && make install \
        && rm -rf /usr/src/pbc
WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/src/Crypto
RUN g++ -o GiaiMa GiaiMa.cpp -lgmp -lpbc
RUN g++ -o MaHoa MaHoa.cpp -lgmp -lpbc
RUN g++ -o MaHoaT MaHoaT.cpp -lgmp -lpbc

FROM node:16-alpine3.17
RUN apk update && apk upgrade && apk add --no-cache git




COPY package.json .
RUN npm install && npm cache clean --force

RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]
