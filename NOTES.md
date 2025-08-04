# Notes from the Exercise

- Se propuso una solución lo más escalable y mantenible posible utilizando TypeScript, con algunas excepciones para mayor sencillez.
- Se utilizó Next.js con Tailwind y Tanstack React Query para consultas más limpias y optimizadas. Se implementa cache, mutaciones y se evitan problemas relacionados con el hook useEffect de react. Esto optimiza las peticiones al máximo.
- Se implementan componentes de React re-utilizables, como NoteCard y Modal. En este caso, modal es un componente que puede utilizarse para cualquier modal, tomando los componentes del contenido.
- Se implementan componentes Providers para React Query y Amplify.
- Se implementa lógica de paginación y funciones de utilidades para manipular strings.
- Se implementa el CDK de AWS para DynamoDB y AppSync, se espera utilizar la consola de Amplify para el hosting para una mejor experiencia de usuario.
- Se incluyen anotaciones para algunas funciones de utilidades.

AVISO: Por ahora mi usuario está presentando problemas relacionados con "Facturación" en AWS Amplify, pero en cuanto me resuelvan del equipo de soporte podrán contar con la página productiva.
