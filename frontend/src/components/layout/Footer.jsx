import Container from "./Container";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] py-20 text-white">
      <Container>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <Image
              src="/logo.png"
              alt="Vedic India"
              width={160}
              height={60}
            />

            <p className="mt-6 leading-8 text-white/70">
              Premium alkaline water solutions designed to
              improve everyday wellness.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold">
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/benefits">Benefits</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold">
              Products
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <p>PET Bottle</p>
              <p>Glass Bottle</p>
              <p>Water Drops</p>
              <p>Ionizer Machine</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold">
              Contact
            </h3>

            <div className="mt-5 space-y-3 text-white/70">
              <p>carevedicindia@gmail.com</p>
              <p>+91 XXXXX XXXXX</p>
              <p>New Delhi, India</p>
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-white/60">
          © {new Date().getFullYear()} Vedic India. All Rights Reserved.
        </div>

      </Container>
    </footer>
  );
}