"use client"

import { useEffect, useMemo, useState } from 'react';

export default function ParticleBackground() {
  const [ReadyParticles, setReadyParticles] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const dynImport = new Function('p', 'return import(p)');
        const { initParticlesEngine } = await dynImport("@tsparticles/react");
        await dynImport("@tsparticles/engine");
        const { loadSlim } = await dynImport("@tsparticles/slim");
        const ParticlesMod: any = await dynImport("@tsparticles/react");
        await initParticlesEngine(async (engine: any) => {
          await loadSlim(engine as any);
        });
        if (mounted) setReadyParticles(() => ParticlesMod.default || ParticlesMod);
      } catch (e) {
        console.warn('Particles libraries not available, skipping background.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const options: any = useMemo(() => ({
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          area: 800 // ensure this is the correct property for v3+
        }
      },
      color: {
        value: "#06b6d4"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.2,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: "#06b6d4",
        opacity: 0.1,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" }, // changed from outModes: "out" to object
        attract: {
          enable: true,
          rotate: {
            x: 600,
            y: 1200
          }
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: { enable: true }
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3
          }
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: true
  }), []);

  if (!ReadyParticles) return null;
  const Particles = ReadyParticles;
  return <Particles id="tsparticles" options={options} className="absolute inset-0 -z-10" />;
} 