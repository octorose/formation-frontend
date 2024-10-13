import {GoogleGeminiEffect} from "./Components/GoogleGeminiEffect/GoogleGeminiEffect";
import Companies from "./Components/Companies/Companies";
import Buyers from "./Components/Buyers/index";
import Provide from "./Components/Provide/index";
import Why from "./Components/Why/index";
import Network from "./Components/Network/index";
import Clientsay from "./Components/Clientsay/index";
import Newsletter from "./Components/Newsletter/Newsletter";
import Banner from "./Components/Banner/Banner";

export default function Home() {
  
  return (
    <main>
      <Banner />
      <Buyers />
      <Provide />
      <Why />
      <Network />
      {/* <Clientsay /> */}
      <Newsletter />
    </main>
  );
}
