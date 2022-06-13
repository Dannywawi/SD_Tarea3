# SISTEMAS DISTRIBUIDOS - TAREA 2
## Maximiliano Sanders - Danny Ortega

El presente repositorio corresponde al trabajo realizado para la tarea numero dos de Sistema Distribuidos, en el se vera la implementación de de un broker Kafka.

## KAFKA

Kafka corresponde a un sistema de transmisión de datos de forma distribuida, en el se permite procesar, almacenar y publicar un flujo de datos. Su arquitectura permite la creación de broker los cual permite ciertas particiones de un topic distribuyendo y replicando la información.

## INSTALACION

En carpeta consumer:
```bash
docker build -t consumer
```

En carpeta producer:
```bash
docker build -t producer
```

En la carpeta general:
```bash
docker-compose up -d
```
## PREGUNTAS

### ¿Por que Kafka funciona bien en este escenario?

Kafka trabaja a modo de intermediario dentro de la estructura formada, por lo tanto, dado su arquitectura de productor - consumidor puede identificar los login realizados en en el sistemas y realizar el bloqueo necesario en caso de necesitarlo.

### Basado en las tecnologías que se tienen a disposición (Kafka, Backend) ¿Que se haría para manejar una gran cantidad de usuario al mismo tiempo?

La cantidad de usuarios que se maneja al mismo tiempo va a venir directamente de la arquitectura conformada por Kafka. La creación de broker contiene particiones de un topic, cada topic se puede particionar permitiendo la distribución de transmisión de flujo de datos, así mismo, replicar y balancear el almacenamiento de datos, por ende, con la creación de mas broker es posible distribuir a mayor escala el sistema y permitir la creación de mayores consumidores que formen parte del servicio al mismo tiempo.