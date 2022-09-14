import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import Header from "./header";

class PrivacyPolicy extends Component {
  state = {
    title: "Polityka Prywatności",
  };

  render() {
    const { title } = this.state;
    return (
      <React.Fragment>
        <Header title={title} />
        <main>
          <section className="container p-5">
            Polityka prywatności serwisu{" "}
            <Link to="/">https://www.damianlikus.com</Link>
            <ol className="list-group-numbered list-group-privacypolicy">
              <li className="list-group-item">
                Niniejsza Polityka Prywatności określa zasady przetwarzania i
                ochrony danych osobowych przekazanych przez Użytkowników w
                związku z korzystaniem z serwisu{" "}
                <Link to="/">https://www.damianlikus.com</Link>
              </li>
              <li className="list-group-item">
                Administratorem danych osobowych zawartych w serwisie jest Likus
                Event – Marcin Likus wpisaną do Centralnej Ewidencji i
                Informacji o Działalności Gospodarczej (CEIDG) prowadzonej przez
                ministra właściwego ds. gospodarki, NIP 6282173618 REGON
                384308430.
              </li>
              <li className="list-group-item">
                W trosce o bezpieczeństwo powierzonych nam danych opracowaliśmy
                wewnętrzne procedury i zalecenia, które mają zapobiec
                udostępnieniu danych osobom nieupoważnionym. Kontrolujemy ich
                wykonywanie i stale sprawdzamy ich zgodność z odpowiednimi
                aktami prawnymi — ustawą o ochronie danych osobowych, ustawą o
                świadczeniu usług drogą elektroniczną, a także wszelkiego
                rodzaju aktach wykonawczych i aktach prawa wspólnotowego.
              </li>
              <li className="list-group-item">
                Dane Osobowe przetwarzane są na podstawie zgody wyrażanej przez
                Użytkownika oraz w przypadkach, w których przepisy prawa
                upoważniają Administratora do przetwarzania danych osobowych na
                podstawie przepisów prawa lub w celu realizacji zawartej
                pomiędzy stronami umowy.
              </li>
              <li className="list-group-item">
                Serwis realizuje funkcje pozyskiwania informacji o użytkownikach
                i ich zachowaniach w następujący sposób:
              </li>

              <ol>
                <li>
                  poprzez dobrowolnie wprowadzone w formularzu zamówienia,
                </li>
                <li>
                  poprzez gromadzenie plików “cookies” (patrz polityka plików
                  "cookies").
                </li>
              </ol>

              <li className="list-group-item">
                Serwis zbiera informacje dobrowolnie podane przez użytkownika.
              </li>
              <li className="list-group-item">
                Dane osobowe pozostawione w serwisie nie zostaną sprzedane
                zgodnie z przepisami Ustawy o ochronie danych osobowych.
              </li>
              <li className="list-group-item">
                Dane osobowe zbierane przez administratora za pośrednictwem
                formularza zamówienia przetwarzane są w celu realizacji Umowy
                Sprzedaży.
              </li>
              <li className="list-group-item">
                Odbiorcami danych osobowych podanych w formularzu zamówienia
                mogą być:
              </li>
              <ol>
                <li>
                  W przypadku Klienta, który korzysta w Sklepie internetowym ze
                  sposobu dostawy przesyłką pocztową lub przesyłką kurierską,
                  Administrator udostępnia zebrane dane osobowe Klienta
                  wybranemu przewoźnikowi lub pośrednikowi realizującemu
                  przesyłki na zlecenie Administratora.
                </li>
                <li>
                  W przypadku Klienta, który korzysta w Sklepie internetowym ze
                  sposobu przelewem online, płatności elektronicznych, płatności
                  kartą płatniczą, płatności Blikiem, płatności Apple Pay,
                  Płatności Google Pay – Administrator udostępnia zebrane dane
                  osobowe Klienta, wybranemu podmiotowi obsługującemu powyższe
                  płatności w Sklepie internetowym.
                </li>
              </ol>

              <li className="list-group-item">
                Podanie danych osobowych w formularzu zamówienia jest
                dobrowolne, aczkolwiek niezbędne do zawarcia Umowy Sprzedaży
                skutkuje brakiem możliwości zawarcia tejże umowy.
              </li>
              <li className="list-group-item">
                Do danych zawartych w formularzu zamówienia przysługuje wgląd
                osobie fizycznej, która je tam umieściła. Osoba ta ma również
                prawo do modyfikacji i zaprzestania przetwarzania swoich danych,
                zgodnie z aktualnymi przepisami prawa.
              </li>
              <li className="list-group-item">
                Zastrzegamy sobie prawo do zmiany w polityce ochrony prywatności
                serwisu, na które może wpłynąć rozwój technologii internetowej,
                ewentualne zmiany prawa w zakresie ochrony danych osobowych oraz
                rozwój naszego serwisu internetowego. O wszelkich zmianach
                będziemy informować w sposób widoczny i zrozumiały.
              </li>
              <li className="list-group-item">
                W Serwisie mogą pojawiać się linki do innych stron
                internetowych. Takie strony internetowe działają niezależnie od
                Serwisu i nie są w żaden sposób nadzorowane przez serwis{" "}
                <Link to="/">https://www.damianlikus.com</Link>. Strony te mogą
                posiadać własne polityki dotyczące prywatności oraz regulaminy,
                z którymi zalecamy się zapoznać.
              </li>
            </ol>
            W razie wątpliwości co któregokolwiek z zapisów niniejszej polityki
            prywatności jesteśmy do dyspozycji pod adresem e-mail
            sklep@damianlikus.com <br />
            Polityka plików „cookies”:
            <ol className="list-group-numbered list-group-privacypolicy">
              <li className="list-group-item">
                Poprzez piki “cookies” należy rozumieć dane informatyczne
                przechowywane w urządzeniach końcowych użytkowników,
                przeznaczone do korzystania ze stron internetowych. W
                szczególności są to pliki tekstowe, zawierające nazwę strony
                internetowej, z której pochodzą, czas przechowywania ich na
                urządzeniu końcowym oraz unikalny numer.
              </li>
              <li className="list-group-item">
                Serwis nie zbiera w sposób automatyczny żadnych informacji, z
                wyjątkiem informacji zawartych w plikach cookies.
              </li>
              <li className="list-group-item">
                Pliki cookies przeznaczone są do korzystania ze stron serwisu.
                Operator wykorzystuje te pliki do dopasowania zawartości strony
                internetowej do indywidualnych preferencji użytkownika, przede
                wszystkim pliki te rozpoznają jego urządzenie, aby zgodnie z
                jego preferencjami wyświetlić stronę
              </li>
              <li className="list-group-item">
                Pliki cookies wykorzystywane przez partnerów operatora strony
                internetowej, w tym w szczególności użytkowników strony
                internetowej, podlegają ich własnej polityce prywatności.
              </li>
              <li className="list-group-item">
                Standardowo oprogramowanie służące do przeglądania stron
                internetowych domyślnie dopuszcza umieszczanie plików cookies na
                urządzeniu końcowym Użytkownika. Ustawienia te mogą zostać
                zmienione przez Użytkownika w taki sposób, aby blokować
                automatyczną obsługę “cookies” w ustawieniach przeglądarki
                internetowej bądź informować o ich każdorazowym przesłaniu na
                urządzenia użytkownika.
              </li>
              <li className="list-group-item">
                Użytkownicy Serwisu mogą dokonać w każdym czasie zmiany ustawień
                dotyczących plików cookies. Szczegółowe informacje o możliwości
                i sposobach obsługi plików cookies dostępne są w ustawieniach
                oprogramowania (przeglądarki internetowej). <br />
                Przykładowe opcje edytowania w popularnych przeglądarkach:
                <ol>
                  <li>
                    <a href="https://www.support.mozilla.org/pl/kb/ciasteczka">
                      Mozilla Firefox,
                    </a>
                  </li>
                  <li>
                    <a href="https://www.support.microsoft.com/kb/278835/pl">
                      Internet Explorer,
                    </a>
                  </li>
                  <li>
                    <a href="https://www.support.google.com/chrome/bin/answer.py?hl=pl&answer=95647">
                      Google Chrome,
                    </a>
                  </li>
                  <li>
                    <a href="https://www.safari.helpmax.net/pl/oszczedzanie-czasu/blokowanie-zawartosci/">
                      Safari,
                    </a>
                  </li>
                </ol>
              </li>
              <li className="list-group-item">
                Operator Serwisu informuje, że zmiany ustawień w przeglądarce
                internetowej użytkownika mogą uniemożliwić poprawne działanie
                Stron Internetowych.
              </li>
            </ol>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default PrivacyPolicy;
