import Image from "next/image";

const HeroSection = ({ section }: any) => {
  const getHeroContent = () => {
    switch (section) {
      case "chi-siamo":
        return {
          bg: "/img/chisiamo.jpg",
          title: "Chi Siamo",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      case "struttura":
        return {
          bg: "/img/struttura.jpg",
          title: "La Struttura Nazionale",
          subtitle: "La nostra organizzazione sul territorio",
        };
      case "evento":
        return {
          bg: "/img/evento20febbraio.jpg",
          title: "",
          subtitle: "",
        };
      case "tutele":
        return {
          bg: "/img/tutele.jpg",
          title: "Tutele e Servizi",
          subtitle: "Un supporto completo per i nostri iscritti",
        };
      case "comparti":
        return {
          bg: "/img/comparti.jpg",
          title: "Comparti e CCNL",
          subtitle: "Supporto specializzato per ogni settore",
        };
      case "notizie":
        return {
          bg: "/img/notizie.jpg",
          title: "Notizie",
          subtitle: "Scopri le ultime novità e le novità in evidenza",
        };
      case "comunicati":
        return {
          bg: "/img/notizie.jpg",
          title: "Notizie",
          subtitle: "Scopri le ultime novità e le novità in evidenza",
        };
      case "cerca-sede":
        return {
          bg: "/img/sede.jpg",
          title: "Cerca una sede",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      case "segreterie-list":
        return {
          bg: "/img/sede.jpg",
          title: "Segreterie Sindacali",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      case "centri-list":
        return {
          bg: "/img/sede.jpg",
          title: "Centri Snalv",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      case "collabora":
        return {
          bg: "/img/collabora.jpg",
          title: "Collabora con noi",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      case "contatti":
        return {
          bg: "/img/contatti.jpg",
          title: "Contatti",
          subtitle: "Scopri la nostra storia e i nostri valori",
        };
      default:
        return null;
    }
  };

  const heroContent = getHeroContent();
  if (!heroContent) return null;

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] mb-8 sm:mb-12">
      <div className="absolute inset-0">
        <Image
          src={heroContent.bg}
          alt={heroContent.title}
          fill
          className="object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center sm:items-end pb-6 sm:pb-12">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight">
          {heroContent.title}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
