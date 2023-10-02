import Navbar from './components/Navbar'
import MainContent from './components/MainContent';

export default function Home() {
  return (
        <main>
          <Navbar title={"The Social App"}/>
          <MainContent />
        </main>
  );
}
