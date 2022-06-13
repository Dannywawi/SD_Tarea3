# SISTEMAS DISTRIBUIDOS - TAREA 3
## Maximiliano Sanders - Danny Ortega

El presente repositorio corresponde al trabajo realizado para la tarea numero tres de Sistema Distribuidos, en el se vera la implementación de Cassandra.

## Cassandra

Cassandra

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

### Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿Cómo los nodos se conectan? ¿Qué ocurre cuando un cliente realiza una petición a uno de los nodos? ¿Qué ocurre cuando uno de los nodos se desconecta? ¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

PREGUNTA 1

### Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son estos? ¿Cuál es la ventaja de uno sobre otro? ¿Cuál utilizaría usted para en el caso actual y por que? Justifique apropiadamente su respuesta.

PREGUNTA 2

### Teniendo en cuenta el contexto del problema ¿Usted cree que la solucion propuesta es la correcta? ¿Que ocurre cuando se quiere escalar en la solucion? ¿Qu ́e mejoras implementaria? Oriente su respuesta hacia el Sharding (la replicacion/distribucion de los datos) y comente una estrategia que podria seguir para ordenar los datos.

PREGUNTA 3