CC       := clang
FORMAT   := clang-format
CFLAGS   = -Wall -fsyntax-only
FFLAGS   = -i
SOURCE   = $(wildcard ./upload/*.c) $(wildcard ./upload/*.cpp)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(FORMAT) $(FFLAGS) $(SOURCE)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)

