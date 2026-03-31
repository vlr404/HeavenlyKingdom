    import './About.css';
    import { Quote } from '../../../components/Home/Quote/Quote.js';
    import { Divider } from '../../../components/Home/Divider/Divider.js';
    import { Benefits } from '../../../components/Home/Benefits/Benefits.js';
    import { QuoteBlock } from '../../../components/Home/QuoteBlock/QuoteBlock.js';
    import { Space } from '../../../components/common/Space/Space.js'; 

    export const About = () => {
        return (
            <section id="about" className="About">
                <Divider title = "О нас"/>
                <Quote text="Пріидите ко Мнѣ вси труждающіися и обремененніи, и Азъ упокою вы: возмите иго Мое на себе и научитеся от Меня,яко кротокъ есмь и смиренъ сердцемъ: и обрящете покой душамъ вашимъ." />
                <Benefits />
                <Space mt={100} />
                <QuoteBlock title="ПОСЕТИТЬ ЦЕРКОВЬ" text="Пріидите, возрадуемся Господеви, воскликнемъ Богу Спасителю нашему: предваримъ в лице Его во исповѣданіи, и во псалмѣхъ воскликнемъ Ему. Яко Богъ Велій Господь, и Царь Велій по всей земли." backgr_img= "foto/deva_mariya.png"/>
            </section>
        );
    };