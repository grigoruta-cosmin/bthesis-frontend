import RobotImage from "../20945602.jpg"

const Home = (props) => {
  return (
    <>
      <div className="grid grid-nogutter surface-0 text-800">
          <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
              <section>
                  <span className="block text-6xl font-bold mb-1">Automatizează-ți munca!</span>
                  <div className="text-4xl text-primary font-bold mb-3">Folosește algoritmi state of the art pentru adnotarea semiautomată a imaginilor.</div>
              </section>
          </div>
          <div className="col-12 md:col-6 overflow-hidden" style={{height: '450px'}}>
              <img src={RobotImage} alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)'}} />
          </div>
      </div>
    </>
  );
};

export default Home;