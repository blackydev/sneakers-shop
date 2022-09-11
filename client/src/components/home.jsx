import React, { Component } from "react";
import "../styles/home.css";

class Header extends Component {
  state = {};

  render() {
    return (
      <header className="bg-light">
        <picture>
          <img src="head.png" alt="DJ Damian Likus" />
        </picture>
      </header>
    );
  }
}

class Home extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Header />
        <main className="main">
          <section className="bg-dark text-white scroll-section">
            <div className="container">
              MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
            </div>
          </section>
          <section className="bg-warning text-white scroll-section">
            <div className="container">
              MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
            </div>
          </section>
          <section className="bg-info text-white scroll-section">
            <div className="container">
              MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
              <br /> MAIN <br /> MAIN <br /> MAIN
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Home;
