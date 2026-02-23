import HeaderSection from "@/components/commons/HeaderSection";

function page() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-primaryPink/40 rounded-full blur-2xl animate-blob will-change-transform" />

        <div className="absolute top-1/4 -right-40 w-[36rem] h-[36rem] bg-primaryGreen/40 rounded-full blur-2xl animate-blob [animation-delay:3s] [animation-duration:22s] will-change-transform" />

        <div className="absolute bottom-[-10rem] left-1/4 w-[34rem] h-[34rem] bg-pink-300/40 rounded-full blur-2xl animate-blob [animation-delay:6s] [animation-duration:26s] will-change-transform" />

        {/* floating particles */}
        <div className="absolute top-1/4 left-1/3 w-14 h-14 bg-white/20 border border-white/30 rounded-full backdrop-blur-md animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-white/20 border border-white/30 rounded-full backdrop-blur-md animate-bounce [animation-duration:6s]" />
      </div>

      <div className="lg:w-[50vw] relative flex flex-col gap-4 bg-white/70 backdrop-blur-2xl p-10 rounded-2xl w-full max-w-xl items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 animate-fade-in">
        <HeaderSection title={"Tambah Kabinet"} />
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
        <p>Ini form</p>
      </div>
    </main>
  );
}

export default page;
