# Boggle - Juego de Palabras

## Descripción del Proyecto

Boggle es un juego de palabras en el que los jugadores intentan encontrar tantas palabras como puedan en una cuadrícula de 16 casillas (4x4) que contienen letras de forma aleatoria, dentro de un límite de tiempo establecido. Este proyecto implementa el juego de Boggle en una página web utilizando HTML5, CSS3 y JavaScript ES5, siguiendo buenas prácticas de desarrollo y asegurando una experiencia de usuario agradable y responsiva.

## Cómo Jugar

1. **Inicio del Juego**:
   - Ingrese su nombre en el campo de texto y haga clic en "Iniciar Juego".
   - Seleccione la duración del juego (1, 2 o 3 minutos) utilizando el selector de tiempo.

2. **Reglas del Juego**:
   - Las palabras deben tener al menos tres letras.
   - Cada letra después de la primera debe ser vecina horizontal, vertical o diagonal de la anterior.
   - Ninguna casilla de letras individual se puede utilizar más de una vez en una palabra.
   - Se permiten múltiples formas de la misma palabra (formas singulares y plurales y otras derivaciones). No se aceptan nombres propios, artículos ni pronombres.
   - Se permiten palabras dentro de palabras (por ejemplo, "house" y "houseroom").

3. **Formar Palabras**:
   - Haga clic en las letras del tablero para formar palabras.
   - Las letras seleccionadas se resaltarán.
   - La palabra formada se mostrará en el área "Palabra actual".
   - Presione "Enter" para validar la palabra.

4. **Validación y Puntuación**:
   - Las palabras válidas se añadirán al listado de "Palabras encontradas" y se sumarán puntos según la longitud de la palabra.
   - Las palabras inválidas restarán puntos.
   - Las palabras repetidas no se aceptarán.
   - El juego termina cuando el tiempo se agota.

5. **Sistema de Puntuación**:
   - Palabras de 3 o 4 letras: 1 punto
   - Palabras de 5 letras: 2 puntos
   - Palabras de 6 letras: 3 puntos
   - Palabras de 7 letras: 5 puntos
   - Palabras de 8 o más letras: 11 puntos

## Funcionalidades

- **Interfaz Responsiva**: Diseñada con Flexbox para asegurar que el juego se vea bien en cualquier dispositivo.
- **Temporizador**: Opción de seleccionar la duración del juego (1, 2 o 3 minutos).
- **Validación de Palabras**: Validación de palabras en ingles utilizando una API de diccionario.
- **Feedback Visual**: Letras seleccionadas se resaltan en el tablero.
- **Puntaje en Tiempo Real**: Actualización del puntaje a medida que se validan las palabras.
- **Modal de Fin del Juego**: Al finalizar el tiempo, se muestra un modal con el puntaje final y las palabras encontradas.

## Contacto

Sebastian.Febre@alumnos.uai.edu.ar y Tomas.Pascual@alumnos.uai.edu.ar

## Link para jugar

Dario.Marañe@uai.edu.ar

Integrantes del equipo:
 1- 
 2-

Link Repo

Link Github Pages (primer instancia de que ande)

