#include <stdlib.h>
#include <stdio.h>

/* Contrived example that uses VLA */
int main(int argc, char** argv) {
  int len = atoi(getenv("LEN"));
  int idx = atoi(getenv("IDX"));
  int vla[len];
  return vla[idx];
}
