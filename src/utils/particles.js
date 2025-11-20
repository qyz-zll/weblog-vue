// src/utils/particles.js
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export const initParticles = async (id) => {
  await loadSlim(tsParticles);
  await tsParticles.load({
    id,
    options: {
      fullScreen: { enable: true, zIndex: 0 },
      size: { value: 3, random: true },
      opacity: { value: 0.7, random: true },
      speed: { x: 0.3, y: 0.3 },
      shape: {
        type: ["circle", "triangle"],
        options: { triangle: { fill: true } }
      },
      // 其他粒子配置...
    }
  });
};