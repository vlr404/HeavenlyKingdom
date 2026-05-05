import './Benefits.css';
import { Button } from '../Button/Button';

export const Benefits = () => {
    return (
        <div className="features">
            <div className="features__grid">
                <div className="features__item">
                    <div className="features__icon"><img src={`${import.meta.env.BASE_URL}icons/belivers.png`} alt=""/></div>
                    <div className="features__title">Уверенность верующих</div>
                    <div className="features__description">Истинная вера становится твердой опорой в мире перемен. Мы созидаем общину, где каждый шаг направлен к свету, а сердце наполнено миром, который выше всякого разумения.</div>
                    <Button title="Подробнее"/>
                </div>

                <div className="features__item">
                    <div className="features__icon"><img src={`${import.meta.env.BASE_URL}icons/security.png`} alt=""/></div>
                    <div className="features__title">Вечная защита</div>
                    <div className="features__description">Под покровом Всевышнего душа обретает истинную безопасность. Вечные ценности, хранимые церковью, оберегают наш путь и даруют уверенность в завтрашнем дне.</div>
                    <Button title="Подробнее" />
                </div>

                <div className="features__item">
                    <div className="features__icon"><img src={`${import.meta.env.BASE_URL}icons/doctrina.png`} alt=""/></div>
                    <div className="features__title">Учение веры</div>
                    <div className="features__description">Познание божественной мудрости открывает путь к духовному преображению. Следуя древним наставлениям, мы укрепляемся в истине и открываем для себя глубину христианской жизни.</div>
                    <Button title="Подробнее" />
                </div>
            </div>
        </div>
    );
};