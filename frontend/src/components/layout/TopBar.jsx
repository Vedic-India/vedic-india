import { ShieldCheck, Truck, Droplets } from "lucide-react";
import Container from "./Container";

export default function TopBar() {
  return (
    <div className="bg-(--color-primary) text-white">
      <Container>
        <div className="flex h-9 items-center justify-between text-xs font-medium">

          <div className="hidden items-center gap-2 md:flex">
            <Droplets size={14} />
            <span>Pure Water. Pure Life.</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>India's First Magnetized Alkaline Water Solutions</span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Truck size={14} />
            <span>Free Shipping on Orders Above ₹1999</span>
          </div>

        </div>
      </Container>
    </div>
  );
}