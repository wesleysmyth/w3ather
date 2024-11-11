import styles from './loader.module.scss';
import React from 'react';
const {
    container,
    weather,
    cloud,
    front,
    back,
    sun,
    sunshine,
    leftFront,
    leftBack,
    rightFront,
    rightBack,
} = styles;

const Cloud: React.FC<{ position: 'front' | 'back' }> = ({ position }) => (
    <div className={`${cloud} ${styles[position]}`}>
        <span className={position === 'front' ? leftFront : leftBack}></span>
        <span className={position === 'front' ? rightFront : rightBack}></span>
    </div>
);

const Sun: React.FC = () => (
    <>
        <span className={`${sun} ${sunshine}`}></span>
        <span className={sun}></span>
    </>
);

const Loader: React.FC = () => {
    return (
        <div className={container} aria-hidden="true">
            <div className={weather}>
                <Cloud position="front" />
                <Sun />
                <Cloud position="back" />
            </div>
        </div>
    );
};

export default React.memo(Loader);
