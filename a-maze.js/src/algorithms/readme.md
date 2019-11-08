# Algorithms API

```
import { runAlgorithm } from './algorithms/example.js';

type Run = {
  finalState: String,
  setStep: Number => Promise<void>,
  steps: Number,
};

runAlgorithm({
  canvasWrapperId: String,
  height: Number,
  initialState: String,
  seed: String,
  width: Number,
}): Promise<Run>;
```

State here is just some string representation of the world as it starts and ends in order to
facilitate passing off info between algorithms.

You can say each cell has 3 bits of info:
  1 - Whether that cell is open.
  2 - Whether the wall to it's right is open.
  3 - Whether the wall below it is open.

So a base64 string could represent 2 cells with each char. So basically, take the string, along
with width and height requirements. Break it down into 6 bits per char, then read the triples of
bits as meaningful in the order that was described above.

So, a 100x100 maze would have 10,000 cells and a 5,000 char string. Not impossible but perhaps a
little wasteful. 5,000 chars * 2 bytes per char, so 10,000 bytes overall.

Alternatively we could use TypedArray<Int8> to save on space. The functioning would be basically
the same except you would be iterating over the array 8 bits at a time, a little clunky but not
impossible either.

In that case a 100x100 maze, with 10,000 cells, would take 30,000 bits, and only 3,750 bytes.

I think it is better to go simply and do base64 for the time being, and if memory becomes an issue
remember the TypedArray alternative.
