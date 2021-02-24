CC       := clang
FORMAT   := clang-format
CFLAGS   = -Wall -fsyntax-only
FFLAGS   = -i
SOURCE   = $(wildcard ./upload/*.c) $(wildcard ./upload/*.cpp)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)
	$(FORMAT) $(FFLAGS) $(SOURCE)

