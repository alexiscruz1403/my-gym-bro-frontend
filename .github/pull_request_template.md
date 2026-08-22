## Qué cambia

<!-- Una o dos frases. Si el título del PR ya lo dice, borrá esta sección. -->

## Por qué

<!-- El problema que resuelve, no la solución. Si hay issue, referenciala: Closes #N -->

## Cómo lo verificaste

<!-- Comandos que corriste, o qué probaste a mano. -->

## Checklist

- [ ] El título del PR sigue [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) — es el que termina en el changelog
- [ ] `npm run lint:ci` y `npm run typecheck` pasan
- [ ] `npm run test:ci` pasa
- [ ] `npm run build` pasa y `npx size-limit` sigue dentro del presupuesto
- [ ] Si suma una dependencia pesada al bundle del cliente: está justificado en la descripción
- [ ] Si cambia un flujo cubierto por E2E: los specs de `e2e/` siguen pasando (ojo con los textos en español, están acoplados a la UI)
- [ ] Si agrega una variable de entorno: se lee en runtime vía `src/lib/runtime-config.ts`, **no** con prefijo `NEXT_PUBLIC_`
