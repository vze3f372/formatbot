CC       := clang
CFLAGS   = -Wall -fsyntax-only
LDFLAGS  =
SOURCE   = $(wildcard *.c)
OBJFILES = $(SOURCE:.c=.o)
TARGET   = testapp

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)

PSOC: 
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS) -I ./ZumoLibrary -I ../FreeRTOS/Source/include -I ../FreeRTOS/Source/portable/GCC/ARM_CM3 -I ../paho.mqtt.embedded-c/MQTTClient-C/src  -I ../paho.mqtt.embedded-c/MQTTClient-C/src/FreeRTOS -I ../paho.mqtt.embedded-c/MQTTPacket/src -I ./Generated_Source/PSoC5/ -I ../FreeRTOS/Source/include/ -I ./ZumoLibrary/ -D DEBUG -D MQTT_TASK -D MQTTCLIENT_PLATFORM_HEADER=MQTTFreeRTOS.h

clean:
	rm -f $(OBJFILES) 
