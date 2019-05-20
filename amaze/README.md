# A maze (a maze generation/solution visualizer...)

### WASM canvas API

Provided wasm has access to a shared ImageData typed array with JS. It will expose the following
functions.

*setAlg* (Alg: Enum<string>): Promise<void>

Upon calling setAlg, the ImageData field will be set to the initial state of the canvas and should
be fully rendered. The internal step will be set to 0.

*setStep* (step: number): Promise<void>

Upon calling setStep, the ImageData will be changed to whatever the correct canvas data should be
for that step and should be fully rendered.
