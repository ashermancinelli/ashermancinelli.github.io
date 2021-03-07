CFLAGS := -I/usr/local/Cellar/googletest/1.10.0/include
CFLAGS += -L/usr/local/Cellar/googletest/1.10.0/lib -lgtest -lgtest_main
CFLAGS += -lpthread -std=c++17
CXX    =  clang++

all:
	$(CXX) addone_test.cpp $(CFLAGS) -o tests
