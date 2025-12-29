import armaBackground from '@assets/img/arma-background.jpg';
import left4Dead2Background from '@assets/img/left-4-dead-2-background.jpg';
import runescapeBackground from '@assets/img/runescape-background.jpg';
import defaultBackground from '@assets/img/default-background.jpg';

const chooseBackground = (game) => {
    switch (game) {
        case 'Arma 3':
            return armaBackground;
        case 'Left 4 Dead 2':
            return left4Dead2Background;
        case 'RuneScape':
            return runescapeBackground;
        default:
            return defaultBackground;
    }
};

export default chooseBackground;
