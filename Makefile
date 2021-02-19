CC       := clang
CFLAGS   = -Wall -fsyntax-only
LDFLAGS  =
SOURCE   = $(wildcard *.c)
OBJFILES = $(SOURCE:.c=.o)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)
clean:
	rm -f $(OBJFILES) 
