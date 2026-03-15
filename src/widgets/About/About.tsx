    import './About.css';
    import { Quote } from '../../shared/Quote/Quote.jsx';
    import { Divider } from '../../shared/Divider/Divider.jsx';
    import { Benefits } from '../../shared/Benefits/Benefits.jsx';
    import { QuoteBlock } from '../../shared/QuoteBlock/QuoteBlock.jsx';
    import { Space } from '../../shared/Space/Space.jsx'; 

    export const About = () => {
        return (
            <section id="About" className="About">
                <Divider title = "О нас"/>
                <Quote text="Пріидите ко Мнѣ вси труждающіися и обремененніи, и Азъ упокою вы: возмите иго Мое на себе и научитеся от Меня,яко кротокъ есмь и смиренъ сердцемъ: и обрящете покой душамъ вашимъ." />
                <Benefits />
                <Space mt={100} />
                <QuoteBlock title="ПОСЕТИТЬ ЦЕРКОВЬ" text="Пріидите, возрадуемся Господеви, воскликнемъ Богу Спасителю нашему: предваримъ в лице Его во исповѣданіи, и во псалмѣхъ воскликнемъ Ему. Яко Богъ Велій Господь, и Царь Велій по всей земли." backgr_img= "foto/deva_mariya.png"/>
            </section>
        );
    };