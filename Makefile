################################### Include Directories ########################################
ZUMOLIB 			= ./ZumoLibrary
FREERTOSINC 		= ../FreeRTOS/Source/include
FREERTOSARMCM3 		= ../FreeRTOS/Source/portable/GCC/ARM_CM3
MQTTCLIENTSOURCE 	= ../paho.mqtt.embedded-c/MQTTClient-C/src
MQTTPACKETSOURCE 	= ../paho.mqtt.embedded-c/MQTTPacket/src
MQTTFREERTOS 		= ../paho.mqtt.embedded-c/MQTTClient-C/src/FreeRTOS
GENSOURCEPSOC		= ./Generated_Source/PSoC5/
#################################################################################################

######################################## defines ################################################
DEBUG 	= DEBUG
MQTT_T	= MQTT_TASK
MQTT_H  = MQTTCLIENT_PLATFORM_HEADER=MQTTFreeRTOS.h 
#################################################################################################

CC       := clang
CFLAGS   = -Wall -fsyntax-only -I$(ZUMOLIB) -I$(FREERTOSINC) -I$(FREERTOSARMCM3) -I$(MQTTCLIENTSOURCE) -I$(MQTTFREERTOS) -I$(MQTTPACKETSOURCE) -I$(GENSOURCEPSOC) -D$(DEBUG) -D$(MQTT_T) -D$(MQTT_H)
LDFLAGS  =
SOURCE   = $(wildcard *.c) $(wildcard *.cpp)
OBJFILES = $(SOURCE:.c=.o)
TARGET   = PSOC

all: $(TARGET)

$(TARGET):
	$(CC) $(CFLAGS) $(SOURCE) $(LDFLAGS)
 
clean:
	rm -f $(OBJFILES) 
