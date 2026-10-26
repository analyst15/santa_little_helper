import AppHeader from "@/components/header";
import MainView from "@/app/secret-santa/main-view";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <MainView />
      </main>
    </div>
  );
}
