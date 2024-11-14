import {
  SignInButton,
  ClerkLoaded,
  ClerkLoading,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";



export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-screen-lg mx-auto px-8 margin-bot gap-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center lg:flex-row gap-8 py-8">
        <div className="relative w-[360px] h-[360px] lg:w-[524px] lg:h-[424px]">
          <Image src="/undraw_Educator_re_ju47.png" alt="Hero" fill />
        </div>
        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <h1 className="text-xl font-bold text-neutral-600 max-w-[480px] lg:text-3xl">
            Cara menyenangkan, sederhana, dan efektif untuk menguasai Bahasa Inggris!
          </h1>
          <div className="flex flex-col items-center w-full max-w-[330px] gap-3">

          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>

          <ClerkLoaded>
              <SignedOut>
                <SignUpButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                  <Button size="lg" variant="secondary" className="w-full">
                    Daftar Sekarang
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                  <Button size="lg" variant="primaryOutline" className="w-full">
                    Saya Sudah Punya Akun
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <Link href="/learn">Lanjutkan Belajar</Link>
                </Button>
              </SignedIn>
          </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <section className="flex flex-col items-center justify-center gap-8 min-h-screen py-20 lg:flex-row max-w-screen-lg mx-auto">
        <img
          src="/undraw_Mobile_interface_re_1vv9.png"
          alt="Illustration of a person interacting with a mobile app"
          className="w-1/2 max-w-sm"
        />
        <div className="ml-8 text-left">
          <h2 className="text-4xl font-bold text-blue-500 leading-tight">
            menyenangkan. <br />
            sederhana. efektif.
          </h2>
          <p className="mt-4 text-gray-600">
            Belajar dengan EngLearn itu interaktif dan seru, dirancang untuk
            membantu kamu mencapai kemajuan berbahasa! Melalui pelajaran singkat
            dan mudah, kamu akan meningkatkan keterampilan komunikasi Bahasa
            Inggrismu di dunia nyata.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col items-center justify-center gap-8 min-h-screen py-20 lg:flex-row-reverse max-w-screen-lg mx-auto">
        <img
          src="/undraw_Social_interaction_re_dyjh.png"
          alt="Illustration of a person interacting with a mobile app"
          className="w-1/2 max-w-sm"
        />
        <div className="mr-8 text-right">
          <h2 className="text-4xl font-bold text-blue-500 leading-tight">
            didukung oleh <br />
            ilmu pengetahuan
          </h2>
          <p className="mt-4 text-gray-600">
            Kami menggabungkan metode pengajaran yang terbukti efektif dengan konten menarik untuk menciptakan kursus yang secara efektif meningkatkan kemampuan membaca, menulis, mendengarkan, dan berbicara dalam Bahasa Inggris!
          </p>
        </div>
      </section>
    </div>
  );
}
