import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import Header from "./header";

class ShopStatute extends Component {
  state = {
    title: "Regulamin Sklepu",
  };

  render() {
    const { title } = this.state;
    return (
      <React.Fragment>
        <Header title={title} />
        <main>
          <section className="container p-5">
            <p className="text-center">
              <strong>Regulamin sklepu internetowego</strong>
            </p>

            <p className="text-center">
              <strong>§ 1</strong>
            </p>

            <p>
              <strong>Postanowienia wstępne</strong>
            </p>

            <ol>
              <li>
                Sklep internetowy dostępny pod adresem internetowym
                www.damianlikus.com/sklep, prowadzony jest przez Likus Event –
                Marcin Likus wpisaną do Centralnej Ewidencji i Informacji o
                Działalności Gospodarczej (CEIDG) prowadzonej przez ministra
                właściwego ds. gospodarki, NIP 6282173618 REGON 384308430
              </li>
              <li>
                Niniejszy Regulamin skierowany jest zarówno do Konsumentów, jak
                i do Przedsiębiorców korzystających ze Sklepu i określa zasady
                korzystania ze Sklepu internetowego oraz zasady i tryb
                zawierania Umów Sprzedaży z Klientem na odległość za
                pośrednictwem Sklepu.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 2</strong>
            </p>

            <p>
              <strong>Definicje</strong>
            </p>

            <ol>
              <li>
                <strong>Konsument </strong>&#8211; osoba fizyczna zawierająca ze
                Sprzedawcą umowę w ramach Sklepu, której przedmiot nie jest
                związany bezpośrednio z jej działalnością gospodarczą lub
                zawodową.
              </li>
              <li>
                <strong>Sprzedawca </strong>&#8211; osoba fizyczna prowadząca
                działalność gospodarczą pod firmą Likus Event – Marcin Likus,
                wpisaną do Centralnej Ewidencji i Informacji o Działalności
                Gospodarczej (CEIDG) prowadzonej przez ministra właściwego ds.
                gospodarki, NIP 6282173618 REGON 384308430
              </li>
              <li>
                <strong>Klient </strong>&#8211; każdy podmiot dokonujący zakupów
                za pośrednictwem Sklepu.
              </li>
              <li>
                <strong>Przedsiębiorca </strong>&#8211; osoba fizyczna, osoba
                prawna i jednostka organizacyjna niebędąca osobą prawną, której
                odrębna ustawa przyznaje zdolność prawną, wykonująca we własnym
                imieniu działalność gospodarczą, która korzysta ze Sklepu.
              </li>
              <li>
                <strong>Sklep </strong>&#8211; sklep internetowy prowadzony
                przez Sprzedawcę pod adresem internetowym
                www.damianlikus.com/sklep
              </li>
              <li>
                <strong>Umowa zawarta na odległość</strong> &#8211; umowa
                zawarta z Klientem w ramach zorganizowanego systemu zawierania
                umów na odległość (w ramach Sklepu), bez jednoczesnej fizycznej
                obecności stron, z wyłącznym wykorzystaniem jednego lub większej
                liczby środków porozumiewania się na odległość do chwili
                zawarcia umowy włącznie.
              </li>
              <li>
                <strong>Regulamin </strong>&#8211; niniejszy regulamin Sklepu.
              </li>
              <li>
                <strong>Zamówienie </strong>&#8211; oświadczenie woli Klienta
                składane za pomocą Formularza Zamówienia i zmierzające
                bezpośrednio do zawarcia Umowy Sprzedaży Produktu lub Produktów
                ze Sprzedawcą.
              </li>
              <li>
                <strong>Formularz zamówienia</strong> &#8211; interaktywny
                formularz dostępny w Sklepie umożliwiający złożenie Zamówienia,
                w szczególności poprzez dodanie Produktów do Koszyka oraz
                określenie warunków Umowy Sprzedaży, w tym sposobu dostawy i
                płatności.
              </li>
              <li>
                <strong>Koszyk </strong>– element oprogramowania Sklepu, w
                którym widoczne są wybrane przez Klienta Produkty do zakupu, a
                także istnieje możliwość ustalenia i modyfikacji danych
                Zamówienia, w szczególności ilości produktów.
              </li>
              <li>
                <strong>Produkt </strong>&#8211; dostępna w Sklepie rzecz
                ruchoma/usługa będąca przedmiotem Umowy Sprzedaży między
                Klientem a Sprzedawcą.
              </li>
              <li>
                <strong>Umowa Sprzedaży</strong> &#8211; umowa sprzedaży
                Produktu zawierana albo zawarta między Klientem a Sprzedawcą za
                pośrednictwem Sklepu internetowego. Przez Umowę Sprzedaży
                rozumie się też &#8211; stosowanie do cech Produktu &#8211;
                umowę o świadczenie usług i umowę o dzieło.
              </li>
              <li>
                <strong>Pre-Order/Przedsprzedaż </strong>&#8211; oznacza
                sprzedaż produktu przed datą jego premiery. Klient podczas
                zakupu towaru w przedsprzedaży zgadza się na wysyłkę produktu
                najwcześniej na jeden dzień przed zaplanowaną premierą.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 3</strong>
            </p>

            <p>
              <strong>Kontakt ze Sklepem</strong>
            </p>

            <ol>
              <li>Adres e-mail Sprzedawcy: sklep@damianlikus.com</li>
              <li>
                Numer telefonu Sprzedawcy: 883&nbsp;133&nbsp;829,
                511&nbsp;171&nbsp;600,
              </li>
              <li>
                Klient może porozumiewać się ze Sprzedawcą za pomocą adresów i
                numerów telefonów podanych w niniejszym paragrafie.
              </li>
              <li>
                Klient może porozumieć się telefonicznie ze Sprzedawcą w
                godzinach 8:00-16:00 od poniedziałku do piątku.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 4</strong>
            </p>

            <p>
              <strong>Wymagania techniczne</strong>
            </p>

            <p>
              Do korzystania ze Sklepu, w tym przeglądania asortymentu Sklepu
              oraz składania zamówień na Produkty, niezbędne są:
            </p>

            <ol type="a">
              <li>
                urządzenie końcowe z dostępem do sieci Internet i przeglądarką
                internetową,
              </li>
              <li>aktywne konto poczty elektronicznej (e-mail),</li>
              <li>włączona obsługa plików cookies.</li>
            </ol>

            <p className="text-center">
              <strong>§ 5</strong>
            </p>

            <p>
              <strong>Informacje ogólne</strong>
            </p>

            <ol>
              <li>
                Sprzedawca w najszerszym dopuszczalnym przez prawo zakresie nie
                ponosi odpowiedzialności za zakłócenia w tym przerwy w
                funkcjonowaniu Sklepu spowodowane siłą wyższą, niedozwolonym
                działaniem osób trzecich lub niekompatybilnością Sklepu
                internetowego z infrastrukturą techniczną Klienta.
              </li>
              <li>
                Przeglądanie asortymentu Sklepu nie wymaga zakładania Konta.
                Składanie zamówienia możliwe jest przez podanie niezbędnych
                danych osobowych i adresowych w Formularzu zamówienia
                umożliwiających realizację Zamówienia.
              </li>
              <li>
                Ceny podane w Sklepie są podane w polskich złotych i są cenami
                brutto. (bez podatku VAT.)
              </li>
              <li>
                Sprzedawca jest zwolniony podmiotowo z podatku od towarów i
                usług [dostawa towarów lub świadczenie usług zwolnione na
                podstawie art. 113 ust. 1 (albo ust. 9) ustawy z dnia 11 marca
                2004r. o podatku od towarów i usług (Dz. U. z 2011r. Nr 177,
                poz. 1054, z późn. zm.)]
              </li>
              <li>
                Na końcową (ostateczną) kwotę do zapłaty przez Klienta składa
                się cena za Produkt oraz koszt dostawy (w tym opłaty za
                transport, dostarczenie i usługi pocztowe), o której Klient jest
                informowany na stronach Sklepu w trakcie składania Zamówienia, w
                tym także w chwili wyrażenia woli związania się Umową Sprzedaży.
              </li>
              <li>
                Gdy charakter przedmiotu Umowy nie pozwala, rozsądnie oceniając,
                na wcześniejsze obliczenie wysokości końcowej (ostatecznej)
                ceny, informacja o sposobie, w jaki cena będzie obliczana, a
                także o opłatach za transport, dostarczenie, usługi pocztowe
                oraz o innych kosztach, będzie podana w Sklepie w opisie
                Produktu.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 6</strong>
            </p>

            <p>
              <strong>Zasady składania Zamówienia</strong>
            </p>

            <p>W celu złożenia Zamówienia należy:</p>

            <ol>
              <li>
                wybrać Produkt będący przedmiotem Zamówienia, a następnie
                kliknąć przycisk „Do koszyka” (lub równoznaczny);
              </li>
              <li>
                wypełnić Formularz zamówienia poprzez wpisanie danych odbiorcy
                Zamówienia oraz adresu, na który ma nastąpić dostawa Produktu,
                wybrać rodzaj przesyłki (sposób dostarczenia Produktu), wpisać w
                uwagach do zamówienia dane do faktury, jeśli są inne niż dane
                odbiorcy Zamówienia<strong>,</strong>
              </li>
              <li>kliknąć przycisk “Zamawiam i płacę”,</li>
              <li>
                wybrać jeden z dostępnych sposobów płatności i w zależności od
                sposobu płatności, opłacić zamówienie w określonym terminie, z
                zastrzeżeniem § 7 pkt 3.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 7</strong>
            </p>

            <p>
              <strong>Oferowane metody dostawy oraz płatności</strong>
            </p>

            <ol>
              <li>
                Klient może skorzystać z następujących metod dostawy lub odbioru
                zamówionego Produktu:
                <ol>
                  <li>Przesyłka kurierska, przesyłka kurierska pobraniowa,</li>
                  <li>Odbiór osobisty na terenie Chrzanowa.</li>
                </ol>
              </li>
              <li>
                Klient może skorzystać z następujących metod płatności:
                <ol>
                  <li>Płatność przy odbiorze</li>
                  <li>Płatność za pobraniem</li>
                  <li>Płatności elektroniczne</li>
                  <li>Płatność kartą płatniczą.</li>
                  <li>Płatność Blikiem</li>
                  <li>Płatność przelewem online.</li>
                  <li>Płatność Apple Pay</li>
                  <li>Płatność Google Pay</li>
                </ol>
              </li>
              <li>
                Szczegółowe informacje na temat metod dostawy oraz
                akceptowalnych metod płatności znajdują się na stronach Sklepu.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 8</strong>
            </p>

            <p>
              <strong>Wykonanie umowy sprzedaży</strong>
            </p>

            <ol>
              <li>
                Zawarcie Umowy Sprzedaży między Klientem a Sprzedawcą następuje
                po uprzednim złożeniu przez Klienta Zamówienia za pomocą
                Formularza zamówienia w Sklepie internetowym zgodnie z § 6
                Regulaminu.
              </li>
              <li>
                Po złożeniu Zamówienia Sprzedawca niezwłocznie potwierdza jego
                otrzymanie oraz jednocześnie przyjmuje Zamówienie do realizacji.
                Potwierdzenie otrzymania Zamówienia i jego przyjęcie do
                realizacji następuje poprzez przesłanie przez Sprzedawcę
                Klientowi stosownej wiadomości e-mail na podany w trakcie
                składania Zamówienia adres poczty elektronicznej Klienta, która
                zawiera co najmniej oświadczenia Sprzedawcy o otrzymaniu
                Zamówienia i o jego przyjęciu do realizacji oraz potwierdzenie
                zawarcia Umowy Sprzedaży. Z chwilą otrzymania przez Klienta
                powyższej wiadomości e-mail zostaje zawarta Umowa Sprzedaży
                między Klientem a Sprzedawcą.
              </li>
              <li>
                W przypadku wyboru przez Klienta:
                <ol>
                  <li>
                    płatności przelewem online, płatności elektronicznych,
                    płatności kartą płatniczą, płatności Blikiem, płatności
                    Apple Pay, Płatności Google Pay, klient obowiązany jest do
                    dokonania płatności w terminie 1 dnia kalendarzowego od dnia
                    zawarcia Umowy Sprzedaży — w przeciwnym razie zamówienie
                    zostanie anulowane,
                  </li>
                  <li>
                    płatności za pobraniem przy odbiorze przesyłki, Klient
                    obowiązany jest do dokonania płatności przy odbiorze
                    przesyłki,
                  </li>
                  <li>
                    płatności gotówką przy odbiorze osobistym przesyłki, Klient
                    obowiązany jest dokonać płatności przy odbiorze przesyłki w
                    terminie 3 dni od dnia otrzymania informacji o gotowości
                    przesyłki do odbioru.
                  </li>
                </ol>
              </li>
              <li>
                Jeżeli Klient wybrał sposób dostawy inny niż odbiór osobisty,
                Produkt zostanie wysłany przez Sprzedawcę w terminie wskazanym w
                jego opisie (z zastrzeżeniem ustępu 5 niniejszego paragrafu), w
                sposób wybrany przez Klienta podczas składania Zamówienia.
              </li>
              <li>
                <ol>
                  <li>
                    W przypadku zamówienia Produktów o różnych terminach dostawy
                    terminem dostawy jest najdłuższy podany termin.
                  </li>
                  <li>
                    W przypadku zamówienia Produktów o różnych terminach
                    dostawy, Klient ma możliwość żądania dostarczenia Produktów
                    częściami lub też dostarczenia wszystkich Produktów po
                    skompletowaniu całego zamówienia.
                  </li>
                </ol>
              </li>
              <li>
                Początek biegu terminu dostawy Produktu do Klienta liczy się w
                następujący sposób:
                <ol>
                  <li>
                    W przypadku wyboru przez Klienta sposobu przelewem online
                    płatności elektronicznych, płatności kartą płatniczą,
                    płatności Blikiem, płatności Apple Pay, Płatności Google Pay
                    — od dnia uznania rachunku bankowego Sprzedawcy.
                  </li>
                  <li>
                    W przypadku wyboru przez Klienta sposobu płatności za
                    pobraniem – od dnia zawarcia Umowy Sprzedaży,
                  </li>
                </ol>
              </li>
              <li>
                W przypadku wyboru przez Klienta odbioru osobistego Produktu
                Produkt będzie gotowy do odbioru przez Klienta w terminie
                przesłanym drogą mailową. O gotowości Produktu do odbioru Klient
                zostanie poinformowany przez Sprzedawcę poprzez przesłanie
                stosownej wiadomości e-mail na podany w trakcie składania
                Zamówienia adres poczty elektronicznej Klienta.
              </li>
              <li>Dostawa Produktu odbywa się wyłącznie na terenie Polski.</li>
              <li>
                W przypadku zamówienia towaru w Pre-Orderze/Przedsprzedaży
                klient zgadza się na wysyłkę produktu najwcześniej na jeden
                dzień przed zaplanowaną premierą.
              </li>
              <li>
                Klient zostanie poinformowany o zakupie towaru będącego w
                przedsprzedaży w opisie produktu.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 9</strong>
            </p>

            <p>
              <strong>Prawo odstąpienia od umowy</strong>
            </p>

            <ol>
              <li>
                Konsument może w terminie 14 dni odstąpić od Umowy Sprzedaży bez
                podania jakiejkolwiek przyczyny.
              </li>
              <li>
                Bieg terminu określonego w ust. 1 rozpoczyna się od dostarczenia
                Produktu Konsumentowi lub wskazanej przez niego osobie innej niż
                przewoźnik.
              </li>
              <li>
                W przypadku Umowy, która obejmuje wiele Produktów, które są
                dostarczane osobno, partiami lub w częściach, termin wskazany w
                ust. 1 biegnie od dostawy ostatniej rzeczy, partii lub części.
              </li>
              <li>
                Konsument może odstąpić od Umowy, składając Sprzedawcy
                oświadczenie o odstąpieniu od Umowy. Do zachowania terminu
                odstąpienia od Umowy wystarczy wysłanie przez Konsumenta
                oświadczenia przed upływem tego terminu.
              </li>
              <li>
                Oświadczenie może być wysłane za pomocą tradycyjnej poczty, bądź
                drogą elektroniczną poprzez przesłanie oświadczenia na adres
                e-mail Sprzedawcy &#8211; dane kontaktowe Sprzedawcy zostały
                określone w § 3. Oświadczenie można złożyć również na
                formularzu, którego wzór stanowi załącznik nr 1 do niniejszego
                Regulaminu oraz załącznik do ustawy z dnia 30 maja 2014 roku o
                prawach konsumenta, jednak nie jest to obowiązkowe.
              </li>
              <li>
                W przypadku przesłania oświadczenia przez Konsumenta drogą
                elektroniczną, Sprzedawca niezwłocznie prześle Konsumentowi na
                podany przez Konsumenta adres e-mail potwierdzenie otrzymania
                oświadczenia o odstąpieniu od Umowy.
              </li>
              <li>
                Skutki odstąpienia od Umowy:
                <ol>
                  <li>
                    W przypadku odstąpienia od Umowy zawartej na odległość Umowę
                    uważa się za niezawartą.
                  </li>
                  <li>
                    W przypadku odstąpienia od Umowy Sprzedawca zwraca
                    Konsumentowi niezwłocznie, nie później niż w terminie 14 dni
                    od dnia otrzymania oświadczenia Konsumenta o odstąpieniu od
                    Umowy, wszystkie dokonane przez niego płatności, w tym
                    koszty dostarczenia rzeczy, z wyjątkiem dodatkowych kosztów
                    wynikających z wybranego przez Konsumenta sposobu
                    dostarczenia innego niż najtańszy zwykły sposób dostarczenia
                    oferowany przez Sprzedawcę.
                  </li>
                  <li>
                    Zwrotu płatności Sprzedawca dokona przy użyciu takich samych
                    metod płatności, jakie zostały przez Konsumenta użyte w
                    pierwotnej transakcji, chyba że Konsument wyraźnie zgodził
                    się na inne rozwiązanie, które nie będzie się wiązało dla
                    niego z żadnymi kosztami.
                  </li>
                  <li>
                    Sprzedawca może wstrzymać się ze zwrotem płatności do czasu
                    otrzymania Produktu z powrotem lub do czasu dostarczenia mu
                    dowodu jego odesłania, w zależności od tego, które zdarzenie
                    nastąpi wcześniej.
                  </li>
                  <li>
                    Konsument powinien odesłać Produkt na adres Sprzedawcy
                    podany w niniejszym Regulaminie niezwłocznie, nie później
                    niż 14 dni od dnia, w którym poinformował Sprzedawcę o
                    odstąpieniu od Umowy. Termin zostanie zachowany, jeśli
                    Konsument odeśle Produkt przed upływem terminu 14 dni.
                  </li>
                  <li>
                    Konsument ponosi bezpośrednie koszty zwrotu Produktu, także
                    koszty zwrotu Produktu, jeśli ze względu na swój charakter
                    Produkt ten nie mógł zostać w zwykłym trybie odesłany
                    pocztą.
                  </li>
                  <li>
                    Konsument odpowiada tylko za zmniejszenie wartości Produktu
                    wynikające z korzystania z niego w sposób, inny niż było to
                    konieczne do stwierdzenia charakteru, cech i funkcjonowania
                    Produktu.
                  </li>
                </ol>
              </li>
              <li>
                {" "}
                W przypadku gdy ze względu na charakter Produktu nie może on
                zostać odesłany w zwykłym trybie pocztą, informacja o tym, a
                także o kosztach zwrotu Produktu, będzie się znajdować w opisie
                Produktu w Sklepie.
              </li>
              <li>
                Prawo do odstąpienia od umowy zawartej na odległość nie
                przysługuje Konsumentowi w odniesieniu do Umowy:
                <ol>
                  <li>
                    w której przedmiotem świadczenia jest rzecz
                    nieprefabrykowana, wyprodukowana według specyfikacji
                    Konsumenta lub służąca zaspokojeniu jego
                    zindywidualizowanych potrzeb,
                  </li>
                  <li>
                    w której przedmiotem świadczenia jest rzecz dostarczana w
                    zapieczętowanym opakowaniu, której po otwarciu opakowania
                    nie można zwrócić ze względu na ochronę zdrowia lub ze
                    względów higienicznych, jeżeli opakowanie zostało otwarte po
                    dostarczeniu,
                  </li>
                  <li>
                    w które przedmiotem świadczenia jest rzecz ulegająca
                    szybkiemu zepsuciu lub mająca krótki termin przydatności do
                    użycia,
                  </li>
                  <li>
                    o świadczenie usług, jeżeli Sprzedawca wykonał w pełni
                    usługę za wyraźną zgodą Konsumenta, który został
                    poinformowany przez rozpoczęciem świadczenia, że po
                    spełnieniu świadczenia przez Sprzedawcę utraci prawo
                    odstąpienia od Umowy,
                  </li>
                  <li>
                    w którym cena lub wynagrodzenie zależy od wahań na rynku
                    finansowym, nad którym Sprzedawca nie sprawuje kontroli, i
                    które mogą wystąpić przed upływem terminu do odstąpienia od
                    Umowy,
                  </li>
                  <li>
                    w której przedmiotem świadczenia są rzeczy, które po
                    dostarczeniu, ze względu na swój charakter, zostają
                    nierozłącznie połączone z innymi rzeczami,
                  </li>
                  <li>
                    w której przedmiotem świadczenia są napoje alkoholowe,
                    których cena została uzgodniona przy zawarciu umowy
                    sprzedaży, a których dostarczenie może nastąpić dopiero po
                    upływie 30 dni i których wartość zależy od wahań na rynku,
                    nad którymi Sprzedawca nie ma kontroli,
                  </li>
                  <li>
                    w której przedmiotem świadczenia są nagrania dźwiękowe lub
                    wizualne albo programy komputerowe dostarczane w
                    zapieczętowanym opakowaniu, jeżeli opakowanie zostało
                    otwarte po dostarczeniu,
                  </li>
                  <li>
                    o dostarczanie dzienników, periodyków lub czasopism, z
                    wyjątkiem umowy o prenumeratę,
                  </li>
                  <li>
                    o dostarczenie treści cyfrowych, które nie są zapisane na
                    nośniku materialnym, jeżeli spełnianie świadczenia
                    rozpoczęło się za wyraźną zgodą Konsumenta przed upływem
                    terminu do odstąpienia od umowy i po poinformowaniu go przez
                    Sprzedawcę o utracie prawa odstąpienia od Umowy
                  </li>
                </ol>
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 10</strong>
            </p>

            <p>
              <strong>Reklamacja i gwarancja</strong>
            </p>

            <ol>
              <li>Umową Sprzedaży objęte są nowe Produkty.</li>
              <li>
                W przypadku wystąpienia wady zakupionego u Sprzedawcy towaru
                Klient ma prawo do reklamacji w oparciu o przepisy dotyczące
                rękojmi w kodeksie cywilnym. Jeżeli Klientem jest
                Przedsiębiorca, strony wyłączają odpowiedzialność z tytułu
                rękojmi.
              </li>
              <li>
                Reklamację należy zgłosić pisemnie lub drogą elektroniczną na
                podane w niniejszym Regulaminie adresy Sprzedawcy.
              </li>
              <li>
                Zaleca się, aby w reklamacji zawrzeć m.in. zwięzły opis wady,
                okoliczności (w tym datę) jej wystąpienia, dane Klienta
                składającego reklamację, oraz żądanie Klienta w związku z wadą
                towaru.
              </li>
              <li>
                Towary odsyłane w ramach procedury reklamacyjnej należy wysyłać
                na adres podany w § 3 niniejszego Regulaminu.
              </li>
              <li>
                W przypadku, gdy na Produkt została udzielona gwarancja,
                informacja o niej, a także jej treść, będą zawarte przy opisie
                Produktu w Sklepie.
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 11</strong>
            </p>

            <p>
              <strong>
                Pozasądowe sposoby rozpatrywania reklamacji i dochodzenia
                roszczeń
              </strong>
            </p>

            <ol>
              <li>
                Szczegółowe informacje dotyczące możliwości skorzystania przez
                Konsumenta z&nbsp; pozasądowych sposobów rozpatrywania
                reklamacji i dochodzenia roszczeń oraz zasady dostępu do tych
                procedur dostępne są w siedzibach oraz na stronach internetowych
                powiatowych (miejskich) rzeczników konsumentów, organizacji
                społecznych, do których zadań statutowych należy ochrona
                konsumentów, Wojewódzkich Inspektoratów Inspekcji Handlowej oraz
                pod następującymi adresami internetowymi Urzędu Ochrony
                Konkurencji i Konsumentów:
                http://www.uokik.gov.pl/spory_konsumenckie.php;
                http://www.uokik.gov.pl/sprawy_indywidualne.php oraz
                http://www.uokik.gov.pl/wazne_adresy.php.
              </li>
              <li>
                Konsument posiada następujące przykładowe możliwości
                skorzystania z pozasądowych sposobów rozpatrywania reklamacji i
                dochodzenia roszczeń:
              </li>
              <li>
                Konsument uprawniony jest do zwrócenia się do stałego
                polubownego sądu konsumenckiego, o którym mowa w art. 37 ustawy
                z dnia 15 grudnia 2000 r. o Inspekcji Handlowej (Dz.U. z 2014 r.
                poz. 148 z późn. zm.), z wnioskiem o rozstrzygnięcie sporu
                wynikłego z Umowy zawartej ze Sprzedawcą.
              </li>
              <li>
                Konsument uprawniony jest do zwrócenia się do wojewódzkiego
                inspektora Inspekcji Handlowej, zgodnie z art. 36 ustawy z dnia
                15 grudnia 2000 r. o Inspekcji Handlowej (Dz.U. z 2014 r. poz.
                148 z późn. zm.), z wnioskiem o wszczęcie postępowania
                mediacyjnego w sprawie polubownego zakończenia sporu między
                Konsumentem a Sprzedawcą.
              </li>
              <li>
                Konsument może uzyskać bezpłatną pomoc w sprawie rozstrzygnięcia
                sporu między nim a Sprzedawcą, korzystając także z bezpłatnej
                pomocy powiatowego (miejskiego) rzecznika konsumentów lub
                organizacji społecznej, do której zadań statutowych należy
                ochrona konsumentów (m.in. Federacja Konsumentów, Stowarzyszenie
                Konsumentów Polskich).
              </li>
            </ol>

            <p className="text-center">
              <strong>§ 12</strong>
            </p>

            <p>
              <strong>Dane osobowe w Sklepie internetowym</strong>
            </p>

            <ol>
              <li>
                Administratorem danych osobowych Klientów zbieranych za
                pośrednictwem Sklepu internetowego jest Sprzedawca.
              </li>
              <li>
                Dane osobowe Klientów zbierane przez administratora za
                pośrednictwem Sklepu internetowego zbierane są w celu realizacji
                Umowy Sprzedaży.
              </li>
              <li>
                Odbiorcami danych osobowych Klientów Sklepu internetowego mogą
                być:
                <ol>
                  <li>
                    W przypadku Klienta, który korzysta w Sklepie internetowym
                    ze sposobu dostawy przesyłką pocztową lub przesyłką
                    kurierską, Administrator udostępnia zebrane dane osobowe
                    Klienta wybranemu przewoźnikowi lub pośrednikowi
                    realizującemu przesyłki na zlecenie Administratora.
                  </li>
                  <li>
                    W przypadku Klienta, który korzysta w Sklepie internetowym
                    ze sposobu przelewem online, płatności elektronicznych,
                    płatności kartą płatniczą, płatności Blikiem, płatności
                    Apple Pay, Płatności Google Pay — Administrator udostępnia
                    zebrane dane osobowe Klienta, wybranemu podmiotowi
                    obsługującemu powyższe płatności w Sklepie internetowym.
                  </li>
                </ol>
              </li>
            </ol>

            <p>
              4. Klient ma prawo dostępu do treści swoich danych oraz ich
              poprawiania.
            </p>

            <p>
              5. Podanie danych osobowych jest dobrowolne, aczkolwiek niepodanie
              wskazanych w Regulaminie danych osobowych niezbędnych do zawarcia
              Umowy Sprzedaży skutkuje brakiem możliwości zawarcia tejże umowy.
            </p>

            <p className="text-center">
              <strong>§ 13</strong>
            </p>

            <p>
              <strong>Postanowienia końcowe</strong>
            </p>

            <p>
              1. Umowy zawierane poprzez Sklep internetowy zawierane są w języku
              polskim.
            </p>

            <p>
              2. Sprzedawca zastrzega sobie prawo do dokonywania zmian
              Regulaminu z ważnych przyczyn to jest: zmiany przepisów prawa,
              zmiany sposobów płatności i dostaw &#8211; w zakresie, w jakim te
              zmiany wpływają na realizację postanowień niniejszego Regulaminu..
            </p>

            <p>
              3. W sprawach nieuregulowanych w niniejszym Regulaminie mają
              zastosowanie powszechnie obowiązujące przepisy prawa polskiego, w
              szczególności: Kodeksu cywilnego; ustawy o świadczeniu usług drogą
              elektroniczną; ustawy o prawach konsumenta, ustawy o ochronie
              danych osobowych.
            </p>

            <p>
              4. Klient ma prawo skorzystać z pozasądowych sposobów
              rozpatrywania reklamacji i dochodzenia roszczeń. W tym celu może
              złożyć skargę za pośrednictwem unijnej platformy internetowej ODR
              dostępnej pod adresem:{" "}
              <a href="https://ec.europa.eu/consumers/odr/">
                https://ec.europa.eu/consumers/odr/
              </a>
              .
            </p>

            <p>
              <strong>Załącznik nr 1</strong>
            </p>

            <p>Wzór formularza odstąpienia od umowy</p>

            <p>
              (formularz ten należy wypełnić i odesłać tylko w przypadku chęci
              odstąpienia od umowy)
            </p>

            <p>
              – Adresat [w tym miejscu przedsiębiorca powinien wpisać nazwę
              przedsiębiorcy, pełny adres pocztowy oraz, o ile są dostępne,
              numer faksu i adres e-mail]
            </p>

            <p>
              – Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym
              odstąpieniu od umowy sprzedaży
            </p>

            <p>
              następujących rzeczy(*) umowy dostawy następujących rzeczy(*)
              umowy o dzieło polegającej na
            </p>

            <p>
              wykonaniu następujących rzeczy(*)/o świadczenie następującej
              usługi(*)
            </p>

            <p>– Data zawarcia umowy(*)/odbioru(*)</p>

            <p>– Imię i nazwisko konsumenta(-ów)</p>

            <p>– Adres konsumenta(-ów)</p>

            <p>
              – Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w
              wersji papierowej)
            </p>

            <p>– Data</p>

            <p>(*) Niepotrzebne skreślić</p>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default ShopStatute;
