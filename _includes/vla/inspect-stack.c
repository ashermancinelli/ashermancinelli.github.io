#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>

#define SAVESTACK(X) asm( "mov %%rsp, %0" : "=rm" ( X ));

int main(int argc, char** argv) {
  int len = atoi(getenv("LEN"));
  int idx = atoi(getenv("IDX"));
  register uint64_t sp0, sp1;

  SAVESTACK(sp0);

  int vla[len];

  SAVESTACK(sp1);

  for (int i=0; i < len; i++)
    vla[i] = i;

  printf("&vla[0]: %ld\nbefore: %ld\nafter: %ld\ndiff: %ld\n", (uint64_t)&vla[0], sp0, sp1, sp0-sp1);
  return vla[idx];
}
