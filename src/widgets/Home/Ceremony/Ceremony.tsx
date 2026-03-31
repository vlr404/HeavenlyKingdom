import './Ceremony.css';
import { Divider } from '../../../components/Home/Divider/Divider.js';
import { Quote } from '../../../components/Home/Quote/Quote.js';
import { QuoteBlock } from '../../../components/Home/QuoteBlock/QuoteBlock.js';
import { MediaBlock } from '../../../components/Home/MediaBlock/MediaBlock.js';
import { Space } from '../../../components/common/Space/Space.js';

export const Ceremony = () => {
    return (
        <section id = "ceremony" className="Ceremony">
             <Divider title="Церемонии" />   
             <Quote text="Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, 
                        дабы всякий верующий в Него, не погиб, но имел жизнь вечную. 
                        Вера же есть осуществление ожидаемого и уверенность в невидимом." />

             <MediaBlock />
            <Space mt={50}/>

             <QuoteBlock title="СЛОВО ПАСТЫРЯ" 
                text="Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, 
                        дабы всякий верующий в Него, не погиб, но имел жизнь вечную. 
                        Вера же есть осуществление ожидаемого и уверенность в невидимом."
                autor="Майк Эрмантраут" san="Ведущий пастор"
                backgr_img="./public/foto/testimonials.png"/>
        </section>
    );
};