import './Events.css';
import { Quote } from '../../shared/Quote/Quote.jsx';
import { Divider } from '../../shared/Divider/Divider.jsx';
import { Calendar } from '../../shared/Calendar/Calendar.jsx';
import { QuoteBlock } from '../../shared/QuoteBlock/QuoteBlock.jsx';
import { Space } from '../../shared/Space/Space.jsx';

export const Events = () => {
    return (
        <section id="events" className="Events">
            <Divider title="События" />
            <Quote text="Валера лох." />
            <Calendar />
            <Space mt={100} />
            <QuoteBlock title="ОНЛАЙН-ПОЖЕРТВОВАНИE" text="бла-бла-бла валера лох." backgr_img="./public/foto/Events.png" buttonText="Узнать больше" />
        </section>
    );
};