CC       := clang
CFLAGS   = -Wall -fsyntax-only
SOURCE   = $(wildcard ./upload/*.c) $(wildcard ./upload/*.cpp)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)
