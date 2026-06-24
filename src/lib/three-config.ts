export const particleFieldConfig = {
  count: 4800,
  spread: 15,
  size: 0.04,
  spawnSphereRatio: 0.9,
};

export const particlePhysicsConfig = {
  repulsion: 4.5,
  influence: 2.2,
  damping: 0.992,
  bounce: 0.6,
  bounceJitter: 0.2,
  maxSpeed: 3.5,
  drift: 1.0,
  turbulence: 0.85,
  wallInset: 0.15,
  cornerRepulsion: 1.4,
  rotationFromPointer: 0.55,
  rotationFromVelocity: 7,
  rotationLerp: 0.06,
  burstRadius: 5.5,
  burstDecay: 0.9,
};

export const particleColors = {
  light: "#3b82c4",
  dark: "#93c5fd",
};

export function getBoxHalf(spread = particleFieldConfig.spread) {
  return spread / 2;
}

function randomInSphere(radius: number) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.cbrt(Math.random());

  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
}

function randomUnitVector() {
  const theta = Math.random() * Math.PI * 2;
  const z = Math.random() * 2 - 1;
  const scale = Math.sqrt(1 - z * z);

  return {
    x: scale * Math.cos(theta),
    y: scale * Math.sin(theta),
    z,
  };
}

export function createParticlePositions(
  count: number,
  spread: number,
  spawnSphereRatio: number,
) {
  const values = new Float32Array(count * 3);
  const spawnRadius = getBoxHalf(spread) * spawnSphereRatio;

  for (let index = 0; index < count; index += 1) {
    const point = randomInSphere(spawnRadius);
    const offset = index * 3;
    values[offset] = point.x;
    values[offset + 1] = point.y;
    values[offset + 2] = point.z;
  }

  return values;
}

export function createParticleVelocities(count: number, drift: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const direction = randomUnitVector();
    const speed = (0.45 + Math.random() * 0.9) * drift;
    const offset = index * 3;
    values[offset] = direction.x * speed;
    values[offset + 1] = direction.y * speed;
    values[offset + 2] = direction.z * speed;
  }

  return values;
}
