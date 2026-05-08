function mutateSequence(
  sequence,
  pool
) {
  const copy = [...sequence];

  const randomIndex = Math.floor(
    Math.random() * copy.length
  );

  let replacement;

  do {
    replacement =
      pool[
        Math.floor(
          Math.random() * pool.length
        )
      ];
  } while (
    replacement.id ===
    copy[randomIndex].id
  );

  copy[randomIndex] = replacement;

  return copy;
}

function shuffle(array) {
  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copy[i], copy[j]] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
}

export function generateDistractors(
  correctSequence,
  pool,
  count = 4
) {
  const options = [correctSequence];

  while (options.length < count) {
    const mutated = mutateSequence(
      correctSequence,
      pool
    );

    const alreadyExists = options.some(
      (sequence) =>
        JSON.stringify(sequence) ===
        JSON.stringify(mutated)
    );

    if (!alreadyExists) {
      options.push(mutated);
    }
  }

  return shuffle(options);
}