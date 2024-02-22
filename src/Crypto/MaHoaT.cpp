#include <iostream>
#include<pbc.h>
#include<stdio.h>
#include<fstream>
#include <cstring>
#include <sstream>
#include<vector>
#define maxn 200
using namespace std;
pairing_t pairing;
#define PBC_CONVERT_BASE 10
struct global_parameters
{
    element_t g;
    element_t alpha;
    element_t params[2*maxn+10];
    element_t v;
    element_t y;
    element_t d[2*maxn+10];
};

void SETUP_PARAMS ()
{
    FILE* file = fopen("output_pairing.txt", "rb");
    char param[1024];
    size_t  count = fread(param, 1, 9999,  file);
    if (!count) pbc_die("input error");
    pairing_init_set_buf(pairing, param, count);
    if (!pairing_is_symmetric(pairing)) pbc_die("pairing must be symmetric");
}
global_parameters paramsGlobal;
element_t Hdr[2];
vector<int>slgm;
char* readFile() {
    string str;
    getline(cin,str);
    char* buffer = new char[str.length() + 1];
    strcpy(buffer, str.c_str());
    return buffer;
}
void setup() {
    element_init_G1(paramsGlobal.g, pairing);
    element_set_str(paramsGlobal.g, readFile(), PBC_CONVERT_BASE);
    element_init_Zr(paramsGlobal.alpha, pairing);
    element_set_str(paramsGlobal.alpha, readFile(), PBC_CONVERT_BASE);
    for(int i = 0; i <= 2*maxn;i++) {
        element_init_G1(paramsGlobal.params[i], pairing);
        element_set_str(paramsGlobal.params[i], readFile(), PBC_CONVERT_BASE);

    }
    element_init_Zr(paramsGlobal.y, pairing);
    element_set_str(paramsGlobal.y, readFile(), PBC_CONVERT_BASE);
    element_init_G1(paramsGlobal.v, pairing);
    element_set_str(paramsGlobal.v, readFile(), PBC_CONVERT_BASE);
    element_clear(paramsGlobal.params[maxn+1]);
}
void Encryption(const char* tx) {
    element_t t;
    element_init_Zr(t, pairing);
    element_set_str(t, tx, PBC_CONVERT_BASE);
    element_t K;
    element_init_GT(K, pairing);
    pairing_apply(K, paramsGlobal.params[maxn], paramsGlobal.params[1], pairing);
    element_pow_zn(K, K, t);
    element_init_G1(Hdr[0], pairing);
    element_pow_zn(Hdr[0], paramsGlobal.g, t);
    element_init_same_as(Hdr[1], paramsGlobal.v);
    element_set(Hdr[1], paramsGlobal.v);


    for (int i=0;i<slgm.size();i++)
    {
        int j=slgm[i];

        element_mul(Hdr[1], Hdr[1], paramsGlobal.params[maxn+1-j]);
    }
    element_pow_zn(Hdr[1], Hdr[1], t);
    element_printf("%B\n", Hdr[0]);
    element_printf("%B\n", Hdr[1]);
    element_printf("%B\n", t);
}
void xulydauvao(string s) {
    stringstream ss(s);
    int i;

    while (ss >> i) {
        slgm.push_back(i);
        if (ss.peek() == ',')
            ss.ignore();
    }
}
int main(int argc, char *argv[]) {
    //Quy ước số 1 là tập giải mã
    freopen("dauvao.txt", "rt", stdin);
    string m = "";

    for(int i = 3; i < argc;i++) {
        m += argv[i];
    }
    SETUP_PARAMS();
    setup();
    xulydauvao(m);
    Encryption(argv[2]);
}