# SISTEMAS DISTRIBUIDOS - TAREA 3
## Maximiliano Sanders - Danny Ortega

El presente repositorio corresponde al trabajo realizado para la tarea numero tres de Sistema Distribuidos, en el se vera la implementación de Cassandra.

## Cassandra

Cassandra corresponde a una base de datos NoSQL, pemitiendo un alto rendimiento debido a su escalabilidad, alto rendimiento de procesamiento y tolerancia a fallos.

## Instalacion

Proceso de instalacion:

En carpeta general:
```bash
docker build -t cliente 
```

```bash
docker-compose up -d
```

## Preguntas

### Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿Cómo los nodos se conectan? ¿Qué ocurre cuando un cliente realiza una petición a uno de los nodos? ¿Qué ocurre cuando uno de los nodos se desconecta? ¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

Cassandra trabaja bajo una arquitectura PEER TO PEER, donde todos los nodos que existen dentro del clúster se encuentran conectado con un nodo vecino, logrando que los datos trabajados se distribuyan de uno a otro a lo largo del clúster, replicando datos en caso de cualquier falla.

Los nodos se conectan unos a otros bajo la arquitectura mencionada, la comunicación peer to peer entre nodos viene proveniente de Gossip, un protocolo que cumple esta función de comunicación y compartir los estados e información de localización de los nodos del clúster.

Cuando se realiza la petición a uno de los nodos, la información es solicitada desde el cliente al nodo coordinador solicitado el cual transmite la información al resto de los nodos dentro del clúster.

Cuando uno de los nodos se desconectan, el clúster con el resto de los nodos siguen su funcionamiento correctamente. La arquitectura presentada por Cassandra permite que los datos se distribuyan a lo largo de los nodos dentro del clúster, replicando la información en caso de fallo.

La red generada entre los nodos por Cassandra es eficiente frente a grandes servidores de trabajo con procesamientos de datos a grandes escalas. El funcionamiento peer to peer no solo permite replica y distribución de datos, si no que también, conexión directa de un nodo a otro para solicitud de información, por lo tanto, para caso de gran cantidad de datos se necesitara una gran escalabilidad, lo cual deriva a un proceso de rendimiento mas lento a no se de contar con grandes procesadores.

En Cassandra si existe balanceo de carga, este esta dado por RandomPartitioner, encargado de distribuir la información en todos los nodos con una partición aleatoria.


### Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son estos? ¿Cuál es la ventaja de uno sobre otro? ¿Cuál utilizaría usted para en el caso actual y por que? Justifique apropiadamente su respuesta.

Las estrategias de Cassandra para mantener redundancia en la replicación de datos son SimpleStrategy, encargado de las replicas dentro de los nodos de un clúster con un solo centro de datos, por otro lado, NetworkTopologyStrategy se presentan varios centro de datos, y las replicas se realizan mediante un procedimiento Hash de distribución.

Al momento de contar con solo un centro de datos, SimpleStrategy es la opción mas adecuada, ya que, su replica se centra en el clúster trabajado y la replicación entre la conexión de nodos, por otro lado, NetworkTopologyStrategy tiene la ventaja de que puede realizar esta replicación en múltiples centros de datos, por lo tanto, es mas eficiente cundo se tienen mas escalas de datacenter. Por lo mencionado, dado la arquitectura implementada en el caso actual, SimpleStrategy seria la estrategia a utilizar, enfocando la replicación en la conexión de nodos del centro de datos que se trabaja.


### Teniendo en cuenta el contexto del problema ¿Usted cree que la solucion propuesta es la correcta? ¿Que ocurre cuando se quiere escalar en la solucion? ¿Que mejoras implementaria? Oriente su respuesta hacia el Sharding (la replicacion/distribucion de los datos) y comente una estrategia que podria seguir para ordenar los datos.

Basado en el contexto actual, se busca una consistencia de datos de la receta de los pacientes en la venta de fármacos. Considerando el modelo creado como demostración es posible confirmar que la arquitectura y diseño de funcionamiento aplicado mediante Cassandra es una correcta solución  proporcionando la información en las solicitudes planteadas y manteniendo una correcta consistencia de datos.

Ahora, si trasladamos la demostración anterior al escenario de contexto nos encontraremos que al trabajar con solo un clúster, la cantidad de datos  puede sobrecargar al sistema, causando lentitud y tope de información en este. Para solucionar esta problemática es posible realizar un escalamiento creando mas clúster y centro de datos, cambiando de una estrategia SimpleStrategy a una NetworkTopologyStrategy, en donde la distribución de datos e información se vería mediante un sistema de Sharding, en el que se replicara los datos en cada clúster, causando que la información procesada se mantenga distribuida y en funcionamiento correcto considerando la gran cantidad de datos a procesar.
