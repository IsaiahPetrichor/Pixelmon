import { useEffect, useState } from 'react';
import './Home.css';

type RegionStatuses = {
  Kanto: number;
  Hoenn: number;
  Sinnoh: number;
};

function Home() {
  const [kantoProgress, setKantoProgress] = useState(0);
  const [hoennProgress, setHoennProgress] = useState(0);
  const [sinnohProgress, setSinnohProgress] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const assetBaseUrl = import.meta.env.BASE_URL;
  // const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

  useEffect(() => {
    const response: Promise<RegionStatuses> = fetch(`${apiBaseUrl}/RegionStatus`).then((res) => {
      return res.json();
    });

    response.then((data) => {
      setKantoProgress(data.Kanto);
      setHoennProgress(data.Hoenn);
      setSinnohProgress(data.Sinnoh);
    });
  }, [apiBaseUrl]);

  return (
    <>
      <section className="about">
        <h2>Classic Pokémon, Modern Minecraft</h2>
        <p>
          Experience the magic of Pokémon in the world of Minecraft! Our servers are built off the Gen 1 through Gen 4
          games. Giving you the amazing experience of the original games in a new dimension.
        </p>
      </section>
      <section className="regions">
        <h2>What we're working on</h2>
        <div className="regionContainer kanto">
          <div>
            <h3>Kanto</h3>
            <p>Primarily based on Pokémon FireRed and LeafGreen</p>
            <p>
              Meet your rival Gary, get your first Pokémon, and embark on your journey! Meet new friends and stop Team
              Rocket from carrying out their evil plans. Battle through the eight gyms, take on the Elite Four, and
              become the very best!
            </p>
            <div className="progressBar">
              <div
                className="progress"
                style={{
                  backgroundImage: `linear-gradient(to right, rgb(161, 1, 1) ${kantoProgress}%, rgb(199, 199, 199) ${kantoProgress ? kantoProgress + 2 : 0}%)`,
                }}
              ></div>
              <p>{kantoProgress ?? '...'}% Complete</p>
            </div>
          </div>
          <div className="regionPreview kantoPreview">
            <img src={`${assetBaseUrl}resources/images/MtEmber.png`} alt="Kanto" />
          </div>
        </div>
        <div className="regionContainer hoenn">
          <div className="regionPreview hoennPreview">
            <img src={`${assetBaseUrl}resources/images/Hoenn.png`} alt="Hoenn" />
          </div>
          <div>
            <h3>Hoenn</h3>
            <p>Primarily based on Pokémon Ruby and Sapphire</p>
            <div className="progressBar">
              <div
                className="progress"
                style={{
                  backgroundImage: `linear-gradient(to right, rgb(161, 1, 1) ${hoennProgress}%, rgb(199, 199, 199) ${hoennProgress ? hoennProgress + 2 : 0}%)`,
                }}
              ></div>
              <p>{hoennProgress ?? '...'}% Complete</p>
            </div>
          </div>
        </div>
        <div className="regionContainer sinnoh">
          <div>
            <h3>Sinnoh</h3>
            <p>Primarily based on Pokémon Diamond and Pearl</p>
            <div className="progressBar">
              <div
                className="progress"
                style={{
                  backgroundImage: `linear-gradient(to right, rgb(161, 1, 1) ${sinnohProgress}%, rgb(199, 199, 199) ${sinnohProgress ? sinnohProgress + 2 : 0}%)`,
                }}
              ></div>
              <p>{sinnohProgress ?? '...'}% Complete</p>
            </div>
          </div>
          <div className="regionPreview sinnohPreview">
            <img src={`${assetBaseUrl}resources/images/Sinnoh.png`} alt="Sinnoh" />
          </div>
        </div>
        <p>
          Check out our <a href="/regions">progress page</a> for more details!
        </p>
      </section>
    </>
  );
}

export default Home;
