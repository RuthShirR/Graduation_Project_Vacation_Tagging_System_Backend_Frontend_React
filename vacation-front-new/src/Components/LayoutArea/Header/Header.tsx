
import Menu from "../Menu/Menu";
import "./Header.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


function Header(): JSX.Element {
    return (
        <div className="Header">
            <nav><Menu /></nav>
            
            <Carousel className="carousel" autoPlay={true} infiniteLoop={true} showThumbs={false}>
                <div className="main-image">
                    <div className="content">
                        <h3>Welcome To All Around The World Vacations Website !</h3>
                        <p>
                            With us you will find vacation packages at bargain prices for the most equal
                            destinations in the world
                        </p>
                    </div>
                </div>
                <div className="paphos-image">
                    <div className="content">
                        <h3>Perfect vacation in Paphos</h3>
                        <p>
                            Paphos, the capital of Western Cyprus, has a complex history. 
                            The site of the huge royal burial site from the fourth century BC, 
                            towering on a cliff top over the glittering sea, as well as a dramatic 
                            Byzantine castle and exquisite mosaics, the city is also known as the birthplace of the goddess Aphrodite.
                            The English, Germans and Scandinavians coming to the beach, the beautiful old port is waiting for you, 
                            with modern hotels and restaurants scattered along the promenade.
                        </p>
                    </div>
                </div>
                <div className="greece-image">
                    <div className="content">
                        <h3>Perfect vacation in Mykonos</h3>
                        <p>
                            Mykonos is the great glamour island of Greece and flaunts its sizzling St-Tropez-meets-Ibiza style and party-hard reputation. 
                            The high-season mix of hedonistic holidaymakers, cruise-ship crowds, buff gay men and posturing fashionistas throngs Mykonos Town (aka Hora),
                            a gorgeous whitewashed Cycladic maze, delighting in its cubist charms and its chichi cafe-bar-boutique scene.
                        </p>
                    </div>
                </div>
                <div className="ibiza-image">
                    <div className="content">
                        <h3>Perfect vacation in Ibiza</h3>
                        <p>
                            Ibiza: Old Spanish for "party 'til you drop." 
                            Perhaps not literally, but this is definitely one of Europe's favorite nightlife playgrounds. 
                            Ibiza boasts more than 100 miles of coastline with some 50 beaches, plus plenty of restaurants, bars, and water sports—and clubs, of course. 
                            Fit in a little culture and visit Ibiza's UNESCO-designated old town.
                        </p>
                    </div>
                </div>
            </Carousel>
        </div>
    );
}

export default Header;

