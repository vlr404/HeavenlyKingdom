import './Events.css';
import { Quote } from '../../shared/Quote/Quote.tsx';
import { Divider } from '../../shared/Divider/Divider.tsx';
import { Calendar } from '../../shared/Calendar/Calendar.tsx';
import { QuoteBlock } from '../../shared/QuoteBlock/QuoteBlock.tsx';
import { Space } from '../../shared/Space/Space.tsx';

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