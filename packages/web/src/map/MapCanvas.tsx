import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export function MapCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    let destroyed = false;

    app.init({ background: "#e8e4dc", resizeTo: canvasRef.current }).then(() => {
      if (destroyed) return;
      canvasRef.current?.appendChild(app.canvas);

      const g = new Graphics();
      g.rect(0, 0, 320, 320).fill({ color: 0xcccccc, alpha: 0.3 });
      for (let i = 0; i <= 8; i++) {
        const x = i * 40;
        g.moveTo(x, 0).lineTo(x, 320).stroke({ width: 1, color: 0x999999 });
        g.moveTo(0, x).lineTo(320, x).stroke({ width: 1, color: 0x999999 });
      }
      app.stage.addChild(g);
    });

    return () => {
      destroyed = true;
      app.destroy(true);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{ width: 320, height: 320, border: "1px solid #999" }}
    />
  );
}
