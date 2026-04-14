import { Divider } from '../../../components/Home/Divider/Divider.js';
import { FatherGrid } from '../../../entity/FatherGrid/FatherGrid.js';
import { DonationBar } from "../../../components/Home/DonationBar/DonationBar.js";
import { Quote } from '../../../components/Home/Quote/Quote.js';


export const Father = () => {
    return (
        <section id="fathers" className="Father">
            <Divider title="Отцы" />
             <Quote text="Пріидите, возрадуемся Господеви, воскликнемъ Богу Спасителю нашему: предваримъ в лице Его во исповѣданіи, и во псалмѣхъ воскликнемъ Ему. Яко Богъ Велій Господь, и Царь Велій по всей земли." />
             <FatherGrid />  
            
             <DonationBar current={78560} goal={200000} title="ПОМОГИТЕ НАМ"
                    text="Пріидите, возрадуемся Господеви, воскликнемъ Богу Спасителю нашему: предваримъ в лице Его во исповѣданіи, и во псалмѣхъ воскликнемъ Ему. Яко Богъ Велій Господь, и Царь Велій по всей земли." 
                    valute="$"
              />
          
        </section>
    );
};