CC       := clang
CFLAGS   = -Wall -fsyntax-only
LDFLAGS  =
SOURCE   = $(wildcard *.c) $(wildcard *.cpp)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)
