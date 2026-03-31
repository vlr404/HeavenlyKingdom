import './Events.css';
import { Quote } from '../../../components/Home/Quote/Quote.js';
import { Divider } from '../../../components/Home/Divider/Divider.js';
import { Calendar } from '../../../components/Home/Calendar/Calendar.js';
import { QuoteBlock } from '../../../components/Home/QuoteBlock/QuoteBlock.js';
import { Space } from '../../../components/common/Space/Space.js';

export const Events = () => {
    return (
        <section id="events" className="Events">
            <Divider title="События" />
            <Quote text="Валера лох." />
            <Calendar />
            <Space mt={100} />
            <QuoteBlock title="ОНЛАЙН-ПОЖЕРТВОВАНИE" text="бла-бла-бла валера лох." backgr_img="foto/Events.png" buttonText="Узнать больше" />
        </section>
    );
};