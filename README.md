# Diseno_Inclusivo_FrontEnd


Tema: Diseño inclusivo en el Front-end: Usabilidad (u8y) y accesibilidad web (a16y) con HTML semántico y Angular mediante HTML semántico.    

Relación con el temario del curso: 
Unidad 4.2.1 (Experiencia de usuario)
Unidad 4.2.2 (Usabilidad - U8y)
Unidad 4.2.4 (Accesibilidad - A16y)
Unidad 4.3.5 (HTML semántica)
Unidad 4.3.6 (Creación de forms HTML)
Unidad 4.3.7 (El rol del HTML en la accesibilidad) 
Unidad 4.6 (Desarrollo en un framework front-end: Angular).

Alcance teórico (Exposición Oral): Debe abordar de forma articulada tanto la Usabilidad (U8y) como la Accesibilidad (A16y):
1) Fundamentos de Usabilidad (U8y) y Experiencia de Usuario (UX): Las 10 Heurísticas de Usabilidad de Jakob Nielsen aplicadas a aplicaciones web empresariales (visibilidad del estado del sistema, prevención de errores en formularios, consistencia, carga cognitiva, retroalimentación inmediata y diseño de estados vacíos/carga).
2) Fundamentos de Accesibilidad Web (A16y / A11y) y Estándares WCAG 2.1 / 2.2: Los 4 principios POUR (Perceptible, Operable, Comprensible y Robusto) y niveles de conformidad (A, AA, AAA). El rol del HTML5 semántico (<main>, <nav>, <header>, <section>, <article>, <fieldset>, <label>) frente al uso excesivo de <div>; atributos WAI-ARIA (aria-label, aria-live, aria-invalid, aria-describedby, roles), contraste de color, navegación completa por teclado (TabIndex y Focus Management) y tecnologías de asistencia (lectores de pantalla como NVDA/VoiceOver).
3) Accesibilidad en Single-Page Applications (Angular): Retos propios de las SPA (anuncio de cambios de ruta, gestión del foco en modales y alertas dinámicas) y uso del módulo @angular/cdk/a11y (FocusTrap, LiveAnnouncer, FocusMonitor).
   
Alcance práctico (Taller Guiado): A partir de un módulo en Angular con problemas intencionales de usabilidad y barreras de accesibilidad (entregado en el repositorio plantilla), guiar a la clase paso a paso para:
1) Auditoría inicial diagnóstica: Ejecutar herramientas de inspección en tiempo real (Google Lighthouse, Axe DevTools y navegación sin ratón) para identificar fallos de contraste, etiquetas huérfanas, falta de foco visible y errores de validación confusos.
2) Refactorización de HTML Semántico y Formularios Accesibles/Usables: Transformar una vista basada en <div> no semánticos a HTML5 semántico, vinculando correctamente controles de formulario reactivos en Angular con mensajes de error claros (aria-describedby, aria-invalid) y aplicando heurísticas de prevención de errores y feedback visual.
3) Implementación con Angular CDK A11y: Integrar @angular/cdk/a11y para atrapar el foco del teclado dentro de un diálogo modal (cdkTrapFocus), anunciar notificaciones dinámicas a lectores de pantalla con LiveAnnouncer y comprobar que el puntaje de Accesibilidad en Lighthouse alcance el 100%.
