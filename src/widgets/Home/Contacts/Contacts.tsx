import './Contacts.css';
import { Map } from '../../../components/Home/Map/Map.js';
import { Divider } from '../../../components/Home/Divider/Divider.js';
import { Quote } from '../../../components/Home/Quote/Quote.js';
import { QuoteBlock } from '../../../components/Home/QuoteBlock/QuoteBlock.js';
import { Space}  from '../../../components/common/Space/Space.js'; 
export const Contacts = () => {
    return (
        <section id = "contacts" className="contacts">
            <Divider title="Контакты" />
            <div className="section-cotainer">
            <Quote text="Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, 
                        дабы всякий верующий в Него, не погиб, но имел жизнь вечную. 
                        Вера же есть осуществление ожидаемого и уверенность в невидимом." />
                <Map 
                    cords={[47.026101, 28.8345963]} 
                    adress="Piaţa Marii Adunări Naţionale 1" 
                    contacts="+(373)222 22 418"
                    emale="http://www.mitropolia.md/"
                />
                <Space mt={150} />
                <QuoteBlock title="СВЯЗАТЬСЯ С НАМИ" text="Пріидите, возрадуемся Господеви, воскликнемъ Богу Спасителю нашему: предваримъ в лице Его во исповѣданіи, и во псалмѣхъ воскликнемъ Ему. Яко Богъ Велій Господь, и Царь Велій по всей земли." backgr_img="./public/foto/Anghel.png"
                    socialmedia={{ instagram: "l", facebook: "l", gmail: "l", youtube: "l", telegram: "l"  }} 
                />
            </div>
        </section>
    )
};



