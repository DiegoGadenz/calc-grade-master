import { useEffect, useRef, useState } from "react";
import { CloudLightning, CloudRain, Flame, Headphones, Pause, Play, Waves, Wind, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { startAmbientSound, type AmbientSound, type SoundId } from "@/lib/ambient-sounds";

const SOUNDS: { id: SoundId; label: string; icon: LucideIcon }[] = [
  { id: "rain", label: "Chuva", icon: CloudRain },
  { id: "thunder", label: "Trovoada", icon: CloudLightning },
  { id: "fire", label: "Fogueira", icon: Flame },
  { id: "waves", label: "Ondas do mar", icon: Waves },
  { id: "wind", label: "Vento", icon: Wind },
];

const VOLUME_KEY = "calc-grade-sound-volumes";
const DEFAULT_VOLUMES: Record<SoundId, number> = { rain: 0.5, thunder: 0.5, fire: 0.5, waves: 0.5, wind: 0.5 };

// Só o volume é lembrado; os sons sempre começam desligados
const loadVolumes = (): Record<SoundId, number> => {
  try {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? { ...DEFAULT_VOLUMES, ...JSON.parse(saved) } : DEFAULT_VOLUMES;
  } catch {
    return DEFAULT_VOLUMES;
  }
};

const AmbientSounds = () => {
  const [active, setActive] = useState<Partial<Record<SoundId, boolean>>>({});
  const [volumes, setVolumes] = useState(loadVolumes);
  const playing = useRef<Partial<Record<SoundId, AmbientSound>>>({});

  const lastSelection = useRef<SoundId[]>([]);

  const anyActive = Object.values(active).some(Boolean);
  const activeLabels = SOUNDS.filter(({ id }) => active[id]).map(({ label }) => label);

  const toggle = (id: SoundId, on: boolean) => {
    if (on) {
      playing.current[id] = startAmbientSound(id, volumes[id]);
    } else {
      playing.current[id]?.stop();
      delete playing.current[id];
    }
    setActive((prev) => ({ ...prev, [id]: on }));
  };

  // Play/pause do mini player: pausa tudo e retoma os mesmos sons depois
  const togglePlayback = () => {
    if (anyActive) {
      lastSelection.current = SOUNDS.map(({ id }) => id).filter((id) => active[id]);
      lastSelection.current.forEach((id) => toggle(id, false));
    } else {
      const ids: SoundId[] = lastSelection.current.length ? lastSelection.current : ["rain"];
      ids.forEach((id) => toggle(id, true));
    }
  };

  const changeVolume = (id: SoundId, volume: number) => {
    playing.current[id]?.setVolume(volume);
    setVolumes((prev) => {
      const next = { ...prev, [id]: volume };
      try {
        localStorage.setItem(VOLUME_KEY, JSON.stringify(next));
      } catch {
        // Sem localStorage o volume só não é lembrado
      }
      return next;
    });
  };

  // Para tudo se o componente sair da tela
  useEffect(() => {
    const current = playing.current;
    return () => Object.values(current).forEach((sound) => sound?.stop());
  }, []);

  return (
    <Popover>
      <div className="flex h-10 items-center gap-1 rounded-full border bg-background/95 backdrop-blur p-1 shadow-md">
        <Button
          variant={anyActive ? "default" : "ghost"}
          size="icon"
          onClick={togglePlayback}
          aria-label={anyActive ? "Pausar sons" : "Tocar sons"}
          title={anyActive ? "Pausar" : "Tocar"}
          className="h-8 w-8 rounded-full"
        >
          {anyActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="Configurar sons"
          >
            <Headphones className="h-4 w-4" />
            <span className="max-w-[9rem] truncate">
              {activeLabels.length ? activeLabels.join(" + ") : "Sons"}
            </span>
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent side="bottom" align="end" className="w-72">
        <div className="space-y-4">
          <p className="font-semibold">Sons ambiente</p>
          {SOUNDS.map(({ id, label, icon: Icon }) => (
            <div key={id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={`sound-${id}`} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </label>
                <Switch
                  id={`sound-${id}`}
                  checked={!!active[id]}
                  onCheckedChange={(on) => toggle(id, on)}
                />
              </div>
              {active[id] && (
                <Slider
                  aria-label={`Volume ${label}`}
                  value={[volumes[id]]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([v]) => changeVolume(id, v)}
                />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AmbientSounds;
