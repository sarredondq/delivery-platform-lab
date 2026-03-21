## delivery-platform-lab

Monorepo orientado a arquitectura de entrega continua, automatizacion operativa y despliegues multi-cloud.

### Proposito

`delivery-platform-lab` nace como un laboratorio de plataforma para centralizar pipelines, componentes reutilizables y definiciones operativas que despues puedan evolucionar hacia una plataforma de entrega mas formal. La idea no es guardar pipelines sueltos, sino construir una base coherente para CI/CD, release engineering, politicas de despliegue y automatizacion de entornos.

### Objetivos

- Tener una unica raiz para automatizacion de entrega, despliegues y tooling compartido.
- Separar claramente definiciones de pipeline, modulos reutilizables y artefactos de entorno.
- Facilitar un modelo multi-cloud donde la logica comun viva en un lugar y las diferencias por proveedor queden aisladas.
- Permitir que Azure DevOps, GitHub Actions y Jenkins convivan sin mezclar responsabilidades.
- Preparar el repo para crecer desde validaciones basicas hacia pipelines de release y despliegue mas completos.

### Layout del repositorio

- `.github/workflows/`: automatizaciones especificas de GitHub Actions.
- `azure-devops/`: templates, convenciones y definiciones auxiliares para Azure DevOps.
- `azure-devops/pipelines/`: pipelines dedicados para validacion ambiental y planeamiento multi-cloud.
- `jenkins/`: pipelines declarativos y shared libraries para Jenkins.
- `deployments/`: automatizacion de despliegue por plataforma, cloud o capacidad transversal.
- `environments/`: overlays, variables y entradas de despliegue por ambiente.
- `platform/`: tooling operativo, scripts y utilidades compartidas por pipelines.
- `modules/`: piezas reutilizables para composicion de automatizacion e infraestructura.
- `docs/`: decisiones, notas de arquitectura y documentacion de soporte.

### Direccion del workflow

La direccion buscada es simple: cada tecnologia de CI orquesta desde su dominio, pero la logica reusable no deberia duplicarse en cada motor. Cuando una automatizacion deja de ser puntual y empieza a repetirse, se mueve a `platform/` o `modules/`. De esa forma el monorepo funciona como capa de orquestacion y tambien como catalogo de capacidades compartidas.

Un flujo esperado para cambios futuros seria:

1. Definir la necesidad del pipeline o del despliegue.
2. Implementar la entrada minima en el motor correspondiente.
3. Extraer pasos comunes a templates o modulos reutilizables.
4. Versionar convenciones de entorno en `environments/`.
5. Escalar desde validacion a promotion, release y despliegue segun madure el caso.

### Azure DevOps dentro del monorepo

Azure DevOps entra en el repo como uno de los motores de orquestacion principales, no como un agregado aislado. Su rol inicial es ofrecer una base de pipeline reutilizable para validar que el monorepo mantiene una estructura esperada y que las capacidades comunes pueden componerse desde templates.

La convencion inicial queda asi:

- `azure-pipelines.yml`: punto de entrada raiz para Azure DevOps.
- `azure-devops/templates/`: templates reutilizables para jobs o steps comunes.
- `azure-devops/pipelines/`: pipelines dedicados por capacidad, ambiente o dominio operativo.

### Starter inicial de Azure DevOps

La base actual queda dividida en tres entradas complementarias:

- `azure-pipelines.yml`: pipeline raiz que valida el contrato estructural del monorepo y exige que existan los pipelines base de Azure DevOps.
- `azure-devops/pipelines/environment-validation.yml`: pipeline dedicada a validar la estructura esperada para `dev`, `staging` y `prod`.
- `azure-devops/pipelines/multicloud-deployment-plan.yml`: pipeline dedicada a validar la base multi-cloud y publicar un preview del flujo AWS, Azure y GCP sin desplegar nada.

Los tres comparten templates pequenos para chequeo de rutas y mantienen el enfoque de foundation: validar estructura, expresar flujo e impedir drift temprano.

#### Environment validation pipeline

Esta pipeline existe para sostener el contrato minimo por ambiente. Para cada uno de `dev`, `staging` y `prod` valida:

- que el overlay del ambiente exista en `environments/<ambiente>/`;
- que el placeholder versionado siga presente para evitar directorios vacios invisibles;
- que la base compartida de entrega (`deployments/common`, `platform/scripts`, `modules/shared`) siga disponible.

No compila, no empaqueta y no despliega. Su unica responsabilidad es frenar cambios que rompan la estructura minima esperada por ambiente.

#### Multi-cloud deployment plan pipeline

Esta pipeline modela el flujo futuro sin pedir credenciales reales. Primero valida la fundacion comun y luego corre tres previews independientes:

- AWS: comprueba `deployments/aws` junto con overlays `dev`, `staging` y `prod`.
- Azure: comprueba `deployments/azure` junto con overlays `dev`, `staging` y `prod`.
- GCP: comprueba `deployments/gcp` junto con overlays `dev`, `staging` y `prod`.

Cada preview deja trazado en logs el orden intencional `common -> cloud -> environments`, con `credentials=not-required` y `deployment=disabled`. Eso permite socializar la arquitectura antes de conectar providers reales.

#### Uso rapido

1. Crear un pipeline en Azure DevOps apuntando al archivo raiz `azure-pipelines.yml`.
2. Mantener la rama principal como `main` para respetar triggers y PR validation.
3. Crear pipelines adicionales apuntando a `azure-devops/pipelines/environment-validation.yml` y `azure-devops/pipelines/multicloud-deployment-plan.yml` cuando quieras separarlas por responsabilidad.
4. Ajustar las listas `requiredPaths` en los YAML correspondientes cuando el contrato estructural del monorepo cambie.
5. Agregar nuevos templates en `azure-devops/templates/` cuando aparezcan patrones repetidos.

### Criterios de crecimiento

Antes de agregar mas automatizacion, conviene sostener estas reglas:

- no mezclar configuracion de entornos con logica de pipeline;
- no duplicar pasos identicos entre motores de CI;
- mantener cada template pequeno, auditable y facil de recombinar;
- usar `docs/` para registrar decisiones cuando aparezcan variantes por cloud, producto o compliance.
