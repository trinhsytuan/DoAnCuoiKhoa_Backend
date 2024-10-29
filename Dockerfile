FROM buildpack-deps:buster

# Cài đặt các gói cần thiết cho cả Node.js và C++ build
RUN apt-get update && apt-get install -y --no-install-recommends \
    bison \
    flex \
    wget \
    g++ \
    libgmp-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt Node.js
ENV NODE_VERSION 16.20.0
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Cài đặt thư viện PBC
ENV PBC_VERSION 0.5.14
RUN wget -O pbc.tar.gz "https://crypto.stanford.edu/pbc/files/pbc-$PBC_VERSION.tar.gz" \
    && mkdir -p /usr/src/pbc \
    && tar -xzC /usr/src/pbc --strip-components=1 -f pbc.tar.gz \
    && rm pbc.tar.gz \
    && cd /usr/src/pbc \
    && ./configure \
    && make \
    && make install \
    && rm -rf /usr/src/pbc

# Thiết lập thư mục làm việc và copy source code
WORKDIR /usr/src/app
COPY . .

# Biên dịch các chương trình C++ trong thư mục Crypto
WORKDIR /usr/src/app/src/Crypto
RUN g++ -o GiaiMa GiaiMa.cpp -lgmp -lpbc \
    && g++ -o MaHoa MaHoa.cpp -lgmp -lpbc \
    && g++ -o MaHoaT MaHoaT.cpp -lgmp -lpbc

# Trở lại thư mục chính và cài đặt các phụ thuộc Node.js
WORKDIR /usr/src/app
RUN npm install && npm cache clean --force

# Mở cổng và thiết lập lệnh chạy ứng dụng
EXPOSE 3000
CMD ["node", "server.js"]
