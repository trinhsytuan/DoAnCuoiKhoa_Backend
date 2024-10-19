#include <iostream>
#include<pbc/pbc.h>
#include<stdio.h>
#include<fstream>
#include <sstream>
#include<vector>
#include <cstring>
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
char* convertStringToChar(string str) {

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
void xulydauvao(string s) {
    istringstream ss(s);
    string i;
    while (getline(ss, i, ',')) {
        slgm.push_back(stoi(i));
    }
}
void Decryption(int PERSON, string khoabimat, string Hdr1, string Hdr2) {
    element_t tu, mau, temp, knew;
    element_init_GT(tu,pairing);
    element_init_G1(Hdr[0], pairing);
    element_init_G1(Hdr[1], pairing);
    element_set_str(Hdr[0], convertStringToChar((Hdr1)), PBC_CONVERT_BASE);

    element_set_str(Hdr[1], convertStringToChar((Hdr2)), PBC_CONVERT_BASE);
    pairing_apply(tu, paramsGlobal.params[PERSON], Hdr[1], pairing);

    element_init_G1(temp, pairing);
    element_set_str(temp, convertStringToChar(khoabimat), PBC_CONVERT_BASE);

    for (int i=0;i<slgm.size();i++)
    {
        int j=slgm[i];
        if (j==PERSON) continue;
        element_mul(temp,temp,paramsGlobal.params[maxn+1-j+PERSON]);
    }
    element_init_GT(mau, pairing);
    pairing_apply(mau, temp, Hdr[0], pairing);
    element_init_GT(knew, pairing);
    element_div(knew,tu,mau);
    element_printf("%B", knew);

}
int main(int argc, char const *argv[]) {
    //Quy ước số 1 là tập giải mã
    string khoabimat = "[" + string(argv[argc-6]) + argv[argc-5] + "]";
    freopen("dauvao.txt", "rt", stdin);
    //Nguoi giai ma
    //Tap nhung nguoi co ban ma
    //Khoa bi mat cua nguoi nhan
    //Ban ma Hdr1, Hdr2
    int nguoigiaima = stoi(argv[argc-8]);
    string m = argv[argc-7];
    xulydauvao(m);
    SETUP_PARAMS();
    setup();
    string Hdr1 = "[" + string(argv[argc-4]) + argv[argc-3] + "]";
    string Hdr2 = "[" + string(argv[argc-2]) + argv[argc-1] + "]";
    Decryption(nguoigiaima, khoabimat, Hdr1, Hdr2);
}