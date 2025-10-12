[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [ForceGraph/utils/layering/force](../README.md) / ForceLayoutOptions

# Interface: ForceLayoutOptions

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L37)

Configuration options for force-directed layout

All forces can be tuned to achieve different visual effects:

- Tighter clusters: Increase linkStrength, decrease chargeStrength
- More spread out: Decrease linkStrength, increase chargeStrength magnitude
- Faster convergence: Increase alphaDecay
- Slower, smoother animation: Decrease alphaDecay

## Properties

### linkDistance?

> `optional` **linkDistance**: `number` \| (`edge`) => `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:43](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L43)

Target distance between connected nodes
Can be a constant or a function for per-edge distances

#### Default

```ts
250;
```

---

### linkStrength?

> `optional` **linkStrength**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:50](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L50)

Strength of link attraction (0-1)
Higher values pull connected nodes closer together

#### Default

```ts
0.1;
```

---

### chargeStrength?

> `optional` **chargeStrength**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:57](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L57)

Strength of node repulsion (negative value)
More negative = stronger repulsion = more spread out

#### Default

```ts
-150;
```

---

### collisionRadius?

> `optional` **collisionRadius**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:64](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L64)

Collision detection radius (prevents node overlap)
Should be >= visual node radius

#### Default

```ts
65;
```

---

### centerStrength?

> `optional` **centerStrength**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:71](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L71)

Strength of centering force (0-1)
Pulls all nodes toward viewport center

#### Default

```ts
0.05;
```

---

### alphaDecay?

> `optional` **alphaDecay**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:78](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L78)

Rate at which simulation energy decreases (0-1)
Higher values = faster convergence but less stable

#### Default

```ts
0.05;
```

---

### initialAlpha?

> `optional` **initialAlpha**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:85](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L85)

Initial simulation energy (0-1)
Higher values = more initial movement

#### Default

```ts
0.3;
```
