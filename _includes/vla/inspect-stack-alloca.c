#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <alloca.h>

#define SAVESTACK(X) register uint64_t X; asm( "mov %%rsp, %0" : "=rm" ( X ));

int main(int argc, char** argv) {
  int len = atoi(getenv("LEN"));
  int idx = atoi(getenv("IDX"));

  SAVESTACK(sp0);

  // int vla[len];
  int* vla = alloca(len * sizeof(int));

  SAVESTACK(sp1);

  for (int i=0; i < len; i++)
    vla[i] = i;

  printf("before: %ld\nafter: %ld\ndiff: %ld\n", sp0, sp1, sp0-sp1);
  return vla[idx];
}
