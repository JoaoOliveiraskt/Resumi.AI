import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img src={logo} alt="sumz_logo" className="w-40 object-contain" />

        <button
          type="button"
          onClick={() => window.open("https://github.com/joaooliveiraskt/Summize-AI")}
          className="black_btn"
        >
          Github
        </button>
      </nav>

      <h1 className="head_text tracking-wider">
        Resuma <br /> Artigos com <br />
        <span className="sunset_gradient">OpenAI GPT-4</span>
      </h1>
      <h2 className="desc tracking-wider">
        Transforme páginas longas em breves insights com o Resumi.AI. Nosso
        assistente virtual de resumos simplifica qualquer texto, basta fornecer
        a URL e deixar o Resumi.AI fazer o trabalho pesado.
      </h2>
    </header>
  );
};

export default Hero;
