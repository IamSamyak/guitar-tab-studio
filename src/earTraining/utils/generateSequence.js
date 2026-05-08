export function generateSequence(
  pool,
  length = 3
) {
  if (!pool || pool.length === 0) {
    return [];
  }

  const sequence = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * pool.length
    );

    sequence.push(pool[randomIndex]);
  }

  return sequence;
}